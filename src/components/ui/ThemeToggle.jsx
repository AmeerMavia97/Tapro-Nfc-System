import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/hooks/useTheme"

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"
  const Icon = isDark ? Sun : Moon

  return (
    <button
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      onClick={toggleTheme}
      type="button"
      title={isDark ? "Light theme" : "Dark theme"}
    >
      <Icon className="size-4" />
    </button>
  )
}

export default ThemeToggle
