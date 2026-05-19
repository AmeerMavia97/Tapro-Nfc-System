import getAuthErrorMessage from "@/components/hooks/ErrorMessage"
import { supabase } from "@/configuration/Supabase/supabaseClient"

const authRedirectUrl = `${window.location.origin}/change-password`
const AUTH_CACHE_KEY = "tapro-auth-user"
const AUTH_CACHE_VERSION = 1

export function getUserRole(profile) {
  return profile?.role || "user"
}

export function getDashboardPath(profile) {
  return profile?.role === "admin" ? "/admin-dashboard" : "/owner-dashboard"
}

function normalizeAuthPayload({ user, profile, session = null }) {
  return {
    user,
    profile,
    session,
  }
}

export function getCachedAuthUser(userId) {
  try {
    const rawCache = localStorage.getItem(AUTH_CACHE_KEY)
    if (!rawCache) return null

    const cached = JSON.parse(rawCache)

    if (cached?.version !== AUTH_CACHE_VERSION) return null
    if (!cached?.data?.user?.id || cached.data.user.id !== userId) return null

    return cached.data
  } catch {
    localStorage.removeItem(AUTH_CACHE_KEY)
    return null
  }
}

export function setCachedAuthUser(data) {
  if (!data?.user) return

  localStorage.setItem(
    AUTH_CACHE_KEY,
    JSON.stringify({
      version: AUTH_CACHE_VERSION,
      cachedAt: Date.now(),
      data,
    }),
  )
}

export function clearCachedAuthUser() {
  localStorage.removeItem(AUTH_CACHE_KEY)
}

export async function refreshCurrentUser() {
  const { data: sessionData } = await supabase.auth.getSession()
  const user = sessionData?.session?.user

  if (!user) {
    clearCachedAuthUser()
    return null
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) throw error

  const authData = normalizeAuthPayload({
    user,
    profile,
    session: sessionData.session,
  })

  setCachedAuthUser(authData)
  return authData
}

// Login User
export async function loginUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  const user = data.user
  const session = data.session

  if (!session || !user) {
    throw new Error("Session not available after login")
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (profileError) {
    throw new Error(profileError.message)
  }

  if (profile?.account_status === "blocked") {
    await supabase.auth.signOut()
    clearCachedAuthUser()
    throw new Error("Your account has been blocked by admin. Please contact support.")
  }

  const authData = normalizeAuthPayload({ user, profile, session })
  setCachedAuthUser(authData)

  return authData
}

// Register User Function
export async function registerUser({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/login`,
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    throw new Error(getAuthErrorMessage(error.message))
  }

  if (!data?.user || data?.user?.identities?.length === 0) {
    throw new Error("This email already exists. Please sign in instead.")
  }

  return data
}

// Reset Password
export async function sendResetPasswordEmail({ email }) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: authRedirectUrl,
  })

  if (error) {
    throw new Error(getAuthErrorMessage(error.message))
  }

  return data
}

export async function changePassword({ password }) {
  const { data, error } = await supabase.auth.updateUser({ password })

  if (error) {
    throw new Error(getAuthErrorMessage(error.message))
  }

  return data
}

// Logout User
export async function logoutUser() {
  const { error } = await supabase.auth.signOut()

  clearCachedAuthUser()

  if (error) {
    throw new Error(error.message)
  }
}

export async function fetchCurrentUser() {
  const { data: sessionData } = await supabase.auth.getSession()
  const user = sessionData?.session?.user

  if (!user) {
    clearCachedAuthUser()
    return null
  }

  const cachedAuthUser = getCachedAuthUser(user.id)
  if (cachedAuthUser) return cachedAuthUser

  return refreshCurrentUser()
}




// ADMIN PROFILE SETTING 
export async function getAdminProfile() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("User not found")
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id,full_name,email,role,account_status")
    .eq("id", user.id)
    .single()

  if (error) throw new Error(error.message)

  return data
}

export async function updateAdminProfile({ fullName }) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("User not found")
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName?.trim() || null,
    })
    .eq("id", user.id)
    .select("id,full_name,email,role,account_status")
    .single()

  if (error) throw new Error(error.message)

  return data
}