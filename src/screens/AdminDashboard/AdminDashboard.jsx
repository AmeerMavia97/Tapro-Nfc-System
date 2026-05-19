import { BarChart3, CreditCard, KeyRound, ShieldAlert, TrendingUp, Users } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import AdminLayout from "@/components/AdminDashboard/AdminLayout"
import { getActivityLogs, getAdminAnalytics } from "@/services/productsApi"
import { SectionPanel } from "./adminDashboardShared"

const AdminDashboard = () => {
  const { data: analytics, isLoading } = useQuery({ queryKey: ["admin-analytics"], queryFn: getAdminAnalytics })
  const { data: logs = [] } = useQuery({ queryKey: ["activity-logs"], queryFn: getActivityLogs })

  const dashboardStats = [
    { label: "Total QR/NFC Codes", value: analytics?.totalProducts || 0, helper: `${analytics?.totalBatches || 0} batches generated`, icon: KeyRound },
    { label: "Activated Products", value: analytics?.activeProducts || 0, helper: `${analytics?.inactiveProducts || 0} inactive codes`, icon: CreditCard },
    { label: "Total Scans", value: analytics?.totalScans || 0, helper: "From scan logs", icon: TrendingUp },
    { label: "Business Owners", value: analytics?.totalOwners || 0, helper: `${analytics?.blockedOwners || 0} blocked accounts`, icon: Users },
  ]

  return (
    <AdminLayout
      title="Dashboard"
      icon={BarChart3}
      description="Live overview of QR/NFC codes, products, scans, owners, and recent platform activity."
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
                    <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{isLoading ? "..." : stat.value}</p>
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
                { label: "Active", value: analytics?.activeProducts || 0, color: "bg-emerald-500" },
                { label: "Inactive", value: analytics?.inactiveProducts || 0, color: "bg-slate-400" },
                { label: "Blocked Owners", value: analytics?.blockedOwners || 0, color: "bg-red-500" },
              ].map((item) => {
                const total = Math.max(analytics?.totalProducts || 0, 1)
                const width = item.label === "Blocked Owners" ? `${Math.min((item.value / Math.max(analytics?.totalOwners || 1, 1)) * 100, 100)}%` : `${Math.min((item.value / total) * 100, 100)}%`
                return (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-200">{item.label}</span>
                      <span className="text-slate-500 dark:text-slate-400">{item.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className={`h-2 rounded-full ${item.color}`} style={{ width }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </SectionPanel>

          <SectionPanel title="Recent Activity" description="Latest platform updates">
            <div className="space-y-3">
              {logs.slice(0, 5).length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No activity yet.</p>
              ) : (
                logs.slice(0, 5).map((activity) => (
                  <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800" key={activity.id}>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{activity.action_description}</p>
                    <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>{activity.action_type}</span>
                      <span>{activity.created_at ? new Date(activity.created_at).toLocaleString() : "-"}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SectionPanel>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
