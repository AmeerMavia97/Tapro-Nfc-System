import { supabase } from "@/configuration/Supabase/supabaseClient"

const authRedirectUrl = `${window.location.origin}/change-password`

export function getUserRole(profile) {
  return profile?.role || "user"
}

export function getDashboardPath(user) {
  return getUserRole(user) === "admin" ? "/admin-dashboard" : "/owner-dashboard"
}

function getAuthErrorMessage(message) {
  const normalizedMessage = message.toLowerCase()

  if (
    normalizedMessage.includes("already registered") ||
    normalizedMessage.includes("already exists") ||
    normalizedMessage.includes("user already")
  ) {
    return "This email already exists. Please sign in instead."
  }

  return message
}

export async function loginUser({ email, password }) {
  // 1. Login user (auth only)
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(getAuthErrorMessage(error.message))
  }

  const user = data.user

  // 2. Get role from your DB table
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role, full_name, email")
    .eq("id", user.id)
    .single()

  if (userError) {
    throw new Error(userError.message)
  }

  // 3. Return combined response
  return {
    user,
    profile: userData,
    session: data.session,
  }
}

export async function registerUser({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

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

export async function logoutUser() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }
}


export async function getCurrentUserData(userId) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single()

  if (error) {
    throw error
  }

  return data
}