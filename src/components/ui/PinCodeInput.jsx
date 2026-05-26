import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

const PinCodeInput = ({
  value = "",
  onChange,
  id = "pin",
  error,
  label = "PIN",
  helper = "Enter your 6 digit PIN to access your dashboard.",
}) => {
  const [showPin, setShowPin] = useState(false)
  const pin = String(value || "").replace(/\D/g, "").slice(0, 6)

  return (
    <div className="grid gap-2">
      {label ? (
        <label className="text-sm font-bold text-slate-950" htmlFor={id}>
          {label}
        </label>
      ) : null}

      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? "true" : "false"}
          className={`h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-xs outline-none transition placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-3 focus-visible:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-slate-500 dark:focus-visible:ring-slate-800 dark:aria-invalid:border-red-400 dark:aria-invalid:ring-red-950 ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
              : "border-slate-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          }`}
          inputMode="numeric"
          maxLength={6}
          minLength={6}
          onChange={(event) =>
            onChange?.(event.target.value.replace(/\D/g, "").slice(0, 6))
          }
          placeholder="Enter 6 digit PIN"
          type={showPin ? "text" : "password"}
          value={pin}
        />

        <button
          aria-label={showPin ? "Hide PIN" : "Show PIN"}
          className="absolute right-5 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center text-slate-500 transition hover:text-slate-950"
          onClick={() => setShowPin((current) => !current)}
          type="button"
        >
          {showPin ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>

      {helper && !error ? (
        <p className="text-sm font-medium text-slate-500">{helper}</p>
      ) : null}

      {error ? (
        <p className="text-sm font-semibold text-red-600">
          {error.message || error}
        </p>
      ) : null}
    </div>
  )
}

export default PinCodeInput