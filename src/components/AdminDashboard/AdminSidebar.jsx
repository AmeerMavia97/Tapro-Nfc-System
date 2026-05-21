import {
  Activity,
  BarChart3,
  Boxes,
  KeyRound,
  LayoutDashboard,
  Settings,
  Users,
  UserRound,
} from "lucide-react"
import { NavLink } from "react-router-dom"
import Logo from '@/assets/TAPro-Logo.avif'

const sidebarItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/admin-dashboard" },
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
    <aside className="hidden w-[250px] shrink-0 p-0 lg:block">
      <div className="sticky top-6 flex h-[calc(100vh-48px)] flex-col ">
        <div className="flex items-center gap-3 px-3 py-3">
          <div>
            <NavLink to={'/'}>
              <img className="h-11 sm:w-24 sm:h-11.5" src={Logo} alt="" />
            </NavLink>
          </div>
        </div>

        <div className="mt-5">

          <nav className="space-y-1.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  className={({ isActive }) =>
                    `group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive
                      ? "bg-slate-950 text-white shadow-xl shadow-slate-300/60"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                    }`
                  }
                  end={item.path === "/admin-dashboard"}
                  key={item.path}
                  to={item.path}
                >
                  <Icon className="size-4.5" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

      </div>
    </aside>
  )
}

export default AdminSidebar
