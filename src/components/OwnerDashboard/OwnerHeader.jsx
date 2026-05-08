import { Bell, Menu, Search } from "lucide-react"

import ThemeToggle from "@/components/ui/ThemeToggle"

const OwnerHeader = ({ title = "Dashboard Overview" }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            aria-label="Open sidebar"
            className="flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900 lg:hidden"
            type="button"
          >
            <Menu className="size-4" />
          </button>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Business Owner</p>
            <h2 className="truncate text-xl font-semibold text-slate-950 dark:text-white">{title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden h-10 w-64 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 md:flex">
            <Search className="size-4" />
            <span className="text-sm">Search products</span>
          </div>
          <button
            aria-label="Notifications"
            className="flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            type="button"
          >
            <Bell className="size-4" />
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

export default OwnerHeader
