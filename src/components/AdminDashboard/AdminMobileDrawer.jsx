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
  X,
} from "lucide-react"
import { NavLink } from "react-router-dom"

const drawerItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/admin-dashboard" },
  { label: "Codes", icon: KeyRound, path: "/admin-dashboard/codes" },
  { label: "Batches", icon: Boxes, path: "/admin-dashboard/batches" },
  { label: "Business Owners", icon: Users, path: "/admin-dashboard/business-owners" },
  { label: "Users", icon: UserRound, path: "/admin-dashboard/users" },
  { label: "Analytics", icon: BarChart3, path: "/admin-dashboard/analytics" },
  { label: "Activity Logs", icon: Activity, path: "/admin-dashboard/activity-logs" },
  { label: "Settings", icon: Settings, path: "/admin-dashboard/settings" },
]

const AdminMobileDrawer = ({ open, onClose }) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-50 h-dvh w-[310px] max-w-[86vw] bg-white p-4 shadow-2xl transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col rounded-[2rem] border border-black/5 bg-white p-4">
          <div className="flex items-center justify-between gap-3 px-2 py-2">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-[#7c5cff] text-white shadow-lg shadow-purple-200">
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">TAPro</p>
                <h1 className="text-lg font-bold text-slate-950">Admin Panel</h1>
              </div>
            </div>

            <button
              aria-label="Close menu"
              className="flex size-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
              onClick={onClose}
              type="button"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="mt-6">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Main Menu</p>
            <nav className="space-y-1.5">
              {drawerItems.map((item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    className={({ isActive }) =>
                      `flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                        isActive
                          ? "bg-slate-950 text-white shadow-xl shadow-slate-300/60"
                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                      }`
                    }
                    end={item.path === "/admin-dashboard"}
                    key={item.path}
                    onClick={onClose}
                    to={item.path}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </nav>
          </div>

          <div className="mt-auto rounded-[1.5rem] bg-slate-950 p-4 text-white">
            <p className="text-sm font-bold">Production System</p>
            <p className="mt-1 text-xs leading-5 text-white/55">
              Permanent NFC and QR code management with owner activation.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default AdminMobileDrawer
