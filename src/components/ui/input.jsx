import { cn } from "@/lib/utils"

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-xs outline-none transition placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-3 focus-visible:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-slate-500 dark:focus-visible:ring-slate-800 dark:aria-invalid:border-red-400 dark:aria-invalid:ring-red-950",
        className
      )}
      {...props}
    />
  )
}

export { Input }
