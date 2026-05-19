import { ExternalLink } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import OwnerLayout, { DataTable, ErrorPanel, LoadingPanel, SectionPanel, StatusPill } from "./ownerDashboardShared"
import { getOwnerProducts } from "@/services/ownerApi"

const OwnerProducts = () => {
  const { data: products = [], isLoading, error } = useQuery({ queryKey: ["owner-products"], queryFn: getOwnerProducts })

  if (isLoading) return <OwnerLayout title="My Products"><LoadingPanel /></OwnerLayout>
  if (error) return <OwnerLayout title="My Products"><ErrorPanel message={error.message} /></OwnerLayout>

  return (
    <OwnerLayout title="My Products">
      <SectionPanel title="My Products" description="All NFC/QR products locked to your owner account.">
        <DataTable
          columns={[
            { key: "unique_code", label: "Product Code" },
            { key: "status", label: "Status", render: (row) => <StatusPill status={row.activated ? "Active" : "Inactive"} /> },
            { key: "business_name", label: "Business", render: (row) => row.business_name || "-" },
            { key: "activation_time", label: "Activation Date", render: (row) => row.activation_time ? new Date(row.activation_time).toLocaleDateString() : "Pending" },
            { key: "total_scans", label: "Total Scans", render: (row) => row.total_scans || 0 },
            { key: "redirect_url", label: "Redirect", render: (row) => row.redirect_url ? <a className="inline-flex items-center gap-1 text-blue-600 hover:underline" href={row.redirect_url} target="_blank" rel="noreferrer">Open <ExternalLink className="size-3" /></a> : "-" },
          ]}
          rows={products}
          emptyText="No products activated yet. Scan an inactive TAPro code to activate your first product."
        />
      </SectionPanel>
    </OwnerLayout>
  )
}

export default OwnerProducts
