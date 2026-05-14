import { Boxes } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import AdminLayout from "@/components/AdminDashboard/AdminLayout"
import { getProductBatches, getProducts } from "@/services/productsApi"
import { DataTable, SectionPanel, StatusPill } from "./adminDashboardShared"

const AdminBatches = () => {
  const { data: batches = [] } = useQuery({ queryKey: ["product-batches"], queryFn: getProductBatches })
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: getProducts })

  const rows = batches.map((batch) => {
    const batchProducts = products.filter((product) => product.batch_id === batch.id || product.batch_name === batch.name)
    const activeCount = batchProducts.filter((product) => product.activated).length

    return {
      id: batch.id,
      name: batch.name,
      codes: batch.quantity || batchProducts.length,
      active: activeCount,
      status: activeCount > 0 ? "In Production" : "Inactive",
    }
  })

  return (
    <AdminLayout title="Batches" icon={Boxes} description="Create manufacturing batches and track grouped code production status.">
      <SectionPanel title="Batch Status Tracking">
        <DataTable
          columns={[
            { key: "name", label: "Batch" },
            { key: "codes", label: "Total Codes" },
            { key: "active", label: "Activated" },
            { key: "status", label: "Status", render: (row) => <StatusPill status={row.status} /> },
          ]}
          emptyText="No batches generated yet."
          rows={rows}
        />
      </SectionPanel>
    </AdminLayout>
  )
}

export default AdminBatches
