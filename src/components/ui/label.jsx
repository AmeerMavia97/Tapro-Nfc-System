import { cn } from "@/lib/utils"

function Label({ className, ...props }) {
  return (
    <label
      data-slot="label"
      className={cn("text-sm font-medium leading-none text-slate-950 dark:text-slate-100", className)}
      {...props}
    />
  )
}

export { Label }
