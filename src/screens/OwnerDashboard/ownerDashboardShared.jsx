import { Activity, BarChart3, Building2, Boxes, LayoutDashboard, Settings, Star } from "lucide-react"
import OwnerHeader from "@/components/OwnerDashboard/OwnerHeader"
import OwnerSidebar from "@/components/OwnerDashboard/OwnerSidebar"

export const ownerTabs = [
  {
    title: "Dashboard Overview",
    icon: LayoutDashboard,
    description: "Quick view of activated products, scans, review growth, and recent activity.",
    path: "/owner-dashboard",
  },
  {
    title: "My Products",
    icon: Boxes,
    description: "All activated NFC/QR products connected to your business.",
    path: "/owner-dashboard/products",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    description: "Per-product scan performance, trends, and top performing products.",
    path: "/owner-dashboard/analytics",
  },
  {
    title: "Review Tracking",
    icon: Star,
    description: "Review redirect performance for your Google business.",
    path: "/owner-dashboard/reviews",
  },
  {
    title: "Connected Business",
    icon: Building2,
    description: "Business profile, Google review link, and connected product details.",
    path: "/owner-dashboard/business",
  },
  {
    title: "Settings/Profile",
    icon: Settings,
    description: "Manage profile name, email, password, and account preferences.",
    path: "/owner-dashboard/settings",
  },
  {
    title: "Activity / History",
    icon: Activity,
    description: "Product activations, recent scans, and ownership history.",
    path: "/owner-dashboard/history",
  },
]

export const StatusPill = ({ status }) => {
  const normalized = status || "Inactive"
  const styles = {
    Active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    Inactive: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    Blocked: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
  }

  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[normalized] || styles.Inactive}`}>{normalized}</span>
}

export const SectionPanel = ({ children, description, title }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="mb-5">
      <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h2>
      {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
    </div>
    {children}
  </section>
)

export const ActionButton = ({ children, icon: Icon, variant = "primary", ...props }) => (
  <button
    className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition disabled:opacity-60 ${
      variant === "primary"
        ? "bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    }`}
    type="button"
    {...props}
  >
    {Icon && <Icon className="size-4" />}
    {children}
  </button>
)

export const DataTable = ({ columns, rows, emptyText = "No records found." }) => (
  <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
          <tr>
            {columns.map((column) => (
              <th className="px-4 py-3 font-semibold" key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-center text-slate-500 dark:text-slate-400" colSpan={columns.length}>{emptyText}</td>
            </tr>
          ) : rows.map((row) => (
            <tr className="text-slate-700 dark:text-slate-200" key={row.id}>
              {columns.map((column) => (
                <td className="px-4 py-3" key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

export const LoadingPanel = () => (
  <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
    Loading owner data...
  </div>
)

export const ErrorPanel = ({ message }) => (
  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
    {message}
  </div>
)

const getCurrentTab = (title) => ownerTabs.find((tab) => tab.title === title) || ownerTabs[0]

const OwnerLayout = ({ title = "Dashboard Overview", children }) => {
  const currentTab = getCurrentTab(title)
  const CurrentIcon = currentTab.icon

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="flex min-h-screen">
        <OwnerSidebar />
        <section className="flex min-w-0 flex-1 flex-col">
          <OwnerHeader title={currentTab.title} />
          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {ownerTabs.map((tab) => (
                <a
                  className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    currentTab.title === tab.title
                      ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                      : "border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                  href={tab.path}
                  key={tab.title}
                >
                  {tab.title}
                </a>
              ))}
            </div>

            <div className="mb-6 flex flex-col gap-2">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Owner Dashboard</p>
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                  <CurrentIcon className="size-5" />
                </span>
                <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-white sm:text-3xl">{currentTab.title}</h1>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">{currentTab.description}</p>
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  )
}

export default OwnerLayout
