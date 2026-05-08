import { Activity, BarChart3, Building2, Boxes, LayoutDashboard, Settings, Star, Store } from "lucide-react"

const sidebarItems = [
  { label: "Dashboard Overview", icon: LayoutDashboard },
  { label: "My Products", icon: Boxes },
  { label: "Analytics", icon: BarChart3 },
  { label: "Review Tracking", icon: Star },
  { label: "Connected Business", icon: Building2 },
  { label: "Settings/Profile", icon: Settings },
  { label: "Activity / History", icon: Activity },
]

const OwnerSidebar = ({ activeTab, onTabChange }) => {
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

export default OwnerSidebar
