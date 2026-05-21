import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { ArrowRight, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import AuthCard from "@/components/Cards/AuthCard"
import AuthLayout from "@/Layout/AuthScreenLayout/AuthLayout"
import FormField from "@/components/ui/FormField"
import { AUTH_USER_QUERY_KEY } from "@/components/hooks/useAuthUser"
import { getDashboardPath, loginUser, signInWithGoogle } from "@/services/authApi"

const Login = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectPath = searchParams.get("redirect")
  const queryClient = useQueryClient()
  const [serverMessage, setServerMessage] = useState("")
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (authData) => {
      queryClient.setQueryData(AUTH_USER_QUERY_KEY, authData)
      setServerMessage("Welcome back. You are signed in.")
      navigate(redirectPath || getDashboardPath(authData.profile), { replace: true })
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
        title="Welcome back"
        description="Sign in to continue managing your Tapro NFC account."
        footerText="New to Tapro?"
        footerLinkText="Create an account"
        footerTo={redirectPath ? `/register?redirect=${encodeURIComponent(redirectPath)}` : "/register"}
      >
        <button
          className="mb-5 flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          disabled={googleMutation.isPending}
          onClick={() => googleMutation.mutate()}
          type="button"
        >
          <span className="grid size-5 place-items-center rounded-full bg-white text-base font-bold text-slate-950">G</span>
          Continue with Google
        </button>

        <div className="mb-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">or sign in with email</span>
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit((values) => loginMutation.mutate(values))}>
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

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium leading-none text-slate-950 dark:text-slate-100" htmlFor="password">
                Password
              </label>
             
            </div>
            <FormField
              id="password"
              label=""
              type="password"
              placeholder="Enter your password"
              error={errors.password}
              registration={register("password", {
                required: "Password is required",
              })}
            />

            <div className="flex items-end justify-end gap-3 mt-1">
              <Link className="text-sm font-medium text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white" to="/reset-password">
                Forgot password?
              </Link>
            </div>
          </div>

          {serverMessage ? (
            <p className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700 dark:bg-slate-800 dark:text-slate-200">{serverMessage}</p>
          ) : null}

          <Button
            className="h-11 w-full bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            disabled={loginMutation.isPending}
            type="submit"
          >
            {loginMutation.isPending ? <Loader2 className="animate-spin" /> : <ArrowRight />}
            Sign in
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}

export default Login
