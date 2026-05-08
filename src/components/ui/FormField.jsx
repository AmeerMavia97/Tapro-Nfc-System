import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const FormField = ({ error, id, label, registration, ...inputProps }) => {
  return (
    <div className="grid gap-2">
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <Input id={id} aria-invalid={error ? "true" : "false"} {...registration} {...inputProps} />
      {error ? <p className="text-sm leading-5 text-red-600">{error.message}</p> : null}
    </div>
  )
}

export default FormField
