import { useMemo, useState } from "react"
import { Download, KeyRound, Plus, Search } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import AdminLayout from "@/components/AdminDashboard/AdminLayout"
import ConfirmationModal from "@/components/Modal/ConfirmationModal"
import { generateProducts, getPermanentUrl, getProducts } from "@/services/productsApi"
import { ActionButton, DataTable } from "./adminDashboardShared"
import { StatusPill } from "@/components/ui/statusPill"
import { SectionPanel } from '@/components/screens/AdminDashboard/SectionPanel'


const downloadCsv = (rows) => {
  const headers = ["unique_code", "permanent_url", "batch_name", "activated", "redirect_url", "created_at"]
  const csvRows = [headers.join(",")]

  rows.forEach((row) => {
    csvRows.push(
      headers
        .map((key) => `"${String(row[key] ?? "").replaceAll('"', '""')}"`)
        .join(",")
    )
  })

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `tapro-products-${Date.now()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

const AdminCodes = () => {
  const queryClient = useQueryClient()
  const [batchName, setBatchName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [redirectUrl, setRedirectUrl] = useState("")
  const [search, setSearch] = useState("")
  const [confirmOpen, setConfirmOpen] = useState(false)

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  })

  const generateMutation = useMutation({
    mutationFn: generateProducts,
    onSuccess: () => {
      setBatchName("")
      setQuantity("")
      setRedirectUrl("")
      setConfirmOpen(false)
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["product-batches"] })
    },
  })

  const filteredProducts = useMemo(() => {
    const cleanSearch = search.toLowerCase()

    return products.filter((product) => {
      const value = `${product.unique_code} ${product.batch_name || ""} ${product.redirect_url || ""}`.toLowerCase()
      return value.includes(cleanSearch)
    })
  }, [products, search])

  const rows = filteredProducts.map((product) => ({
    ...product,
    id: product.id,
    permanent_url: getPermanentUrl(product.unique_code, product.permanent_url),
    status: product.activated ? "Active" : "Inactive",
    created: product.created_at ? new Date(product.created_at).toLocaleDateString() : "-",
  }))

  const handleGenerate = () => {
    if (!batchName.trim() || !quantity) return
    setConfirmOpen(true)
  }

  const handleConfirmGenerate = () => {
    generateMutation.mutate({ batchName, quantity, redirectUrl })
  }

  return (
    <AdminLayout
      title="Codes"
      icon={KeyRound}
      description="Generate permanent QR/NFC product URLs for factory printing and NFC programming."
    >
      <div className="space-y-6">
        <SectionPanel title="Generate QR/NFC Codes" description="Create permanent product identities. Each generated URL is locked and must never be reused.">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_1.3fr_auto]">
            <input
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-slate-700"
              placeholder="Batch name"
              value={batchName}
              onChange={(event) => setBatchName(event.target.value)}
            />
            <input
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-slate-700"
              min="1"
              max="1000"
              placeholder="Quantity"
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
           
            <ActionButton disabled={!batchName.trim() || !quantity} icon={Plus} onClick={handleGenerate}>
              Generate
            </ActionButton>
          </div>

          {generateMutation.error && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400">{generateMutation.error.message}</p>
          )}
        </SectionPanel>

        <SectionPanel title="All Codes" description="Search, filter, export, and manage permanent product URLs.">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex h-10 w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500 dark:border-slate-800 dark:bg-slate-950 md:max-w-sm">
              <Search className="size-4" />
              <input
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Search code, batch, redirect"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <ActionButton variant="secondary">Filter</ActionButton>
              <ActionButton icon={Download} onClick={() => downloadCsv(rows)} variant="secondary">Export CSV</ActionButton>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-lg border border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
              Loading products...
            </div>
          ) : (
            <DataTable
              columns={[
                { key: "unique_code", label: "Code" },
                { key: "batch_name", label: "Batch" },
                {
                  key: "permanent_url",
                  label: "Permanent URL",
                  render: (row) => (
                    <a className="text-blue-600 hover:underline dark:text-blue-400" href={row.permanent_url} rel="noreferrer" target="_blank">
                      {row.permanent_url}
                    </a>
                  ),
                },
                {
                  key: "redirect_url",
                  label: "Redirect Destination",
                  render: (row) => row.redirect_url || "Default activation flow",
                },
                { key: "status", label: "Status", render: (row) => <StatusPill status={row.status} /> },
                { key: "created", label: "Created" },
              ]}
              emptyText="No products generated yet."
              rows={rows}
            />
          )}
        </SectionPanel>
      </div>

      <ConfirmationModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Generate Permanent URLs?"
        description={`This will create ${quantity || 0} permanent product URLs for batch ${batchName || "-"}. These URLs should not be edited, reused, or recycled after production.`}
        confirmText="Yes, Generate"
        cancelText="Cancel"
        loading={generateMutation.isPending}
        onConfirm={handleConfirmGenerate}
      />
    </AdminLayout>
  )
}

export default AdminCodes
