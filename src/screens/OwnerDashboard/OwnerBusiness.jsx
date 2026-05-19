import { ExternalLink, MapPin, Store } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import OwnerLayout, { DataTable, ErrorPanel, LoadingPanel, SectionPanel } from "./ownerDashboardShared"
import { getOwnerProducts } from "@/services/ownerApi"

const OwnerBusiness = () => {
  const { data: products = [], isLoading, error } = useQuery({ queryKey: ["owner-products"], queryFn: getOwnerProducts })

  if (isLoading) return <OwnerLayout title="Connected Business"><LoadingPanel /></OwnerLayout>
  if (error) return <OwnerLayout title="Connected Business"><ErrorPanel message={error.message} /></OwnerLayout>

  const businesses = products.filter((product) => product.activated)
  const firstBusiness = businesses[0]

  return (
    <OwnerLayout title="Connected Business">
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1fr]">
        <SectionPanel title="Connected Business" description="Business records connected to your active products.">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Store className="mt-1 size-5 text-slate-500" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Primary business name</p>
                <p className="font-semibold text-slate-950 dark:text-white">{firstBusiness?.business_name || "No business activated yet"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 size-5 text-slate-500" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Products connected</p>
                <p className="font-semibold text-slate-950 dark:text-white">{businesses.length}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ExternalLink className="mt-1 size-5 text-slate-500" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Primary review link</p>
                <p className="break-all font-semibold text-slate-950 dark:text-white">{firstBusiness?.redirect_url || "Not connected"}</p>
              </div>
            </div>
          </div>
        </SectionPanel>

        <SectionPanel title="Review Destinations" description="Review links are locked after activation. Contact admin for reassignment or support changes.">
          <DataTable
            columns={[
              { key: "unique_code", label: "Code" },
              { key: "business_name", label: "Business", render: (row) => row.business_name || "-" },
              {
                key: "redirect_url",
                label: "Review Destination",
                render: (row) => row.redirect_url ? (
                  <a className="inline-flex items-center gap-1 break-all text-blue-600 hover:underline dark:text-blue-400" href={row.redirect_url} target="_blank" rel="noreferrer">
                    Open <ExternalLink className="size-3" />
                  </a>
                ) : "Pending activation",
              },
              { key: "status", label: "Status", render: (row) => row.activated ? "Active" : "Pending" },
            ]}
            rows={products}
            emptyText="No products activated yet."
          />
        </SectionPanel>
      </div>
    </OwnerLayout>
  )
}

export default OwnerBusiness
