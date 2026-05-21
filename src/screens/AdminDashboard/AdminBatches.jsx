import { useMemo, useState } from "react"
import { Boxes, Search } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import AdminLayout from "@/components/AdminDashboard/AdminLayout"
import { getProductBatches, getProducts } from "@/services/productsApi"
import { DataTable } from "./adminDashboardShared"
import { SectionPanel } from '@/components/screens/AdminDashboard/SectionPanel'
import { StatusPill } from "@/components/ui/statusPill"

const AdminBatches = () => {
  const [search, setSearch] = useState("")
  const { data: batches = [], isLoading: batchesLoading } = useQuery({ queryKey: ["product-batches"], queryFn: getProductBatches })
  const { data: products = [], isLoading: productsLoading } = useQuery({ queryKey: ["products"], queryFn: getProducts })

  const rows = useMemo(() => {
    const cleanSearch = search.toLowerCase()

    return batches
      .filter((batch) => `${batch.name || ""}`.toLowerCase().includes(cleanSearch))
      .map((batch) => {
        const batchProducts = products.filter((product) => product.batch_id === batch.id || product.batch_name === batch.name)
        const activeCount = batchProducts.filter((product) => product.activated).length
        const inactiveCount = batchProducts.length - activeCount

        return {
          id: batch.id,
          name: batch.name,
          codes: batch.quantity || batchProducts.length,
          generated: batchProducts.length,
          active: activeCount,
          inactive: inactiveCount,
          status: activeCount > 0 ? "In Production" : "Inactive",
          created: batch.created_at ? new Date(batch.created_at).toLocaleString() : "-",
        }
      })
  }, [batches, products, search])

  return (
    <AdminLayout title="Batches" icon={Boxes} description="All generated code batches and activation status.">
      <SectionPanel title="Batch Status Tracking" description="Each batch is created from the Codes page and linked with generated permanent URLs.">
        <div className="mb-4 flex h-10 w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500 dark:border-slate-800 dark:bg-slate-950 md:max-w-sm">
          <Search className="size-4" />
          <input className="w-full bg-transparent text-sm outline-none" placeholder="Search batch" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>

        {batchesLoading || productsLoading ? (
          <div className="rounded-lg border border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">Loading batches...</div>
        ) : (
          <DataTable
            columns={[
              { key: "name", label: "Batch" },
              { key: "codes", label: "Requested Qty" },
              { key: "generated", label: "Generated Codes" },
              { key: "active", label: "Active" },
              { key: "inactive", label: "Inactive" },
              { key: "status", label: "Status", render: (row) => <StatusPill status={row.status} /> },
              { key: "created", label: "Created" },
            ]}
            emptyText="No batches generated yet."
            rows={rows}
          />
        )}
      </SectionPanel>
    </AdminLayout>
  )
}

export default AdminBatches
