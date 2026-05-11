import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const FormField = ({ error, id, label, registration, ...inputProps }) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = inputProps.type === "password"
  const inputType = isPassword && showPassword ? "text" : inputProps.type

  return (
    <div className="grid gap-2">
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <div className="relative">
        <Input
          id={id}
          aria-invalid={error ? "true" : "false"}
          className={isPassword ? "pr-11" : undefined}
          {...registration}
          {...inputProps}
          type={inputType}
        />
        {isPassword ? (
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            onClick={() => setShowPassword((current) => !current)}
            type="button"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        ) : null}
      </div>
      {error ? <p className="text-sm leading-5 text-red-600">{error.message}</p> : null}
    </div>
  )
}

export default FormField
