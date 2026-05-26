import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  MapPin,
  Search,
  ShieldCheck,
  UserPlus,
} from "lucide-react"
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

const getGooglePlaceDetails = async (placeId) => {
  if (!placeId) throw new Error("Google place id is missing.")

  const google = await loadGooglePlaces()
  const container = document.createElement("div")
  const service = new google.maps.places.PlacesService(container)

  return new Promise((resolve, reject) => {
    service.getDetails(
      {
        placeId,
        fields: ["place_id", "name", "formatted_address"],
      },
      (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
          reject(new Error("Google business details not found. Please enter the review URL manually."))
          return
        }

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
  const [showManualInput, setShowManualInput] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [suggestionsTouched, setSuggestionsTouched] = useState(false)
  const [authForm, setAuthForm] = useState({
    fullName: "",
    email: "",
    password: "",
  })

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

    if (data.status === "blocked") {
      throw new Error("This product is blocked. Please contact support.")
    }

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

        if (profileData?.account_status === "blocked") {
          throw new Error("Your account is blocked. You cannot activate products.")
        }

        if (productData.owner_id && productData.owner_id !== user.id) {
          throw new Error("This product is assigned to another business owner. Please login with the assigned owner account or contact admin.")
        }

        setProfile(profileData)
        setIsLoggedIn(true)
        setActiveStep(2)
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
      setShowManualInput(false)
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

    if (profileData?.account_status === "blocked") {
      throw new Error("Your account is blocked. You cannot activate products.")
    }

    if (product?.owner_id && product.owner_id !== user.id) {
      throw new Error("This product is assigned to another business owner.")
    }

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

    navigate("/owner-dashboard?activated=success", { replace: true })
  }

  const handleActivate = async (event) => {
    event.preventDefault()
    setError("")
    setActivating(true)

    try {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user

      if (!user) {
        validateActivationFields()
        setActiveStep(3)
        return
      }

      const profileData = profile || (await getOrCreateActivationProfile(user))
      setProfile(profileData)
      await activateForUser({ user, profileData })
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
      const password = authForm.password

      if (!email) throw new Error("Email is required.")
      if (!password || password.length < 6) throw new Error("Password must be at least 6 characters.")

      let authData = null

      if (authMode === "register") {
        if (!authForm.fullName.trim()) throw new Error("Full name is required.")

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/activate/${cleanCode}`,
            data: {
              full_name: authForm.fullName.trim(),
            },
          },
        })

        if (signUpError) throw new Error(signUpError.message)

        if (!data?.session) {
          setAuthMessage("Account created. Please verify your email, then return to this activation page and login to complete activation.")
          return
        }

        authData = data
      } else {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

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

  const canContinueToAuth = businessName.trim() && redirectUrl.trim()

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8fb]">
        <div className="flex items-center gap-3 rounded-[28px] border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <Loader2 className="size-5 animate-spin text-slate-950" />
          <span className="text-sm font-semibold text-slate-600">Checking product...</span>
        </div>
      </main>
    )
  }

  const steps = isLoggedIn
    ? [{ number: 1, title: "Activate" }]
    : [
      { number: 1, title: "Welcome" },
      { number: 2, title: "Find business" },
      { number: 3, title: authMode === "register" ? "Create account" : "Login" },
    ]

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8fb] px-4 py-10 text-slate-950">
      <div className="w-full max-w-2xl rounded-[32px] border border-slate-200/80 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">TAPro activation</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight">Activate Product</h1>
            <p className="text-sm font-medium text-slate-500">Code: {product?.unique_code || cleanCode}</p>
          </div>

          <div className="flex items-center gap-2">
            {steps.map((step, index) => {
              const currentStep = isLoggedIn ? 1 : activeStep
              const isActive = step.number === currentStep
              const isDone = step.number < currentStep

              return (
                <div className="flex items-center gap-2" key={step.title}>
                  <div className="flex flex-col gap-1 font-head text-sm justify-center items-center">
                    <span
                      className={`grid size-9 font-head place-items-center rounded-full text-xs font-black ${isActive || isDone ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-400"
                        }`}
                    >
                      {isDone ? <CheckCircle2 className="size-4" /> : step.number}

                    </span>
                    {step.title}
                  </div>

                  {index < steps.length - 1 && <span className="h-px w-6 bg-slate-200" />}

                </div>
              )
            })}
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {!error && !isLoggedIn && activeStep === 1 && (
          <div className="space-y-5">
            <div className="rounded-3xl items-center flex justify-center flex-col border border-slate-200 bg-slate-50/80 px-5 py-7">
              <div className="flex size-16 items-center justify-center rounded-full bg-[#E7E8EA] text-black shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-party-popper h-8 w-8" aria-hidden="true"><path d="M5.8 11.3 2 22l10.7-3.79"></path><path d="M4 3h.01"></path><path d="M22 8h.01"></path><path d="M15 2h.01"></path><path d="M22 20h.01"></path><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"></path><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"></path><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"></path><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"></path></svg>
              </div>
              <h2 className="mt-5 text-2xl font-head font-black">Thank You for Choosing TAPro Review Card
              </h2>
              <p className="mt-2 text-sm text-center leading-6 text-slate-500">
                Thank you for trusting us. You're one step away from activating your business and connecting with your customers.
              </p>

              <button
                className="inline-flex mt-5  items-center justify-center gap-2 rounded-full bg-[#101124] px-8 py-3.5 cursor-pointer w-max text-sm font-semibold text-white shadow-lg shadow-[#101124]/15 transition hover:bg-black"
                onClick={() => setActiveStep(2)}
                type="button"
              >
                Start Activation
                <ArrowRight className="size-4" />
              </button>
            </div>




          </div>
        )}

        {!error && activeStep === 2 && (
          <form className="space-y-4" onSubmit={handleActivate}>
            <div className="relative">
              <label className="mb-2 block text-sm font-bold">Business Name</label>
              <input
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200"
                placeholder="Restaurant ABC"
                value={businessName}
                onChange={(event) => {
                  setBusinessName(event.target.value)
                  setRedirectUrl("")
                  setGooglePlaceId("")
                  setGooglePlaceLabel("")
                  setSuggestionsTouched(true)
                }}
                required
              />

              {suggestionsTouched && (suggestionsLoading || suggestions.length > 0) && (
                <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                  {suggestionsLoading && (
                    <div className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-500">
                      <Loader2 className="size-4 animate-spin" />
                      Searching Google businesses...
                    </div>
                  )}

                  {!suggestionsLoading && suggestions.map((suggestion) => (
                    <button
                      key={suggestion.place_id}
                      type="button"
                      className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm transition hover:bg-slate-50"
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      <MapPin className="mt-0.5 size-4 shrink-0 text-blue-600" />
                      <span>
                        <span className="block font-bold text-slate-950">
                          {suggestion.structured_formatting?.main_text || suggestion.description}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {suggestion.structured_formatting?.secondary_text || suggestion.description}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-sm font-black font-head">Google Review Link</p>
                  <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                    Select a suggestion or click the button to attach your Google review page automatically.
                  </p>
                </div>

                <button
                  className="inline-flex h-11 min-w-[170px] items-center justify-center gap-2 rounded-full bg-[#D7FF3F] px-5 text-sm font-semibold text-black shadow-lg shadow-blue-600/20 transition hover:bg-[#d5ff3fd9] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={googleLoading || !businessName.trim()}
                  onClick={handleFindGoogleReviewLink}
                  type="button"
                >
                  {googleLoading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
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
                className="mt-3 text-sm font-bold text-black hover:underline"
                onClick={() => setShowManualInput((value) => !value)}
                type="button"
              >
                {showManualInput ? "Hide manual URL" : "Having issue? Enter review URL manually"}
              </button>
            </div>

            {showManualInput && (
              <div>
                <label className="mb-2 block text-sm font-bold">Manual Redirect URL</label>
                <input
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200"
                  placeholder="https://search.google.com/local/writereview?placeid=..."
                  value={redirectUrl}
                  onChange={(event) => setRedirectUrl(event.target.value)}
                />
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              {!isLoggedIn && (
                <button
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  onClick={() => setActiveStep(1)}
                  type="button"
                >
                  <ArrowLeft className="size-4" />
                  Back
                </button>
              )}

              <button
                className="inline-flex flex-[2] justify-center items-center gap-2 rounded-full bg-[#101124] px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-[#101124]/15 transition hover:bg-black disabled:cursor-not-allowed disabled:bg-slate-400"
                disabled={activating || !businessName.trim() || !redirectUrl.trim()}
                type="submit"
              >
                {activating ? <Loader2 className="size-5 animate-spin" /> : isLoggedIn ? <CheckCircle2 className="size-5" /> : <ArrowRight className="size-5" />}
                {activating ? "Activating..." : isLoggedIn ? "Activate & Lock Product" : "Continue"}
              </button>
            </div>
          </form>
        )}

        {!error && !isLoggedIn && activeStep === 3 && (
          <form className="space-y-4" onSubmit={handleAuthAndActivate}>
            <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
              <div className="mb-4 flex rounded-full bg-white p-1 shadow-sm">
                <button
                  className={`flex-1 font-head rounded-full px-4 py-2 text-sm font-bold transition ${authMode === "register" ? "bg-slate-950 text-white" : "text-slate-500"}`}
                  onClick={() => {
                    setAuthMode("register")
                    setAuthMessage("")
                  }}
                  type="button"
                >
                  Register
                </button>
                <button
                  className={`flex-1 font-head rounded-full px-4 py-2 text-sm font-bold transition ${authMode === "login" ? "bg-slate-950 text-white" : "text-slate-500"}`}
                  onClick={() => {
                    setAuthMode("login")
                    setAuthMessage("")
                  }}
                  type="button"
                >
                  Login
                </button>
              </div>

              <div className="mb-4 flex items-start gap-3 rounded-2xl bg-white p-4">
                {authMode === "register" ? <UserPlus className="mt-0.5 size-5 text-black" /> : <LockKeyhole className="mt-0.5 size-5 text-black" />}
                <div>
                  <p className="text-xl font-head font-black">{authMode === "register" ? "Create owner account" : "Login to owner account"}</p>
                  <p className="mt-1 font-head text-xs leading-5 text-slate-500">
                    After this step, the product will activate and lock to this account automatically.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {authMode === "register" && (
                  <input
                    className={"h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-xs outline-none transition placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-3 focus-visible:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-slate-500 dark:focus-visible:ring-slate-800 dark:aria-invalid:border-red-400 dark:aria-invalid:ring-red-950"}
                    placeholder="Full name"
                    value={authForm.fullName}
                    onChange={(event) => setAuthForm((prev) => ({ ...prev, fullName: event.target.value }))}
                  />
                )}

                <input
                  className={"h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-xs outline-none transition placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-3 focus-visible:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-slate-500 dark:focus-visible:ring-slate-800 dark:aria-invalid:border-red-400 dark:aria-invalid:ring-red-950"}
                  placeholder="Email address"
                  type="email"
                  value={authForm.email}
                  onChange={(event) => setAuthForm((prev) => ({ ...prev, email: event.target.value }))}
                />

                <input
                  className={"h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-xs outline-none transition placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-3 focus-visible:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-slate-500 dark:focus-visible:ring-slate-800 dark:aria-invalid:border-red-400 dark:aria-invalid:ring-red-950"}
                  // className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200"
                  placeholder="Password"
                  type="password"
                  value={authForm.password}
                  onChange={(event) => setAuthForm((prev) => ({ ...prev, password: event.target.value }))}
                />
              </div>

              {authMessage && (
                <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                  {authMessage}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                onClick={() => setActiveStep(2)}
                type="button"
              >
                <ArrowLeft className="size-4" />
                Back
              </button>

              <button
                className="inline-flex flex-[2] items-center justify-center gap-2 rounded-full bg-[#101124] px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-[#101124]/15 transition hover:bg-black disabled:cursor-not-allowed disabled:bg-slate-400"
                disabled={authLoading || !canContinueToAuth}
                type="submit"
              >
                {authLoading ? <Loader2 className="size-5 animate-spin" /> : <CheckCircle2 className="size-5" />}
                {authLoading ? "Processing..." : authMode === "register" ? "Create Account & Activate" : "Login & Activate"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}

export default ActivateProduct
