import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { ArrowRight, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import AuthCard from "@/components/Cards/AuthCard"
import AuthLayout from "@/Layout/AuthScreenLayout/AuthLayout"
import FormField from "@/components/ui/FormField"
import { getDashboardPath, loginUser } from "@/services/authApi"

const Login = () => {
  const navigate = useNavigate()
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
    onSuccess: ({ user , profile }) => {
      setServerMessage("Welcome back. You are signed in.")
      console.log(profile)
      navigate(getDashboardPath(profile))
    },
    onError: (error) => setServerMessage(error.message),
  })

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome back"
        description="Sign in to continue managing your Tapro NFC account."
        footerText="New to Tapro?"
        footerLinkText="Create an account"
        footerTo="/register"
      >
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
