import { useState } from "react"
import { Link } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { KeyRound, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import AuthCard from "@/components/Cards/AuthCard"
import AuthLayout from "@/Layout/AuthScreenLayout/AuthLayout"
import FormField from "@/components/ui/FormField"
import { changePassword } from "@/services/authApi"

const ChangePassword = () => {
  const [serverMessage, setServerMessage] = useState("")
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const changeMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      reset()
      setServerMessage("Password changed successfully. You can sign in with the new password.")
    },
    onError: (error) => setServerMessage(error.message),
  })
  return (
    <AuthLayout>
      <AuthCard
        title="Change password"
        description="Choose a strong new password for your Tapro NFC account."
      >
        <form
          className="grid gap-5"
          onSubmit={handleSubmit(({ password }) => changeMutation.mutate({ password }))}
        >
          <FormField
            id="password"
            label="New password"
            type="password"
            placeholder="Minimum 6 characters"
            error={errors.password}
            registration={register("password", {
              required: "New password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />

          <FormField
            id="confirmPassword"
            label="Confirm new password"
            type="password"
            placeholder="Repeat your new password"
            error={errors.confirmPassword}
            registration={register("confirmPassword", {
              required: "Confirm your new password",
              validate: (value) => value === getValues("password") || "Passwords do not match",
            })}
          />

          {serverMessage ? (
            <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{serverMessage}</p>
          ) : null}

          <Button
            className="h-11 w-full bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            disabled={changeMutation.isPending}
            type="submit"
          >
            {changeMutation.isPending ? <Loader2 className="animate-spin" /> : <KeyRound />}
            Update password
          </Button>

          <Link className="text-center text-sm font-medium text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white" to="/login">
            Back to sign in
          </Link>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}

export default ChangePassword
