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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { label: "Products Activated", value: data.activeProductsCount, helper: `${data.pendingProductsCount} pending activation`, icon: QrCode },
            { label: "Total Scans", value: data.totalScans, helper: "Across all your products", icon: Eye },
            { label: "Connected Business", value: data.connectedBusinesses, helper: "Business profiles linked", icon: Store },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <article className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-[0_14px_45px_rgba(15,23,42,0.05)]" key={stat.label}>
                <div className="flex min-h-40 flex-col justify-between gap-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex size-14 items-center justify-center rounded-2xl bg-[#f3f6fb] text-slate-950">
                      <Icon className="size-6" />
                    </span>
                    <p className="font-head text-4xl font-semibold text-slate-950">{stat.value}</p>
                  </div>
                  <div>
                    <p className="font-head text-2xl font-semibold leading-tight text-slate-950">{stat.label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{stat.helper}</p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="grid gap-6 ">
          <SectionPanel title="Recent Scan Activity" description="Latest scans from your activated products">
            <DataTable
              columns={[
                { key: "scanned_code", label: "Code" },
                { key: "device_type", label: "Device" },
                { key: "redirect_result", label: "Result" },
                { key: "timestamp", label: "Time", render: (row) => (row.timestamp || row.created_at) ? new Date(row.timestamp || row.created_at).toLocaleString() : "-" },
              ]}
              rows={recentLogs}
              emptyText="No scans yet."
            />
          </SectionPanel>

          <SectionPanel title="Products Snapshot" description="Your latest connected products">
            <div className="space-y-3">
              {products.slice(0, 4).map((product) => (
                <div className="flex items-center justify-between rounded-[1.25rem] bg-[#f8fafc] px-4 py-3" key={product.id}>
                  <div>
                    <p className="font-medium text-slate-950">{product.unique_code}</p>
                    <p className="text-xs text-slate-500">{product.business_name || "No business name"}</p>
                  </div>
                  <StatusPill status={data?.profile?.account_status === "blocked" || product.status === "blocked" ? "Suspended" : product.activated ? "Active" : "Inactive"} />
                </div>
              ))}
              {products.length === 0 && <p className="text-sm text-slate-500">No products activated yet.</p>}
            </div>
          </SectionPanel>
        </div>
      </div>
    </OwnerLayout>
  )
}

export default OwnerDashboard
