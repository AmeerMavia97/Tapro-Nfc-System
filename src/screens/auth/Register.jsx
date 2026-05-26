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
      pin: "",
      confirmPin: "",
    },
  })

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      reset()
      setServerMessage("Account created. Please sign in with your PIN to continue activation.")
      setTimeout(() => {
        navigate(
          redirectPath ? `/login?redirect=${encodeURIComponent(redirectPath)}` : "/login",
          { replace: true }
        )
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
        description="Start your Tapro NFC workspace with simple PIN access."
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
          <span className="grid size-5 place-items-center rounded-full bg-white text-base font-bold text-slate-950">
            G
          </span>
          Sign up with Google
        </button>

        <div className="mb-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            or create with PIN
          </span>
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>

        <form
          className="grid gap-5"
          onSubmit={handleSubmit(({ fullName, email, pin }) =>
            registerMutation.mutate({
              fullName,
              email,
              password: pin,
            })
          )}
        >
          <FormField
            id="fullName"
            label="Full name"
            placeholder="Your Name"
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
            id="pin"
            label="Create 6 digit PIN"
            type="password"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6 digit PIN"
            error={errors.pin}
            registration={register("pin", {
              required: "PIN is required",
              pattern: {
                value: /^\d{6}$/,
                message: "PIN must be exactly 6 digits",
              },
              onChange: (event) => {
                event.target.value = event.target.value.replace(/\D/g, "").slice(0, 6)
              },
            })}
          />

          <FormField
            id="confirmPin"
            label="Confirm PIN"
            type="password"
            inputMode="numeric"
            maxLength={6}
            placeholder="Repeat your PIN"
            error={errors.confirmPin}
            registration={register("confirmPin", {
              required: "Confirm your PIN",
              pattern: {
                value: /^\d{6}$/,
                message: "PIN must be exactly 6 digits",
              },
              validate: (value) => value === getValues("pin") || "PINs do not match",
              onChange: (event) => {
                event.target.value = event.target.value.replace(/\D/g, "").slice(0, 6)
              },
            })}
          />

          {serverMessage ? (
            <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {serverMessage}
            </p>
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