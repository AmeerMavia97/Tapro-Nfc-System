import { ExternalLink } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import OwnerLayout, { ErrorPanel, LoadingPanel, SectionPanel } from "./ownerDashboardShared"
import { getOwnerDashboardData } from "@/services/ownerApi"

const OwnerReviews = () => {
  const { data, isLoading, error } = useQuery({ queryKey: ["owner-dashboard-data"], queryFn: getOwnerDashboardData })

  if (isLoading) return <OwnerLayout title="Review Tracking"><LoadingPanel /></OwnerLayout>
  if (error) return <OwnerLayout title="Review Tracking"><ErrorPanel message={error.message} /></OwnerLayout>

  const redirectClicks = data.scanLogs.filter((log) => log.redirect_result === "redirected").length
  const estimatedReviews = Math.round(redirectClicks * 0.05)
  const conversionRate = redirectClicks ? "5%" : "0%"

  return (
    <OwnerLayout title="Review Tracking">
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1fr]">
        <SectionPanel title="Estimated Review Growth" description="Estimated impact from your review redirects.">
          <div className="space-y-4">
            {[
              ["Connected businesses", data.connectedBusinesses],
              ["Review redirects", redirectClicks],
              ["Estimated reviews", estimatedReviews],
              ["Redirect performance", conversionRate],
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
            {data.products.map((product) => (
              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950" key={product.id}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100">{product.unique_code}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{product.business_name || "No business name"}</p>
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{product.total_scans || 0} scans</span>
                </div>
                {product.redirect_url && (
                  <a className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline" href={product.redirect_url} target="_blank" rel="noreferrer">
                    Open redirect URL <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            ))}
            {data.products.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No activated products yet.</p>}
          </div>
        </SectionPanel>
      </div>
    </OwnerLayout>
  )
}

export default OwnerReviews
