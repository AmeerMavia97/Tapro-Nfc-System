import { Download } from "lucide-react"

export const dashboardStats = [
  { label: "Total QR/NFC Codes", value: "12,480", helper: "1,250 generated this month" },
  { label: "Activated Products", value: "8,642", helper: "69% activation rate" },
  { label: "Total Scans", value: "184.2k", helper: "12.8% higher than last month" },
  { label: "Inactive Codes", value: "3,838", helper: "Ready for assignment" },
]

export const batchRows = [
  { name: "May-Factory-A", codes: 2500, active: 1804, status: "In Production" },
  { name: "April-Retail-B", codes: 1800, active: 1642, status: "Completed" },
  { name: "Pilot-Restaurants", codes: 600, active: 512, status: "Quality Check" },
]

export const ownerRows = [
  { name: "Cafe Aroma", products: 18, scans: "4.8k", status: "Active" },
  { name: "Glow Studio", products: 11, scans: "2.1k", status: "Active" },
  { name: "North Gym", products: 9, scans: "1.7k", status: "Suspended" },
]

export const activityRows = [
  { event: "TRP-QR-10021 activated", type: "Activation", user: "Admin", time: "10 min ago" },
  { event: "Cafe Aroma assigned 4 products", type: "Ownership", user: "Ameer", time: "42 min ago" },
  { event: "TRP-NFC-10024 paused", type: "Admin Action", user: "Admin", time: "1 hr ago" },
  { event: "Monthly scan export downloaded", type: "Scan Activity", user: "Ops", time: "Today" },
]

export const scanTrends = [
  { label: "Mon", value: "62%" },
  { label: "Tue", value: "48%" },
  { label: "Wed", value: "76%" },
  { label: "Thu", value: "58%" },
  { label: "Fri", value: "88%" },
  { label: "Sat", value: "71%" },
  { label: "Sun", value: "54%" },
]

export const StatusPill = ({ status }) => {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    Inactive: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    Paused: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    Suspended: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
    Completed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    "In Production": "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
    "Quality Check": "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  }

  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] || styles.Inactive}`}>{status}</span>
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
    className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
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

export const DataTable = ({ columns, rows, emptyText = "No data found." }) => (
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
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-center text-slate-500 dark:text-slate-400" colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr className="text-slate-700 dark:text-slate-200" key={row.id}>
                {columns.map((column) => (
                  <td className="px-4 py-3" key={column.key}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)

export const ExportButton = ({ onClick }) => (
  <ActionButton icon={Download} onClick={onClick} variant="secondary">Export CSV</ActionButton>
)
