import { supabase } from "@/configuration/Supabase/supabaseClient"

const authRedirectUrl = `${window.location.origin}/change-password`

export async function loginUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    throw new Error(error.message)
  }

  return data
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
    throw new Error(error.message)
  }

  return data
}

export async function changePassword({ password }) {
  const { data, error } = await supabase.auth.updateUser({ password })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
