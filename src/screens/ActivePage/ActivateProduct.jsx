import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { CheckCircle2, Loader2, Search, ShieldCheck } from "lucide-react"
import { supabase } from "@/configuration/Supabase/supabaseClient"

const normalizeCode = (code) => String(code || "").trim().toUpperCase()
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

let googlePlacesPromise = null

const loadGooglePlaces = () => {
  if (!GOOGLE_MAPS_API_KEY) {
    return Promise.reject(new Error("Google Places API key is missing. Please add VITE_GOOGLE_MAPS_API_KEY or use manual review URL."))
  }

  if (window.google?.maps?.places) return Promise.resolve(window.google)

  if (!googlePlacesPromise) {
    googlePlacesPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[data-google-places="true"]')

      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(window.google))
        existingScript.addEventListener("error", () => reject(new Error("Google Places script failed to load.")))
        return
      }

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.dataset.googlePlaces = "true"
      script.onload = () => resolve(window.google)
      script.onerror = () => reject(new Error("Google Places script failed to load."))
      document.head.appendChild(script)
    })
  }

  return googlePlacesPromise
}

const findGoogleReviewUrl = async (query) => {
  if (!query?.trim()) throw new Error("Please enter business name first.")

  const google = await loadGooglePlaces()
  const container = document.createElement("div")
  const service = new google.maps.places.PlacesService(container)

  return new Promise((resolve, reject) => {
    service.findPlaceFromQuery(
      {
        query: query.trim(),
        fields: ["place_id", "name", "formatted_address"],
      },
      (results, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !results?.length) {
          reject(new Error("Google business not found. Please enter the review URL manually."))
          return
        }

        const place = results[0]
        resolve({
          placeId: place.place_id,
          name: place.name,
          address: place.formatted_address,
          reviewUrl: `https://search.google.com/local/writereview?placeid=${place.place_id}`,
        })
      }
    )
  })
}

const ActivateProduct = () => {
  const { code } = useParams()
  const navigate = useNavigate()
  const cleanCode = normalizeCode(code)

  const [loading, setLoading] = useState(true)
  const [activating, setActivating] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [product, setProduct] = useState(null)
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState("")
  const [googleError, setGoogleError] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [redirectUrl, setRedirectUrl] = useState("")
  const [googlePlaceId, setGooglePlaceId] = useState("")
  const [googlePlaceLabel, setGooglePlaceLabel] = useState("")
  const [showManualInput, setShowManualInput] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setError("")

        const { data: sessionData } = await supabase.auth.getSession()
        const user = sessionData?.session?.user

        if (!user) {
          navigate(`/login?redirect=/activate/${cleanCode}`, { replace: true })
          return
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id,full_name,email,role,account_status")
          .eq("id", user.id)
          .single()

        if (profileError) throw new Error(profileError.message)

        if (profileData?.role === "admin") {
          navigate("/admin-dashboard", { replace: true })
          return
        }

        if (profileData?.account_status === "blocked") {
          throw new Error("Your account is blocked. You cannot activate products.")
        }

        const { data, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("unique_code", cleanCode)
          .maybeSingle()

        if (productError || !data) throw new Error("Invalid product code.")

        if (data.status === "blocked") {
          throw new Error("This product is blocked. Please contact support.")
        }

        if (data.activated) {
          if (data.redirect_url) {
            window.location.href = data.redirect_url
            return
          }

          throw new Error("This product is already activated but redirect URL is missing.")
        }

        if (data.owner_id && data.owner_id !== user.id) {
          throw new Error("This product is assigned to another business owner. Please login with the assigned owner account or contact admin.")
        }

        setProfile(profileData)
        setProduct(data)
        if (data.business_name) setBusinessName(data.business_name)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [cleanCode, navigate])

  const handleFindGoogleReviewLink = async () => {
    setGoogleLoading(true)
    setGoogleError("")

    try {
      const result = await findGoogleReviewUrl(businessName)
      setRedirectUrl(result.reviewUrl)
      setGooglePlaceId(result.placeId)
      setGooglePlaceLabel(`${result.name}${result.address ? `, ${result.address}` : ""}`)
      setShowManualInput(false)
    } catch (err) {
      setGoogleError(err.message)
      setShowManualInput(true)
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleActivate = async (event) => {
    event.preventDefault()
    setError("")
    setActivating(true)

    try {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user

      if (!user) {
        navigate(`/login?redirect=/activate/${cleanCode}`, { replace: true })
        return
      }

      if (profile?.role === "admin") {
        navigate("/admin-dashboard", { replace: true })
        return
      }

      if (profile?.account_status === "blocked") {
        throw new Error("Your account is blocked. You cannot activate products.")
      }

      if (product?.owner_id && product.owner_id !== user.id) {
        throw new Error("This product is assigned to another business owner.")
      }

      if (!businessName.trim()) throw new Error("Business name is required.")
      if (!redirectUrl.trim()) throw new Error("Please connect Google review link or enter the redirect URL manually.")

      const { data, error: updateError } = await supabase
        .from("products")
        .update({
          activated: true,
          status: "active",
          owner_id: user.id,
          owner_name: profile?.full_name || user.user_metadata?.full_name || null,
          owner_email: profile?.email || user.email,
          business_name: businessName.trim(),
          activation_time: new Date().toISOString(),
          redirect_url: redirectUrl.trim(),
          google_place_id: googlePlaceId || null,
        })
        .eq("unique_code", cleanCode)
        .eq("activated", false)
        .select("*")
        .single()

      if (updateError) throw new Error(updateError.message)

      try {
        await supabase.from("activity_logs").insert({
          user_id: user.id,
          action_type: "Product Activated",
          action_description: `${cleanCode} activated by ${businessName.trim()}`,
          metadata: {
            product_id: data.id,
            unique_code: cleanCode,
            business_name: businessName.trim(),
            google_place_id: googlePlaceId || null,
          },
        })
      } catch (logError) {
        console.warn("Activity log failed", logError)
      }

      navigate("/owner-dashboard?activated=success", { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setActivating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin" />
      </div>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8fb] px-4 text-slate-950">
      <div className="w-full max-w-xl rounded-[32px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-4">
          {/* <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
            <ShieldCheck className="size-6" />
          </div> */}

          <div>
            <h1 className="text-2xl font-black tracking-tight">Activate Product</h1>
            <p className="text-sm font-medium text-slate-500">
              Code: {product?.unique_code || cleanCode}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {!error && (
          <form className="space-y-4" onSubmit={handleActivate}>
            <div>
              <label className="mb-2 block text-sm font-bold">
                Business Name
              </label>
              <input
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200"
                placeholder="Restaurant ABC"
                value={businessName}
                onChange={(event) => {
                  setBusinessName(event.target.value)
                  setRedirectUrl("")
                  setGooglePlaceId("")
                  setGooglePlaceLabel("")
                }}
                required
              />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-sm font-black font-head">Google Review Link</p>
                  <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                    Click the button to find and attach your Google review page automatically.
                  </p>
                </div>

                <button
                  className="inline-flex h-11 min-w-[170px] items-center justify-center gap-2 rounded-full font-head bg-blue-600 px-5 text-sm  text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 font-semibold"
                  disabled={googleLoading || !businessName.trim()}
                  onClick={handleFindGoogleReviewLink}
                  type="button"
                >
                  {googleLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Search className="size-4" />
                  )}
                  {googleLoading ? "Searching..." : "Find Google Link"}
                </button>
              </div>

              {googlePlaceLabel && (
                <div className="mt-3 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                  Connected: {googlePlaceLabel}
                </div>
              )}

              {googleError && (
                <div className="mt-3 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                  {googleError}
                </div>
              )}

              <button
                className="mt-3 text-sm font-bold text-blue-600 hover:underline"
                onClick={() => setShowManualInput((value) => !value)}
                type="button"
              >
                {showManualInput ? "Hide manual URL" : "Having issue? Enter review URL manually"}
              </button>
            </div>

            {showManualInput && (
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Manual Redirect URL
                </label>
                <input
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200"
                  placeholder="https://search.google.com/local/writereview?placeid=..."
                  value={redirectUrl}
                  onChange={(event) => setRedirectUrl(event.target.value)}
                />
              </div>
            )}

            <button
              className="inline-flex w-full justify-center items-center gap-2 rounded-full bg-[#101124] px-5 py-4.5 text-sm font-semibold text-white shadow-lg shadow-[#101124]/15 transition hover:bg-black hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={activating || !businessName.trim() || !redirectUrl.trim()}
              type="submit"
            >
              {activating ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <CheckCircle2 className="size-5" />
              )}
              {activating ? "Activating..." : "Activate & Lock Product"}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}

export default ActivateProduct