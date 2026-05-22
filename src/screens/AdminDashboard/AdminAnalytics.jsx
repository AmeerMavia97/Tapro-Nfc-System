import { TrendingUp } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import AdminLayout from "@/components/AdminDashboard/AdminLayout"
import { getAdminAnalytics } from "@/services/productsApi"
import { DataTable } from "./adminDashboardShared"
import { SectionPanel } from '@/components/screens/AdminDashboard/SectionPanel'
import { StatusPill } from "@/components/ui/statusPill"
import SimpleLineChart from "@/components/common/SimpleLineChart"

const AdminAnalytics = () => {
  const { data, isLoading } = useQuery({ queryKey: ["admin-analytics"], queryFn: getAdminAnalytics })


  return (
    <AdminLayout title="Analytics" icon={TrendingUp} description="Live analytics from products, owners, scans, and batches.">
      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">Loading analytics...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ["Total Scans", data?.totalScans || 0],
              ["Total Products", data?.totalProducts || 0],
              ["Active Products", data?.activeProducts || 0],
              ["Business Owners", data?.totalOwners || 0],
            ].map(([label, value]) => (
              <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" key={label}>
                <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{value}</p>
              </article>
            ))}
          </div>

          <SectionPanel title="Last 7 Days Scan Trends" description="Scan logs grouped by day.">
            <SimpleLineChart data={data?.sevenDays || []} />
          </SectionPanel>

          <SectionPanel title="Most Scanned Products" description="Products ordered by scan count.">
            <DataTable
              columns={[
                { key: "unique_code", label: "Code" },
                { key: "business_name", label: "Business" },
                { key: "total_scans", label: "Scans" },
                { key: "status", label: "Status", render: (row) => <StatusPill status={row.status} /> },
              ]}
              emptyText="No scan data yet."
              rows={data?.mostScanned || []}
            />
          </SectionPanel>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminAnalytics
