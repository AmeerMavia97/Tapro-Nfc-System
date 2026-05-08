import { useMemo, useState } from "react"
import {
  Activity,
  BarChart3,
  Boxes,
  CreditCard,
  Download,
  KeyRound,
  Plus,
  Search,
  Settings,
  ShieldAlert,
  TrendingUp,
  Users,
} from "lucide-react"

import AdminHeader from "@/components/AdminDashboard/AdminHeader"
import AdminSidebar from "@/components/AdminDashboard/AdminSidebar"

const adminTabs = [
  {
    title: "Dashboard",
    icon: BarChart3,
    description: "Overview of QR/NFC codes, products, scans, status, and recent platform activity.",
  },
  {
    title: "Codes",
    icon: KeyRound,
    description: "Generate, manage, filter, and export QR/NFC codes for manufacturing and operations.",
  },
  {
    title: "Batches",
    icon: Boxes,
    description: "Create manufacturing batches and track grouped code production status.",
  },
  {
    title: "Business Owners",
    icon: Users,
    description: "Manage business owner accounts, product assignment, and account access actions.",
  },
  {
    title: "Analytics",
    icon: TrendingUp,
    description: "Track scans, trends, product performance, code-level data, and review growth.",
  },
  {
    title: "Activity Logs",
    icon: Activity,
    description: "Audit activation history, scan activity, admin actions, and ownership updates.",
  },
  {
    title: "Settings",
    icon: Settings,
    description: "Configure platform behavior, redirect rules, API settings, and basic branding.",
  },
]

const dashboardStats = [
  { label: "Total QR/NFC Codes", value: "12,480", helper: "1,250 generated this month", icon: KeyRound },
  { label: "Activated Products", value: "8,642", helper: "69% activation rate", icon: CreditCard },
  { label: "Total Scans", value: "184.2k", helper: "12.8% higher than last month", icon: TrendingUp },
  { label: "Inactive Codes", value: "3,838", helper: "Ready for assignment", icon: ShieldAlert },
]

const codeRows = [
  { code: "TRP-QR-10021", batch: "May-Factory-A", owner: "Cafe Aroma", status: "Active", scans: 428 },
  { code: "TRP-NFC-10022", batch: "May-Factory-A", owner: "Unassigned", status: "Inactive", scans: 0 },
  { code: "TRP-QR-10023", batch: "April-Retail-B", owner: "Glow Studio", status: "Active", scans: 189 },
  { code: "TRP-NFC-10024", batch: "April-Retail-B", owner: "North Gym", status: "Paused", scans: 76 },
]

const batchRows = [
  { name: "May-Factory-A", codes: 2500, active: 1804, status: "In Production" },
  { name: "April-Retail-B", codes: 1800, active: 1642, status: "Completed" },
  { name: "Pilot-Restaurants", codes: 600, active: 512, status: "Quality Check" },
]

const ownerRows = [
  { name: "Cafe Aroma", products: 18, scans: "4.8k", status: "Active" },
  { name: "Glow Studio", products: 11, scans: "2.1k", status: "Active" },
  { name: "North Gym", products: 9, scans: "1.7k", status: "Suspended" },
]

const activityRows = [
  { event: "TRP-QR-10021 activated", type: "Activation", user: "Admin", time: "10 min ago" },
  { event: "Cafe Aroma assigned 4 products", type: "Ownership", user: "Ameer", time: "42 min ago" },
  { event: "TRP-NFC-10024 paused", type: "Admin Action", user: "Admin", time: "1 hr ago" },
  { event: "Monthly scan export downloaded", type: "Scan Activity", user: "Ops", time: "Today" },
]

const scanTrends = [
  { label: "Mon", value: "62%" },
  { label: "Tue", value: "48%" },
  { label: "Wed", value: "76%" },
  { label: "Thu", value: "58%" },
  { label: "Fri", value: "88%" },
  { label: "Sat", value: "71%" },
  { label: "Sun", value: "54%" },
]

const StatusPill = ({ status }) => {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    Inactive: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    Paused: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    Suspended: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
    Completed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    "In Production": "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
    "Quality Check": "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  }

  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>{status}</span>
}

const SectionPanel = ({ children, description, title }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="mb-5">
      <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h2>
      {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
    </div>
    {children}
  </section>
)

const ActionButton = ({ children, icon: Icon, variant = "primary" }) => (
  <button
    className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition ${
      variant === "primary"
        ? "bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    }`}
    type="button"
  >
    {Icon && <Icon className="size-4" />}
    {children}
  </button>
)

const DataTable = ({ columns, rows }) => (
  <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
          <tr>
            {columns.map((column) => (
              <th className="px-4 py-3 font-semibold" key={column.key}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {rows.map((row) => (
            <tr className="text-slate-700 dark:text-slate-200" key={row.id}>
              {columns.map((column) => (
                <td className="px-4 py-3" key={column.key}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

const DashboardContent = () => (
  <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {dashboardStats.map((stat) => {
        const Icon = stat.icon

        return (
          <article
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900"
            key={stat.label}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{stat.value}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{stat.helper}</p>
              </div>
              <span className="flex size-11 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <Icon className="size-5" />
              </span>
            </div>
          </article>
        )
      })}
    </div>

    <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
      <SectionPanel title="Active vs Inactive Codes" description="Live code status distribution">
        <div className="space-y-4">
          {[
            { label: "Active", value: "8,642", width: "69%", color: "bg-emerald-500" },
            { label: "Inactive", value: "3,218", width: "26%", color: "bg-slate-400" },
            { label: "Paused", value: "620", width: "5%", color: "bg-amber-500" },
          ].map((item) => (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-200">{item.label}</span>
                <span className="text-slate-500 dark:text-slate-400">{item.value}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <div className={`h-2 rounded-full ${item.color}`} style={{ width: item.width }} />
              </div>
            </div>
          ))}
        </div>
      </SectionPanel>

      <SectionPanel title="Recent Activity" description="Latest platform updates">
        <div className="space-y-3">
          {activityRows.slice(0, 3).map((activity) => (
            <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800" key={activity.event}>
              <p className="font-medium text-slate-800 dark:text-slate-100">{activity.event}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{activity.type} by {activity.user}</p>
            </div>
          ))}
        </div>
      </SectionPanel>
    </div>
  </div>
)

const CodesContent = () => (
  <div className="space-y-6">
    <SectionPanel title="Generate QR/NFC Codes" description="Create new production-ready code sets for factory batches.">
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <input className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-slate-700" placeholder="Batch name" />
        <input className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-slate-700" placeholder="Quantity" />
        <ActionButton icon={Plus}>Generate</ActionButton>
      </div>
    </SectionPanel>

    <SectionPanel title="All Codes" description="Search, filter, activate, deactivate, and export codes.">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex h-10 w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500 dark:border-slate-800 dark:bg-slate-950 md:max-w-sm">
          <Search className="size-4" />
          <input className="w-full bg-transparent text-sm outline-none" placeholder="Search code, batch, owner" />
        </div>
        <div className="flex gap-2">
          <ActionButton variant="secondary">Filter</ActionButton>
          <ActionButton icon={Download} variant="secondary">Export CSV</ActionButton>
        </div>
      </div>
      <DataTable
        columns={[
          { key: "code", label: "Code" },
          { key: "batch", label: "Batch" },
          { key: "owner", label: "Owner" },
          { key: "scans", label: "Scans" },
          { key: "status", label: "Status", render: (row) => <StatusPill status={row.status} /> },
          { key: "action", label: "Action", render: () => <ActionButton variant="secondary">Toggle</ActionButton> },
        ]}
        rows={codeRows.map((row) => ({ ...row, id: row.code }))}
      />
    </SectionPanel>
  </div>
)

const BatchesContent = () => (
  <div className="space-y-6">
    <SectionPanel title="Create Manufacturing Batch" description="Group codes by production run and track status.">
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <input className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950" placeholder="Batch name" />
        <input className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950" placeholder="Code quantity" />
        <ActionButton icon={Plus}>Create Batch</ActionButton>
      </div>
    </SectionPanel>
    <SectionPanel title="Batch Status Tracking">
      <DataTable
        columns={[
          { key: "name", label: "Batch" },
          { key: "codes", label: "Total Codes" },
          { key: "active", label: "Activated" },
          { key: "status", label: "Status", render: (row) => <StatusPill status={row.status} /> },
        ]}
        rows={batchRows.map((row) => ({ ...row, id: row.name }))}
      />
    </SectionPanel>
  </div>
)

const OwnersContent = () => (
  <SectionPanel title="Business Owners" description="View owners, assign products, and manage account access.">
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex h-10 w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500 dark:border-slate-800 dark:bg-slate-950 md:max-w-sm">
        <Search className="size-4" />
        <input className="w-full bg-transparent text-sm outline-none" placeholder="Search business owner" />
      </div>
      <ActionButton icon={Plus}>Assign Product</ActionButton>
    </div>
    <DataTable
      columns={[
        { key: "name", label: "Owner" },
        { key: "products", label: "Products" },
        { key: "scans", label: "Scans" },
        { key: "status", label: "Status", render: (row) => <StatusPill status={row.status} /> },
        { key: "action", label: "Action", render: () => <ActionButton variant="secondary">Reset</ActionButton> },
      ]}
      rows={ownerRows.map((row) => ({ ...row, id: row.name }))}
    />
  </SectionPanel>
)

const AnalyticsContent = () => (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-3">
      {[
        ["Total Scans", "184.2k"],
        ["Best Product", "Google Review NFC"],
        ["Review Growth", "+24.6%"],
      ].map(([label, value]) => (
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" key={label}>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{value}</p>
        </article>
      ))}
    </div>
    <SectionPanel title="Scan Trends" description="Weekly scan activity">
      <div className="flex h-64 items-end gap-3">
        {scanTrends.map((bar) => (
          <div className="flex flex-1 flex-col items-center gap-2" key={bar.label}>
            <div className="flex w-full items-end rounded-t-lg bg-slate-100 dark:bg-slate-800" style={{ height: bar.value }}>
              <div className="w-full rounded-t-lg bg-slate-950 dark:bg-white" style={{ height: bar.value }} />
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{bar.label}</span>
          </div>
        ))}
      </div>
    </SectionPanel>
  </div>
)

const LogsContent = () => (
  <SectionPanel title="Activity Logs" description="Activation, scan, admin, and ownership history.">
    <DataTable
      columns={[
        { key: "event", label: "Event" },
        { key: "type", label: "Type" },
        { key: "user", label: "User" },
        { key: "time", label: "Time" },
      ]}
      rows={activityRows.map((row) => ({ ...row, id: row.event }))}
    />
  </SectionPanel>
)

const SettingsContent = () => (
  <div className="grid gap-6 xl:grid-cols-2">
    {[
      ["System Configuration", "Default code expiry", "365 days"],
      ["Redirect Settings", "Fallback redirect URL", "https://taprocard.com"],
      ["API Keys / Config", "Public API key", "pk_live_****************"],
      ["Branding", "Platform name", "TapRoCard"],
    ].map(([title, label, value]) => (
      <SectionPanel title={title} key={title}>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
        <input
          className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-slate-700"
          defaultValue={value}
        />
        <div className="mt-4">
          <ActionButton variant="secondary">Save</ActionButton>
        </div>
      </SectionPanel>
    ))}
  </div>
)

const tabContent = {
  Dashboard: <DashboardContent />,
  Codes: <CodesContent />,
  Batches: <BatchesContent />,
  "Business Owners": <OwnersContent />,
  Analytics: <AnalyticsContent />,
  "Activity Logs": <LogsContent />,
  Settings: <SettingsContent />,
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard")
  const currentTab = useMemo(
    () => adminTabs.find((tab) => tab.title === activeTab) ?? adminTabs[0],
    [activeTab]
  )
  const CurrentIcon = currentTab.icon

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="flex min-h-screen">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <section className="flex min-w-0 flex-1 flex-col">
          <AdminHeader title={activeTab} />

          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {adminTabs.map((tab) => (
                <button
                  className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    activeTab === tab.title
                      ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                      : "border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                  key={tab.title}
                  onClick={() => setActiveTab(tab.title)}
                  type="button"
                >
                  {tab.title}
                </button>
              ))}
            </div>

            <div className="mb-6 flex flex-col gap-2">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {currentTab.title} Tab
              </p>
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                  <CurrentIcon className="size-5" />
                </span>
                <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-white sm:text-3xl">
                  {currentTab.title}
                </h1>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                {currentTab.description}
              </p>
            </div>

            {tabContent[activeTab]}
          </div>
        </section>
      </div>
    </main>
  )
}

export default AdminDashboard
