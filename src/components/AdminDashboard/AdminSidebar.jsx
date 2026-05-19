import {
  Activity,
  BarChart3,
  Boxes,
  KeyRound,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
  UserRound,
} from "lucide-react"
import { NavLink } from "react-router-dom"

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin-dashboard" },
  { label: "Codes", icon: KeyRound, path: "/admin-dashboard/codes" },
  { label: "Batches", icon: Boxes, path: "/admin-dashboard/batches" },
  { label: "Business Owners", icon: Users, path: "/admin-dashboard/business-owners" },
  { label: "Users", icon: UserRound, path: "/admin-dashboard/users" },
  { label: "Analytics", icon: BarChart3, path: "/admin-dashboard/analytics" },
  { label: "Activity Logs", icon: Activity, path: "/admin-dashboard/activity-logs" },
  { label: "Settings", icon: Settings, path: "/admin-dashboard/settings" },
]

const AdminSidebar = () => {
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-950 lg:block">
      <div className="flex items-center gap-3 px-2">
        <span className="flex size-10 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
          <ShieldCheck className="size-5" />
        </span>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">TapRoCard</p>
          <h1 className="text-lg font-semibold text-slate-950 dark:text-white">Admin Panel</h1>
        </div>
      </div>

      <nav className="mt-8 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                }`
              }
              end={item.path === "/admin-dashboard"}
              key={item.path}
              to={item.path}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default AdminSidebar
