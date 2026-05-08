import { LockKeyhole } from "lucide-react"
import { Link } from "react-router-dom"

import ThemeToggle from "@/components/ui/ThemeToggle"

const AuthLayout = ({ children }) => {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-sm font-semibold text-slate-900 dark:text-white">
            <span className="flex size-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
              <LockKeyhole className="size-4" />
            </span>
            TapRoCard
          </Link>
          <ThemeToggle />
        </header>

        <div className="mx-auto flex flex-1 w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
     
      </div>
    </main>

  )
}

export default AuthLayout
