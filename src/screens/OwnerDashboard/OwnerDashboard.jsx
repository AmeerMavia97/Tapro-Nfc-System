import { Eye, QrCode, Star, Store } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import OwnerLayout, { DataTable, ErrorPanel, LoadingPanel, SectionPanel, StatusPill } from "./ownerDashboardShared"
import { getOwnerDashboardData } from "@/services/ownerApi"

const OwnerDashboard = () => {
  const { data, isLoading, error } = useQuery({ queryKey: ["owner-dashboard-data"], queryFn: getOwnerDashboardData })

  if (isLoading) return <OwnerLayout title="Dashboard Overview"><LoadingPanel /></OwnerLayout>
  if (error) return <OwnerLayout title="Dashboard Overview"><ErrorPanel message={error.message} /></OwnerLayout>

  const products = data?.products || []
  const recentLogs = data?.scanLogs?.slice(0, 5) || []

  return (
    <OwnerLayout title="Dashboard Overview">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Products Activated", value: data.activeProductsCount, helper: `${data.pendingProductsCount} pending activation`, icon: QrCode },
            { label: "Total Scans", value: data.totalScans, helper: "Across all your products", icon: Eye },
            { label: "Top Product", value: data.topProduct?.unique_code || "-", helper: `${data.topProduct?.total_scans || 0} scans`, icon: Star },
            { label: "Connected Business", value: data.connectedBusinesses, helper: "Business profiles linked", icon: Store },
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
          <SectionPanel title="Recent Scan Activity" description="Latest scans from your activated products">
            <DataTable
              columns={[
                { key: "scanned_code", label: "Code" },
                { key: "device_type", label: "Device" },
                { key: "redirect_result", label: "Result" },
                { key: "timestamp", label: "Time", render: (row) => row.timestamp ? new Date(row.timestamp).toLocaleString() : "-" },
              ]}
              rows={recentLogs}
              emptyText="No scans yet."
            />
          </SectionPanel>

          <SectionPanel title="Products Snapshot" description="Your latest connected products">
            <div className="space-y-3">
              {products.slice(0, 4).map((product) => (
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-950" key={product.id}>
                  <div>
                    <p className="font-medium text-slate-950 dark:text-white">{product.unique_code}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{product.business_name || "No business name"}</p>
                  </div>
                  <StatusPill status={product.activated ? "Active" : "Inactive"} />
                </div>
              ))}
              {products.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No products activated yet.</p>}
            </div>
          </SectionPanel>
        </div>
      </div>
    </OwnerLayout>
  )
}

export default OwnerDashboard
