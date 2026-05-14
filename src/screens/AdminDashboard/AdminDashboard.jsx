import { BarChart3, CreditCard, KeyRound, ShieldAlert, TrendingUp } from "lucide-react"
import AdminLayout from "@/components/AdminDashboard/AdminLayout"
import { SectionPanel, activityRows } from "./adminDashboardShared"

const dashboardStats = [
  { label: "Total QR/NFC Codes", value: "12,480", helper: "1,250 generated this month", icon: KeyRound },
  { label: "Activated Products", value: "8,642", helper: "69% activation rate", icon: CreditCard },
  { label: "Total Scans", value: "184.2k", helper: "12.8% higher than last month", icon: TrendingUp },
  { label: "Inactive Codes", value: "3,838", helper: "Ready for assignment", icon: ShieldAlert },
]

const AdminDashboard = () => {
  return (
    <AdminLayout
      title="Dashboard"
      icon={BarChart3}
      description="Overview of QR/NFC codes, products, scans, status, and recent platform activity."
    >
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
    </AdminLayout>
  )
}

export default AdminDashboard
