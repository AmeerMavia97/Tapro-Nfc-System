import {
  Activity,
  BarChart3,
  Boxes,
  KeyRound,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react"

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Codes", icon: KeyRound },
  { label: "Batches", icon: Boxes },
  { label: "Business Owners", icon: Users },
  { label: "Analytics", icon: BarChart3 },
  { label: "Activity Logs", icon: Activity },
  { label: "Settings", icon: Settings },
]

const AdminSidebar = ({ activeTab, onTabChange }) => {
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
          const isActive = activeTab === item.label

          return (
            <button
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              }`}
              key={item.label}
              onClick={() => onTabChange(item.label)}
              type="button"
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default AdminSidebar
