import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Loader2, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import AuthCard from "@/components/Cards/AuthCard"
import AuthLayout from "@/Layout/AuthScreenLayout/AuthLayout"
import FormField from "@/components/ui/FormField"
import { registerUser, signInWithGoogle } from "@/services/authApi"

const Register = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectPath = searchParams.get("redirect")
  const [serverMessage, setServerMessage] = useState("")
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      reset()
      setServerMessage("Account created. Please sign in to continue activation.")
      setTimeout(() => {
        navigate(redirectPath ? `/login?redirect=${encodeURIComponent(redirectPath)}` : "/login", { replace: true })
      }, 700)
    },
    onError: (error) => setServerMessage(error.message),
  })

  const googleMutation = useMutation({
    mutationFn: () => signInWithGoogle({ redirectPath }),
    onError: (error) => setServerMessage(error.message),
  })

  return (
    <AuthLayout>
      <AuthCard
        title="Create account"
        description="Start your Tapro NFC workspace with secure account access."
        footerText="Already have an account?"
        footerLinkText="Sign in"
        footerTo={redirectPath ? `/login?redirect=${encodeURIComponent(redirectPath)}` : "/login"}
      >
        <button
          className="mb-5 flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          disabled={googleMutation.isPending}
          onClick={() => googleMutation.mutate()}
          type="button"
        >
          <span className="grid size-5 place-items-center rounded-full bg-white text-base font-bold text-slate-950">G</span>
          Sign up with Google
        </button>

        <div className="mb-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">or create with email</span>
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>

        <form
          className="grid gap-5"
          onSubmit={handleSubmit(({ fullName, email, password }) =>
            registerMutation.mutate({ fullName, email, password })
          )}
        >
          <FormField
            id="fullName"
            label="Full name"
            placeholder="Ameer Hamza"
            error={errors.fullName}
            registration={register("fullName", {
              required: "Full name is required",
              minLength: {
                value: 2,
                message: "Name is too short",
              },
            })}
          />

          <FormField
            id="email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            error={errors.email}
            registration={register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email address",
              },
            })}
          />

          <FormField
            id="password"
            label="Password"
            type="password"
            placeholder="Minimum 6 characters"
            error={errors.password}
            registration={register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />

          <FormField
            id="confirmPassword"
            label="Confirm password"
            type="password"
            placeholder="Repeat your password"
            error={errors.confirmPassword}
            registration={register("confirmPassword", {
              required: "Confirm your password",
              validate: (value) => value === getValues("password") || "Passwords do not match",
            })}
          />

          {serverMessage ? (
            <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{serverMessage}</p>
          ) : null}

          <Button
            className="h-11 w-full bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            disabled={registerMutation.isPending}
            type="submit"
          >
            {registerMutation.isPending ? <Loader2 className="animate-spin" /> : <UserPlus />}
            Create account
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}

export default Register
