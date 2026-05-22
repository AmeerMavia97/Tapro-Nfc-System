import { useState } from "react"
import { Activity, BarChart3, Building2, Boxes, LayoutDashboard, Settings, Star } from "lucide-react"
import OwnerHeader from "@/components/OwnerDashboard/OwnerHeader"
import OwnerMobileDrawer from "@/components/OwnerDashboard/OwnerMobileDrawer"
import OwnerSidebar from "@/components/OwnerDashboard/OwnerSidebar"

export const ownerTabs = [
  {
    title: "Dashboard Overview",
    label: "Overview",
    icon: LayoutDashboard,
    description: "Quick view of activated products, scans, review growth, and recent activity.",
    path: "/owner-dashboard",
  },
  {
    title: "My Products",
    label: "My Products",
    icon: Boxes,
    description: "All activated NFC/QR products connected to your business.",
    path: "/owner-dashboard/products",
  },
  {
    title: "Analytics",
    label: "Analytics",
    icon: BarChart3,
    description: "Per-product scan performance, trends, and top performing products.",
    path: "/owner-dashboard/analytics",
  },
  // {
  //   title: "Review Tracking",
  //   label: "Reviews",
  //   icon: Star,
  //   description: "Review redirect performance for your Google business.",
  //   path: "/owner-dashboard/reviews",
  // },
  // {
  //   title: "Connected Business",
  //   label: "Business",
  //   icon: Building2,
  //   description: "Business profile, Google review link, and connected product details.",
  //   path: "/owner-dashboard/business",
  // },
  {
    title: "Activity / History",
    label: "History",
    icon: Activity,
    description: "Product activations, recent scans, and ownership history.",
    path: "/owner-dashboard/history",
  },
  {
    title: "Settings/Profile",
    label: "Settings",
    icon: Settings,
    description: "Manage profile name, email, password, and account preferences.",
    path: "/owner-dashboard/settings",
  },

]

export const StatusPill = ({ status }) => {
  const normalized = status || "Inactive"
  const styles = {
    Active: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    Inactive: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
    Blocked: "bg-red-50 text-red-700 ring-1 ring-red-100",
    Suspended: "bg-red-50 text-red-700 ring-1 ring-red-100",
  }

  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${styles[normalized] || styles.Inactive}`}>{normalized}</span>
}

export const SectionPanel = ({ children, description, title }) => (
  <section className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-[0_14px_45px_rgba(15,23,42,0.05)]">
    <div className="mb-5">
      <h2 className="font-head text-xl font-semibold text-slate-950">{title}</h2>
      {description && <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>}
    </div>
    {children}
  </section>
)

export const ActionButton = ({ children, icon: Icon, variant = "primary", ...props }) => (
  <button
    className={`inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${variant === "primary"
        ? "bg-slate-950 text-white shadow-lg shadow-slate-300/70 hover:-translate-y-0.5 hover:bg-slate-800"
        : "bg-white text-slate-700 ring-1 ring-black/5 hover:bg-[#f8fafc]"
      }`}
    type="button"
    {...props}
  >
    {Icon && <Icon className="size-4" />}
    {children}
  </button>
)

export const DataTable = ({ columns, rows, emptyText = "No records found." }) => (
  <div className="overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-[#f8fafc] text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((column) => (
              <th className="px-5 py-4 font-bold" key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <tr>
              <td className="px-5 py-7 text-center text-slate-500" colSpan={columns.length}>{emptyText}</td>
            </tr>
          ) : rows.map((row) => (
            <tr className="text-slate-700 transition hover:bg-[#f8fafc]/80" key={row.id}>
              {columns.map((column) => (
                <td className="px-5 py-4" key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

export const LoadingPanel = () => (
  <div className="flex min-h-[300px] items-center justify-center rounded-[1.75rem] border border-slate-100 bg-white text-sm font-bold text-slate-500 shadow-[0_14px_45px_rgba(15,23,42,0.05)]">
    Loading owner data...
  </div>
)

export const ErrorPanel = ({ message }) => (
  <div className="rounded-[1.25rem] border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
    {message}
  </div>
)

const getCurrentTab = (title) => ownerTabs.find((tab) => tab.title === title) || ownerTabs[0]

const OwnerLayout = ({ title = "Dashboard Overview", children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const currentTab = getCurrentTab(title)

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="relative flex min-h-screen gap-6 p-4 sm:p-6 lg:p-6">
        <OwnerSidebar />
        <OwnerMobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

        <section className="min-w-0 flex-1">
          <div className="min-h-[calc(100vh-4rem)] overflow-hidden rounded-[2.5rem] bg-white shadow-[0_28px_90px_rgba(15,23,42,0.10)] ring-1 ring-slate-100">
            <OwnerHeader title={currentTab.title} description={currentTab.description} onMenuClick={() => setDrawerOpen(true)} />
            <div className="px-5 py-6 sm:px-7 lg:px-8">
              <div className="pr-4 sm:pr-5 lg:pr-3">
                {children}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default OwnerLayout
