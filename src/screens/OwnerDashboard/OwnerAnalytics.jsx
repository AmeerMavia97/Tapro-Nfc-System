import { useQuery } from "@tanstack/react-query"
import OwnerLayout, { DataTable, ErrorPanel, LoadingPanel, SectionPanel, StatusPill } from "./ownerDashboardShared"
import { getOwnerDashboardData } from "@/services/ownerApi"

const OwnerAnalytics = () => {
  const { data, isLoading, error } = useQuery({ queryKey: ["owner-dashboard-data"], queryFn: getOwnerDashboardData })

  if (isLoading) return <OwnerLayout title="Analytics"><LoadingPanel /></OwnerLayout>
  if (error) return <OwnerLayout title="Analytics"><ErrorPanel message={error.message} /></OwnerLayout>

  const max = Math.max(...data.sevenDays.map((day) => day.value), 1)

  return (
    <OwnerLayout title="Analytics">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Total Scans", data.totalScans],
            ["Top Product", data.topProduct?.unique_code || "-"],
            ["Active Products", data.activeProductsCount],
          ].map(([label, value]) => (
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" key={label}>
              <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{value}</p>
            </article>
          ))}
        </div>

        <SectionPanel title="Scan Trends Graph" description="Daily scan volume for all connected products">
          <div className="flex h-64 items-end gap-3">
            {data.sevenDays.map((bar) => {
              const height = `${Math.max((bar.value / max) * 100, 8)}%`
              return (
                <div className="flex flex-1 flex-col items-center gap-2" key={bar.label}>
                  <div className="flex w-full items-end rounded-t-lg bg-slate-100 dark:bg-slate-800" style={{ height }}>
                    <div className="w-full rounded-t-lg bg-slate-950 dark:bg-white" style={{ height: "100%" }} />
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{bar.label}</span>
                </div>
              )
            })}
          </div>
        </SectionPanel>

        <SectionPanel title="Top Performing Products">
          <DataTable
            columns={[
              { key: "unique_code", label: "Product" },
              { key: "total_scans", label: "Scans", render: (row) => row.total_scans || 0 },
              { key: "business_name", label: "Business", render: (row) => row.business_name || "-" },
              { key: "status", label: "Status", render: (row) => <StatusPill status={row.activated ? "Active" : "Inactive"} /> },
            ]}
            rows={[...data.products].sort((a, b) => Number(b.total_scans || 0) - Number(a.total_scans || 0))}
          />
        </SectionPanel>
      </div>
    </OwnerLayout>
  )
}

export default OwnerAnalytics
