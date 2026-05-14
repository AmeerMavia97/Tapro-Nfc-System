import AdminHeader from "@/components/AdminDashboard/AdminHeader"
import AdminSidebar from "@/components/AdminDashboard/AdminSidebar"
import { NavLink } from "react-router-dom"
import {
  Activity,
  BarChart3,
  Boxes,
  KeyRound,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react"

const mobileTabs = [
  { label: "Dashboard", path: "/admin-dashboard", icon: LayoutDashboard },
  { label: "Codes", path: "/admin-dashboard/codes", icon: KeyRound },
  { label: "Batches", path: "/admin-dashboard/batches", icon: Boxes },
  { label: "Business Owners", path: "/admin-dashboard/business-owners", icon: Users },
  { label: "Analytics", path: "/admin-dashboard/analytics", icon: BarChart3 },
  { label: "Activity Logs", path: "/admin-dashboard/activity-logs", icon: Activity },
  { label: "Settings", path: "/admin-dashboard/settings", icon: Settings },
]

const AdminLayout = ({ title, description, icon: Icon, children }) => {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <section className="flex min-w-0 flex-1 flex-col">
          <AdminHeader title={title} />

          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {mobileTabs.map((tab) => (
                <NavLink
                  className={({ isActive }) =>
                    `shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                        : "border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                    }`
                  }
                  end={tab.path === "/admin-dashboard"}
                  key={tab.path}
                  to={tab.path}
                >
                  {tab.label}
                </NavLink>
              ))}
            </div>

            <div className="mb-6 flex flex-col gap-2">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {title} Tab
              </p>
              <div className="flex items-center gap-3">
                {Icon && (
                  <span className="flex size-11 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                    <Icon className="size-5" />
                  </span>
                )}
                <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-white sm:text-3xl">
                  {title}
                </h1>
              </div>
              {description && (
                <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {description}
                </p>
              )}
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  )
}

export default AdminLayout
