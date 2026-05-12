import getAuthErrorMessage from "@/components/hooks/ErrorMessage"
import { supabase } from "@/configuration/Supabase/supabaseClient"

const authRedirectUrl = `${window.location.origin}/change-password`

export function getUserRole(profile) {
  return profile?.role || "user"
}

export function getDashboardPath(profile) {
  return profile?.role === "admin"
    ? "/admin-dashboard"
    : "/owner-dashboard"
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

  const { data: sessionData } = await supabase.auth.getSession()

  if (!sessionData?.session) {
    throw new Error("Session not available after login")
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .single()

  if (profileError) {
    throw new Error(profileError.message)
  }

  console.log(profile);
  

  return {
    user,
    profile,
    session,
  }
}

// Register User Function 
export async function registerUser({
  fullName,
  email,
  password,
}) {
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

  if (error) {
    throw new Error(error.message)
  }
}


export async function fetchCurrentUser() {
  const { data: sessionData } = await supabase.auth.getSession()

  const user = sessionData?.session?.user

  if (!user) return null

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) throw error

  return {
    user,
    profile,
  }
}