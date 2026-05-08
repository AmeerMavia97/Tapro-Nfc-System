import { useMemo, useState } from "react"
import {
  Activity,
  Building2,
  ExternalLink,
  Eye,
  LayoutDashboard,
  MapPin,
  QrCode,
  Settings,
  Star,
  Store,
  TrendingUp,
} from "lucide-react"

import OwnerHeader from "@/components/OwnerDashboard/OwnerHeader"
import OwnerSidebar from "@/components/OwnerDashboard/OwnerSidebar"

const ownerTabs = [
  {
    title: "Dashboard Overview",
    icon: LayoutDashboard,
    description: "Quick view of activated products, scans, review growth, and recent activity.",
  },
  {
    title: "My Products",
    icon: QrCode,
    description: "All activated NFC/QR products connected to your business.",
  },
  {
    title: "Analytics",
    icon: TrendingUp,
    description: "Per-product scan performance, trends, and top performing products.",
  },
  {
    title: "Review Tracking",
    icon: Star,
    description: "Estimated review growth and redirect performance for your Google business.",
  },
  {
    title: "Connected Business",
    icon: Building2,
    description: "Business profile, address, Google review link, and Place ID details.",
  },
  {
    title: "Settings/Profile",
    icon: Settings,
    description: "Manage business details, email, password, and account preferences.",
  },
  {
    title: "Activity / History",
    icon: Activity,
    description: "Product activations, recent scans, and ownership history.",
  },
]

const products = [
  {
    code: "TRP-NFC-2201",
    status: "Active",
    activationDate: "May 2, 2026",
    scans: 1248,
    business: "Cafe Aroma",
  },
  {
    code: "TRP-QR-2202",
    status: "Active",
    activationDate: "Apr 18, 2026",
    scans: 884,
    business: "Cafe Aroma",
  },
  {
    code: "TRP-NFC-2203",
    status: "Inactive",
    activationDate: "Pending",
    scans: 0,
    business: "Cafe Aroma",
  },
]

const activities = [
  { event: "TRP-NFC-2201 scanned from mobile", type: "Recent Scan", time: "8 min ago" },
  { event: "Google review redirect opened", type: "Review Redirect", time: "25 min ago" },
  { event: "TRP-QR-2202 activated", type: "Product Activation", time: "Yesterday" },
  { event: "Business ownership verified", type: "Ownership", time: "May 1, 2026" },
]

const scanTrends = [
  { label: "Mon", value: "42%" },
  { label: "Tue", value: "58%" },
  { label: "Wed", value: "71%" },
  { label: "Thu", value: "63%" },
  { label: "Fri", value: "88%" },
  { label: "Sat", value: "79%" },
  { label: "Sun", value: "52%" },
]

const StatusPill = ({ status }) => {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    Inactive: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
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

const OverviewContent = () => (
  <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[
        { label: "Products Activated", value: "18", helper: "3 pending activation", icon: QrCode },
        { label: "Total Scans", value: "12,482", helper: "+18% this month", icon: Eye },
        { label: "Review Growth", value: "+126", helper: "Estimated new reviews", icon: Star },
        { label: "Connected Business", value: "1", helper: "Google profile connected", icon: Store },
      ].map((stat) => {
        const Icon = stat.icon

        return (
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" key={stat.label}>
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
      <SectionPanel title="Recent Scan Activity" description="Latest customer interactions">
        <div className="space-y-3">
          {activities.slice(0, 3).map((activity) => (
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-800" key={activity.event}>
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-100">{activity.event}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{activity.type}</p>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </SectionPanel>

      <SectionPanel title="Review Growth Summary" description="Estimated impact from review redirects">
        <div className="space-y-4">
          {[
            ["Redirect clicks", "2,840"],
            ["Estimated reviews", "126"],
            ["Conversion rate", "4.4%"],
          ].map(([label, value]) => (
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-950" key={label}>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
              <span className="text-lg font-semibold text-slate-950 dark:text-white">{value}</span>
            </div>
          ))}
        </div>
      </SectionPanel>
    </div>
  </div>
)

const ProductsContent = () => (
  <SectionPanel title="My Products" description="Activated NFC/QR products connected to your business.">
    <DataTable
      columns={[
        { key: "code", label: "Product Code" },
        { key: "status", label: "Status", render: (row) => <StatusPill status={row.status} /> },
        { key: "activationDate", label: "Activation Date" },
        { key: "scans", label: "Total Scans" },
        { key: "business", label: "Connected Business" },
      ]}
      rows={products.map((product) => ({ ...product, id: product.code }))}
    />
  </SectionPanel>
)

const AnalyticsContent = () => (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-3">
      {[
        ["Total Scans", "12,482"],
        ["Top Product", "TRP-NFC-2201"],
        ["Weekly Scans", "1,860"],
      ].map(([label, value]) => (
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" key={label}>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{value}</p>
        </article>
      ))}
    </div>

    <SectionPanel title="Scan Trends Graph" description="Daily scan volume for all connected products">
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

    <SectionPanel title="Top Performing Products">
      <DataTable
        columns={[
          { key: "code", label: "Product" },
          { key: "scans", label: "Scans" },
          { key: "business", label: "Business" },
          { key: "status", label: "Status", render: (row) => <StatusPill status={row.status} /> },
        ]}
        rows={products.map((product) => ({ ...product, id: product.code }))}
      />
    </SectionPanel>
  </div>
)

const ReviewContent = () => (
  <div className="grid gap-6 xl:grid-cols-[0.8fr_1fr]">
    <SectionPanel title="Estimated Review Growth" description="Depends on future Google integrations.">
      <div className="space-y-4">
        {[
          ["Connected Google business", "Cafe Aroma"],
          ["Review redirects", "2,840"],
          ["Estimated growth", "+126 reviews"],
          ["Redirect performance", "4.4% conversion"],
        ].map(([label, value]) => (
          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800" key={label}>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-1 font-semibold text-slate-950 dark:text-white">{value}</p>
          </div>
        ))}
      </div>
    </SectionPanel>

    <SectionPanel title="Review Redirect Performance">
      <div className="space-y-3">
        {products.slice(0, 2).map((product) => (
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950" key={product.code}>
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-slate-800 dark:text-slate-100">{product.code}</p>
              <span className="text-sm text-slate-500 dark:text-slate-400">{product.scans} scans</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
              <div className="h-2 rounded-full bg-amber-500" style={{ width: product.code.endsWith("2201") ? "78%" : "56%" }} />
            </div>
          </div>
        ))}
      </div>
    </SectionPanel>
  </div>
)

const BusinessContent = () => (
  <div className="grid gap-6 xl:grid-cols-[0.8fr_1fr]">
    <SectionPanel title="Connected Business" description="Primary business connected to your active products.">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Store className="mt-1 size-5 text-slate-500" />
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Business name</p>
            <p className="font-semibold text-slate-950 dark:text-white">Cafe Aroma</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="mt-1 size-5 text-slate-500" />
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Address</p>
            <p className="font-semibold text-slate-950 dark:text-white">Main Boulevard, Karachi</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ExternalLink className="mt-1 size-5 text-slate-500" />
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Google review link</p>
            <p className="font-semibold text-slate-950 dark:text-white">g.page/r/CafeAroma/review</p>
          </div>
        </div>
      </div>
    </SectionPanel>

    <SectionPanel title="Place ID Info">
      <div className="rounded-lg bg-slate-50 p-4 font-mono text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-200">
        ChIJCafeAromaTaproKarachiPK
      </div>
      <div className="mt-4">
        <ActionButton variant="secondary">Update Business Info</ActionButton>
      </div>
    </SectionPanel>
  </div>
)

const SettingsContent = () => (
  <div className="grid gap-6 xl:grid-cols-2">
    {[
      ["Business Details", "Business name", "Cafe Aroma"],
      ["Account Email", "Email address", "owner@cafearoma.com"],
      ["Password", "New password", ""],
      ["Account Settings", "Default redirect", "Google review link"],
    ].map(([title, label, value]) => (
      <SectionPanel title={title} key={title}>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
        <input
          className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-slate-700"
          defaultValue={value}
          placeholder={title === "Password" ? "Enter new password" : undefined}
          type={title === "Password" ? "password" : "text"}
        />
        <div className="mt-4">
          <ActionButton variant="secondary">Save</ActionButton>
        </div>
      </SectionPanel>
    ))}
  </div>
)

const HistoryContent = () => (
  <SectionPanel title="Activity / History" description="Product activations, recent scans, and ownership changes.">
    <DataTable
      columns={[
        { key: "event", label: "Activity" },
        { key: "type", label: "Type" },
        { key: "time", label: "Time" },
      ]}
      rows={activities.map((activity) => ({ ...activity, id: activity.event }))}
    />
  </SectionPanel>
)

const tabContent = {
  "Dashboard Overview": <OverviewContent />,
  "My Products": <ProductsContent />,
  Analytics: <AnalyticsContent />,
  "Review Tracking": <ReviewContent />,
  "Connected Business": <BusinessContent />,
  "Settings/Profile": <SettingsContent />,
  "Activity / History": <HistoryContent />,
}

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard Overview")
  const currentTab = useMemo(
    () => ownerTabs.find((tab) => tab.title === activeTab) ?? ownerTabs[0],
    [activeTab]
  )
  const CurrentIcon = currentTab.icon

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="flex min-h-screen">
        <OwnerSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <section className="flex min-w-0 flex-1 flex-col">
          <OwnerHeader title={activeTab} />

          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {ownerTabs.map((tab) => (
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
                Owner Dashboard
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

export default OwnerDashboard
