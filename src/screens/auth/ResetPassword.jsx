import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Loader2, MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import AuthCard from "@/components/Cards/AuthCard"
import AuthLayout from "@/Layout/AuthScreenLayout/AuthLayout"
import FormField from "@/components/ui/FormField"
import { sendResetPasswordEmail } from "@/services/authApi"


const ResetPassword = () => {

  const [serverMessage, setServerMessage] = useState("")
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  })

  const resetMutation = useMutation({
    mutationFn: sendResetPasswordEmail,
    onSuccess: () => {
      reset()
      setServerMessage("Password reset link sent. Please check your inbox.")
    },
    onError: (error) => setServerMessage(error.message),
  })

  return (
    <AuthLayout>
      <AuthCard
        title="Reset password"
        description="Enter your email and we will send a secure link to create a new password."
        footerText="Remember your password?"
        footerLinkText="Sign in"
        footerTo="/login"
      >
        <form className="grid gap-5" onSubmit={handleSubmit((values) => resetMutation.mutate(values))}>
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

          {serverMessage ? (
            <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{serverMessage}</p>
          ) : null}

          <Button
            className="h-11 w-full bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            disabled={resetMutation.isPending}
            type="submit"
          >
            {resetMutation.isPending ? <Loader2 className="animate-spin" /> : <MailCheck />}
            Send reset link
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}

export default ResetPassword
