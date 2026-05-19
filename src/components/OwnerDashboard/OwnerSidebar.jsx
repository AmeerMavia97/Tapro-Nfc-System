import { Store } from "lucide-react"
import { NavLink } from "react-router-dom"
import { ownerTabs } from "@/screens/OwnerDashboard/ownerDashboardShared"

const OwnerSidebar = () => {
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-950 lg:block">
      <div className="flex items-center gap-3 px-2">
        <span className="flex size-10 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
          <Store className="size-5" />
        </span>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">TapRoCard</p>
          <h1 className="text-lg font-semibold text-slate-950 dark:text-white">Owner Panel</h1>
        </div>
      </div>

      <nav className="mt-8 space-y-1">
        {ownerTabs.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              className={({ isActive }) => `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              }`}
              end={item.path === "/owner-dashboard"}
              key={item.path}
              to={item.path}
            >
              <Icon className="size-4" />
              <span>{item.title}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default OwnerSidebar
