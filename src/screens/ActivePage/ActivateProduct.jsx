import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Loader2,
  LockKeyhole,
  MapPin,
  PartyPopper,
  Phone,
  Search,
  ShieldCheck,
  Star,
  UserPlus,
} from "lucide-react"
import { supabase } from "@/configuration/Supabase/supabaseClient"
import PinCodeInput from "@/components/ui/PinCodeInput"

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
        fields: [
          "place_id",
          "name",
          "formatted_address",
          "geometry",
          "types",
          "rating",
          "user_ratings_total",
          "formatted_phone_number",
          "opening_hours",
        ],
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
          lat: place.geometry?.location?.lat(),
          lng: place.geometry?.location?.lng(),
          address: place.formatted_address,
          type: place.types?.[0]?.replace(/_/g, " ") || "Business",
          rating: place.rating || null,
          reviews: place.user_ratings_total || null,
          phone: place.formatted_phone_number || "",
          openNow: typeof place.opening_hours?.isOpen === "function" ? place.opening_hours.isOpen() : place.opening_hours?.open_now,
          reviewUrl: `https://search.google.com/local/writereview?placeid=${place.place_id}`,
        })
      }
    )
  })
}

const getGooglePlaceDetails = async (placeId) => {
  if (!placeId) throw new Error("Google place id is missing.")

  const google = await loadGooglePlaces()
  const container = document.createElement("div")
  const service = new google.maps.places.PlacesService(container)

  return new Promise((resolve, reject) => {
    service.getDetails(
      {
        placeId,
        fields: ["place_id", "name", "geometry", "formatted_address", "types", "rating", "user_ratings_total", "formatted_phone_number", "opening_hours"],
      },
      (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
          reject(new Error("Google business details not found. Please enter the review URL manually."))
          return
        }

        resolve({
          placeId: place.place_id,
          name: place.name,
          lat: place.geometry?.location?.lat(),
          lng: place.geometry?.location?.lng(),
          address: place.formatted_address,
          type: place.types?.[0]?.replace(/_/g, " ") || "Business",
          rating: place.rating || null,
          reviews: place.user_ratings_total || null,
          phone: place.formatted_phone_number || "",
          openNow: typeof place.opening_hours?.isOpen === "function" ? place.opening_hours.isOpen() : place.opening_hours?.open_now,
          reviewUrl: `https://search.google.com/local/writereview?placeid=${place.place_id}`,
        })
      }
    )
  })
}

const getGoogleSuggestions = async (query) => {
  if (!query?.trim() || query.trim().length < 2) return []

  const google = await loadGooglePlaces()
  const service = new google.maps.places.AutocompleteService()

  return new Promise((resolve) => {
    service.getPlacePredictions(
      {
        input: query.trim(),
        types: ["establishment"],
      },
      (predictions, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions?.length) {
          resolve([])
          return
        }

        resolve(predictions)
      }
    )
  })
}

const getOrCreateActivationProfile = async (user, fallbackName = "") => {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id,full_name,email,role,account_status")
    .eq("id", user.id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (profile) return profile

  const fullName =
    fallbackName?.trim() ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Business Owner"

  const { data: createdProfile, error: createError } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      email: user.email,
      full_name: fullName,
      role: "user",
      account_status: "active",
    })
    .select("id,full_name,email,role,account_status")
    .single()

  if (createError) throw new Error(createError.message)
  return createdProfile
}

const ActivateProduct = () => {
  const { code } = useParams()
  const navigate = useNavigate()
  const cleanCode = normalizeCode(code)

  const [loading, setLoading] = useState(true)
  const [activating, setActivating] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const [authMode, setAuthMode] = useState("register")
  const [product, setProduct] = useState(null)
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState("")
  const [googleError, setGoogleError] = useState("")
  const [authMessage, setAuthMessage] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [redirectUrl, setRedirectUrl] = useState("")
  const [googlePlaceId, setGooglePlaceId] = useState("")
  const [googlePlaceLabel, setGooglePlaceLabel] = useState("")
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [showManualInput, setShowManualInput] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [suggestionsTouched, setSuggestionsTouched] = useState(false)
  const [authForm, setAuthForm] = useState({ fullName: "", email: "", pin: "", confirmPin: "" })


  useEffect(() => {
    if (!suggestionsTouched || !businessName.trim() || businessName.trim().length < 2) {
      setSuggestions([])
      return
    }

    const timeout = window.setTimeout(async () => {
      try {
        setSuggestionsLoading(true)
        const results = await getGoogleSuggestions(businessName)
        setSuggestions(results)
      } catch {
        setSuggestions([])
      } finally {
        setSuggestionsLoading(false)
      }
    }, 350)

    return () => window.clearTimeout(timeout)
  }, [businessName, suggestionsTouched])

  const loadProductState = async () => {
    setError("")

    const { data, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("unique_code", cleanCode)
      .maybeSingle()

    if (productError || !data) throw new Error("Invalid product code.")
    if (data.status === "blocked") throw new Error("This product is blocked. Please contact support.")

    if (data.activated) {
      if (data.redirect_url) {
        window.location.href = data.redirect_url
        return null
      }
      throw new Error("This product is already activated but redirect URL is missing.")
    }

    setProduct(data)
    if (data.business_name) setBusinessName(data.business_name)
    return data
  }

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const productData = await loadProductState()
        if (!productData) return

        const { data: sessionData } = await supabase.auth.getSession()
        const user = sessionData?.session?.user

        if (!user) {
          setIsLoggedIn(false)
          setActiveStep(1)
          return
        }

        const profileData = await getOrCreateActivationProfile(user)

        if (profileData?.role === "admin") {
          navigate("/admin-dashboard", { replace: true })
          return
        }

        if (profileData?.account_status === "blocked") throw new Error("Your account is blocked. You cannot activate products.")
        if (productData.owner_id && productData.owner_id !== user.id) throw new Error("This product is assigned to another business owner. Please login with the assigned owner account or contact admin.")

        setProfile(profileData)
        setIsLoggedIn(true)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [cleanCode, navigate])

  const handleSelectSuggestion = async (suggestion) => {
    setGoogleLoading(true)
    setGoogleError("")

    try {
      setBusinessName(suggestion.structured_formatting?.main_text || suggestion.description)
      setSuggestions([])
      setSuggestionsTouched(false)

      const result = await getGooglePlaceDetails(suggestion.place_id)
      setRedirectUrl(result.reviewUrl)
      setGooglePlaceId(result.placeId)
      setGooglePlaceLabel(`${result.name}${result.address ? `, ${result.address}` : ""}`)
      setSelectedBusiness(result)
      setShowManualInput(false)
      setActiveStep(3)
    } catch (err) {
      setGoogleError(err.message)
      setShowManualInput(true)
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleFindGoogleReviewLink = async () => {
    setGoogleLoading(true)
    setGoogleError("")

    try {
      const result = await findGoogleReviewUrl(businessName)
      setRedirectUrl(result.reviewUrl)
      setGooglePlaceId(result.placeId)
      setGooglePlaceLabel(`${result.name}${result.address ? `, ${result.address}` : ""}`)
      setSelectedBusiness(result)
      setShowManualInput(false)
    } catch (err) {
      setGoogleError(err.message)
      setShowManualInput(true)
    } finally {
      setGoogleLoading(false)
    }
  }

  const validateActivationFields = () => {
    if (!businessName.trim()) throw new Error("Business name is required.")
    if (!redirectUrl.trim()) throw new Error("Please connect Google review link or enter the redirect URL manually.")
  }

  const activateForUser = async ({ user, profileData }) => {
    validateActivationFields()

    if (profileData?.role === "admin") {
      navigate("/admin-dashboard", { replace: true })
      return
    }
    if (profileData?.account_status === "blocked") throw new Error("Your account is blocked. You cannot activate products.")
    if (product?.owner_id && product.owner_id !== user.id) throw new Error("This product is assigned to another business owner.")

    const { data, error: updateError } = await supabase
      .from("products")
      .update({
        activated: true,
        status: "active",
        owner_id: user.id,
        owner_name: profileData?.full_name || user.user_metadata?.full_name || null,
        owner_email: profileData?.email || user.email,
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

    setActiveStep(5)
  }

  const handleGoToConfirm = (event) => {
    event.preventDefault()
    setError("")
    try {
      validateActivationFields()
      setActiveStep(3)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleConfirmActivation = async () => {
    setError("")
    try {
      validateActivationFields()
      if (isLoggedIn) {
        setActivating(true)
        const { data: userData } = await supabase.auth.getUser()
        const user = userData?.user
        if (!user) throw new Error("Please login to complete activation.")
        const profileData = profile || (await getOrCreateActivationProfile(user))
        setProfile(profileData)
        await activateForUser({ user, profileData })
        return
      }
      setActiveStep(4)
    } catch (err) {
      setError(err.message)
    } finally {
      setActivating(false)
    }
  }

  const handleAuthAndActivate = async (event) => {
    event.preventDefault()
    setAuthMessage("")
    setError("")
    setAuthLoading(true)

    try {
      validateActivationFields()

      const email = authForm.email.trim()
      const pin = authForm.pin
      const confirmPin = authForm.confirmPin

      if (!email) throw new Error("Email is required.")
      if (!/^\d{6}$/.test(pin)) throw new Error("PIN must be exactly 6 digits.")


      // ✅ CONFIRM PIN VALIDATION
      if (authForm.pin !== authForm.confirmPin) {
        throw new Error("PIN and Confirm PIN do not match")
      }

      let authData = null

      if (authMode === "register") {
        if (!authForm.fullName.trim()) throw new Error("Full name is required.")

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password: pin,
          options: {
            emailRedirectTo: `${window.location.origin}/activate/${cleanCode}`,
            data: { full_name: authForm.fullName.trim() },
          },
        })

        if (signUpError) throw new Error(signUpError.message)
        if (!data?.session) {
          setAuthMessage("Account created. Please verify your email, then return to this activation page and login with your PIN to complete activation.")
          return
        }
        authData = data
      } else {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password: pin })
        if (loginError) throw new Error(loginError.message)
        authData = data
      }

      const user = authData?.user
      if (!user) throw new Error("Authentication failed. Please try again.")

      const profileData = await getOrCreateActivationProfile(user, authForm.fullName)
      setProfile(profileData)
      setIsLoggedIn(true)
      await activateForUser({ user, profileData })
    } catch (err) {
      setAuthMessage(err.message)
    } finally {
      setAuthLoading(false)
    }
  }

  const resetBusinessSelection = () => {
    setBusinessName("")          // ← empty input
    setSuggestions([])
    setSuggestionsTouched(false)

    setSelectedBusiness(null)
    setGooglePlaceId("")
    setGooglePlaceLabel("")
    setRedirectUrl("")
    setGoogleError("")
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-lime-50 via-white to-sky-50">
        <div className="flex items-center gap-3 rounded-[28px] border border-white bg-white/90 px-6 py-4 ">
          <Loader2 className="size-5 animate-spin text-lime-400" />
          <span className="text-sm font-semibold text-slate-600">Checking product...</span>
        </div>
      </main>
    )
  }

  const steps = [
    { number: 1, title: "Welcome" },
    { number: 2, title: "Find business" },
    { number: 3, title: "Confirm" },
    { number: 4, title: isLoggedIn ? "Activate" : "Create account" },
    { number: 5, title: "Done" },
  ]

  return (
    <main className="relative  flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f7fee7] via-[#f8fafc] to-[#f1f5f9] px-4 py-10 text-slate-950">
      {/* <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-lime-300/30 blur-3xl" /> */}
      {/* <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl" /> */}

      <div className="relative w-full max-w-3xl rounded-[34px] border border-white/70 bg-white/85 p-5 shadow-[0_30px_100px_rgba(15,23,42,0.16)] backdrop-blur-2xl sm:p-7 ">
        <div className="mb-6 text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] font-head text-black">Secure activation</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">QR Activate</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">Code: {product?.unique_code || cleanCode}</p>
        </div>

        <div className="mb-7 grid grid-cols-5 gap-2 rounded-[26px] bg-white p-2 ">
          {steps.map((step) => {
            const isActive = step.number === activeStep
            const isDone = step.number < activeStep
            return (
              <button
                className="flex flex-col items-center gap-1 rounded-2xl px-1 py-2 text-center transition"
                disabled
                key={step.title}
                type="button"
              >
                <span className={`grid size-9 font-head place-items-center rounded-full text-xs font-black shadow-sm ${isActive || isDone ? "bg-gradient-to-br from-black to-slate-950 text-white" : "bg-slate-100 text-slate-400"}`}>
                  {isDone ? <CheckCircle2 className="size-4" /> : step.number}
                </span>
                <span className={`text-[10px] font-head font-black sm:text-xs ${isActive ? "text-slate-950" : "text-slate-400"}`}>{step.title}</span>
              </button>
            )
          })}
        </div>

        {error && <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</div>}

        {!error && activeStep === 1 && (
          <section className="rounded-[28px]  bg-[#f7f7f7] px-5 py-9 text-center sm:px-8">
            <div className="mx-auto grid size-20 place-items-center rounded-full bg-[#E7E8EA] text-black ">
              <PartyPopper className="size-10" />
            </div>
            <h2 className="mt-6 text-3xl font-black tracking-tight font-head">Congratulations on scanning the QR code!</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-6 text-slate-600">
              Thank you for trusting us. You're one step away from activating your business and connecting with your customers.
            </p>
            <button className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-black to-slate-950 px-7 text-sm font-black text-white font-head transition hover:-translate-y-0.5" onClick={() => {
              resetBusinessSelection()
              setActiveStep(2)
            }} type="button">
              Get started <ArrowRight className="size-4" />
            </button>
          </section>
        )}

        {!error && activeStep === 2 && (
          <form className="space-y-5  rounded-[28px] bg-[#f7f7f7] p-5 sm:p-7" onSubmit={handleGoToConfirm}>
            <div>
              <h2 className="text-2xl font-head font-black">Find your business</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">Search your Google business profile or paste your review link manually.</p>
            </div>

            <div className="relative">
              <label className="text-sm font-bold font-head text-slate-700">Business name</label>
              <div className="mt-2 flex gap-2">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
                  <input className="h-13 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-[14px] font-medium outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100" onChange={(event) => { setBusinessName(event.target.value); setSuggestionsTouched(true); setSelectedBusiness(null); setRedirectUrl(""); setGooglePlaceId(""); setGooglePlaceLabel("") }} placeholder="Search business name" value={businessName} />
                </div>
                {/* <button className="h-12 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white disabled:opacity-60" disabled={googleLoading || !businessName.trim()} onClick={handleFindGoogleReviewLink} type="button">
                  {googleLoading ? <Loader2 className="size-4 animate-spin" /> : "Find"}
                </button> */}
              </div>

              {(suggestionsLoading || suggestions.length > 0) && (
                <div className="absolute z-10 mt-4 w-full  rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200">
                  {suggestionsLoading && <div className="px-4 py-3 text-sm font-semibold text-slate-500">Searching...</div>}
                  {suggestions.map((suggestion) => {
                    const mainText = suggestion.structured_formatting?.main_text || suggestion.description
                    const secondaryText = suggestion.structured_formatting?.secondary_text || ""
                    return (
                      <button className="flex w-full items-center gap-4 border-b border-slate-100 px-5 py-4 text-left transition last:border-b-0 hover:bg-slate-50" key={suggestion.place_id} onClick={() => handleSelectSuggestion(suggestion)} type="button">
                        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500">
                          <Building2 className="size-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-head truncate text-base font-black text-slate-950">{mainText}</span>
                          <span className="mt-1 block truncate text-sm font-medium text-slate-500">{secondaryText}</span>
                        </span>
                        <ArrowRight className="size-5 shrink-0 text-slate-500" />
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {googlePlaceLabel && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">Connected: {googlePlaceLabel}</div>}
            {googleError && <div className="rounded-2xl bg-lime-50 px-4 py-3 text-sm font-bold text-slate-700">{googleError}</div>}

            {/* {(showManualInput || redirectUrl) && (
              <div>
                <label className="text-sm font-bold text-slate-700">Google review or redirect URL</label>
                <input className="mt-2 h-12 w-full rounded-2xl border border-lime-100 bg-white px-4 text-sm font-semibold outline-none focus:border-lime-400 focus:ring-4 focus:ring-lime-100" onChange={(event) => setRedirectUrl(event.target.value)} placeholder="https://search.google.com/local/writereview?..." value={redirectUrl} />
              </div>
            )} */}

            {/* <button className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-lime-400 to-slate-950 text-sm font-black text-white shadow-xl shadow-lime-200" type="submit">
              Continue <ArrowRight className="size-4" />
            </button> */}
          </form>
        )}

        {!error && activeStep === 3 && (
          <section className="space-y-7 rounded-[28px] bg-[#f7f7f7] p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="font-head text-3xl font-black tracking-tight sm:text-2xl">Is this your business?</h2>
              <p className="mt-1 text-base font-medium text-slate-500 sm:text-sm">We found this listing on Google My Business. Confirm to continue.</p>
            </div>

            <div className="rounded-[22px] border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex items-start gap-5">

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black font-head text-slate-950 sm:text-md">{selectedBusiness?.name || businessName}</h3>
                      <p className="mt-1 capitalize text-md font-medium text-slate-500">{selectedBusiness?.type || "Business"}</p>
                    </div>

                  </div>
                  <div className="mt-5 flex items-center gap-2 text-base">
                    <Star className="size-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-black font-head text-slate-950">{selectedBusiness?.rating || "4.7"}</span>
                    <span className="font-medium font-head text-slate-500">({selectedBusiness?.reviews ? selectedBusiness.reviews.toLocaleString() : "Google"} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="my-6 h-px bg-slate-200" />

              <div className="space-y-4 text-base font-medium text-slate-950 mb-4">
                <div className="flex items-center gap-4">
                  <MapPin className="size-5 shrink-0 text-slate-500" />
                  <span className="text-[14px]">{selectedBusiness?.address || googlePlaceLabel || "Address not available"}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="size-5 shrink-0 text-slate-500" />
                  <span className="text-[14px]">{selectedBusiness?.phone || "Phone not available"}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Clock className="size-5 shrink-0 text-slate-500" />
                  <span className="text-[14px]">{selectedBusiness?.openNow === true ? "Open now" : selectedBusiness?.openNow === false ? "Closed now" : "Business hours not available"}</span>
                </div>
              </div>


              {selectedBusiness?.lat && selectedBusiness?.lng && (
                <iframe
                  src={`https://maps.google.com/maps?q=${selectedBusiness.lat},${selectedBusiness.lng}&z=17&output=embed`}
                  className="w-full h-[220px] sm:h-[300px] md:h-[250px] lg:h-[185px] rounded-[8px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button className="inline-flex h-12 items-center justify-center gap-3 rounded-full px-5 text-base font-black font-head text-slate-950 transition hover:bg-slate-50" onClick={() => {
                resetBusinessSelection()
                setActiveStep(2)
              }} type="button">
                <ArrowLeft className="size-5" /> Back
              </button>
              <button className="inline-flex h-13 items-center justify-center gap-3 bg-slate-950 px-8 font-head rounded-full text-[14.5px] font-black text-white  disabled:opacity-60" disabled={activating} onClick={handleConfirmActivation} type="button">
                {activating ? <Loader2 className="size-5 animate-spin" /> : "Yes, that's my business"}
                {!activating && <ArrowRight className="size-5" />}
              </button>
            </div>

            <button className="mx-auto font-head block text-center text-base font-medium text-slate-500 hover:text-slate-950" onClick={() => {
              resetBusinessSelection()
              setActiveStep(2)
            }} type="button">
              Not the right one? Search again
            </button>
          </section>
        )}

        {!error && activeStep === 4 && (
          <form className="space-y-5 rounded-[28px] bg-[#f7f7f7] p-6" onSubmit={handleAuthAndActivate}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-head font-black">{authMode === "register" ? "Create account" : "Login with PIN"}</h2>
                <p className="mt-1 text-sm font-medium text-slate-500">Use a simple 6 digit PIN instead of a long password.</p>
              </div>
              <button className="rounded-full bg-[#D7FF3F] px-4 py-2 text-xs text-black font-head" onClick={() => setAuthMode(authMode === "register" ? "login" : "register")} type="button">
                {authMode === "register" ? "I have an account" : "Create account"}
              </button>
            </div>

            {authMode === "register" && (
              <div>
                <label className="text-sm font-bold text-slate-700">Full name</label>
                <input className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-xs outline-none transition placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-3 focus-visible:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-slate-500 dark:focus-visible:ring-slate-800 dark:aria-invalid:border-red-400 dark:aria-invalid:ring-red-950" onChange={(event) => setAuthForm((prev) => ({ ...prev, fullName: event.target.value }))} placeholder="Business owner name" value={authForm.fullName} />
              </div>
            )}
            <div>
              <label className="text-sm font-bold text-slate-700">Email address</label>
              <input className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-xs outline-none transition placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-3 focus-visible:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-slate-500 dark:focus-visible:ring-slate-800 dark:aria-invalid:border-red-400 dark:aria-invalid:ring-red-950" onChange={(event) => setAuthForm((prev) => ({ ...prev, email: event.target.value }))} placeholder="you@example.com" type="email" value={authForm.email} />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700">6 digit PIN</label>
              <div className="mt-2"><PinCodeInput id="activationPin" label="" onChange={(value) => setAuthForm((prev) => ({ ...prev, pin: value }))} value={authForm.pin} /></div>
            </div>

            {authMode === "register" && (
              <div>
                <div className="mt-2">
                  {/* ✅ CONFIRM PIN FIELD */}
                  <PinCodeInput
                    value={authForm.confirmPin}
                    onChange={(v) =>
                      setAuthForm((p) => ({ ...p, confirmPin: v }))
                    }
                    label={"Confirm 6 digit PIN"}
                    helper="You’ll use this PIN to manage your QR code from any device."
                  />
                </div>
              </div>
            )}

            {authMessage && <div className="rounded-2xl bg-lime-50 px-4 py-3 text-sm font-bold text-slate-700">{authMessage}</div>}

            <button className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-black text-white font-head disabled:opacity-60" disabled={authLoading} type="submit">
              {authLoading ? <Loader2 className="size-4 animate-spin" /> : authMode === "register" ? <UserPlus className="size-4" /> : <LockKeyhole className="size-4" />}
              {authMode === "register" ? "Create and activate" : "Login and activate"}
            </button>
          </form>
        )}

        {!error && activeStep === 5 && (
          <section className="rounded-[28px] bg-[#f7f7f7] relative z-50 px-5 py-9 text-center sm:px-8">
            <div className="mx-auto grid size-20 place-items-center rounded-full bg-[#D7FF3F] text-black ">
              <CheckCircle2 className="size-11" />
            </div>
            <h2 className="mt-6 font-head text-3xl font-black tracking-tight">Your product is activated!</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-6 text-slate-600">Your QR/NFC code is now connected with your business. You can manage scans and product history from your owner dashboard.</p>
            <button className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-black font-head px-7 text-sm font-black text-white transition hover:-translate-y-0.5" onClick={() => navigate("/owner-dashboard?activated=success", { replace: true })} type="button">
              Go to dashboard
              <ArrowRight className="size-4" />
            </button>
          </section>
        )}
      </div>
    </main>
  )
}

export default ActivateProduct
