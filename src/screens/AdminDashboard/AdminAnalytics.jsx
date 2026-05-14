import { TrendingUp } from "lucide-react"
import AdminLayout from "@/components/AdminDashboard/AdminLayout"
import { SectionPanel, scanTrends } from "./adminDashboardShared"

const AdminAnalytics = () => {
  return (
    <AdminLayout title="Analytics" icon={TrendingUp} description="Track scans, trends, product performance, code-level data, and review growth.">
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
    </AdminLayout>
  )
}

export default AdminAnalytics
