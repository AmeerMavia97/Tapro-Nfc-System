import { useMemo, useState } from "react"
import { MoreHorizontal, Search, Users } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import AdminLayout from "@/components/AdminDashboard/AdminLayout"
import ConfirmationModal from "@/components/Modal/ConfirmationModal"
import { addProductBusinessReport, getAssignableOwners, getProductBusinessOwners, reassignProductBusinessOwner, updateProductBusinessStatus } from "@/services/productsApi"
import { DataTable } from "./adminDashboardShared"
import { StatusPill } from "@/components/ui/statusPill"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SectionPanel } from '@/components/screens/AdminDashboard/SectionPanel'


const AdminOwners = () => {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [assignOpen, setAssignOpen] = useState(false)
  const [selectedOwnerId, setSelectedOwnerId] = useState("")

  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ["product-business-owners"],
    queryFn: getProductBusinessOwners,
  })

  const { data: assignableOwners = [] } = useQuery({
    queryKey: ["assignable-owners"],
    queryFn: getAssignableOwners,
  })

  const statusMutation = useMutation({
    mutationFn: updateProductBusinessStatus,
    onSuccess: () => {
      setConfirmOpen(false)
      setSelectedBusiness(null)
      queryClient.invalidateQueries({ queryKey: ["product-business-owners"] })
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] })
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
    },
  })

  const reportMutation = useMutation({
    mutationFn: addProductBusinessReport,
    onSuccess: () => {
      setReportOpen(false)
      setSelectedBusiness(null)
      setReportReason("")
      queryClient.invalidateQueries({ queryKey: ["product-business-owners"] })
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] })
    },
  })

  const assignMutation = useMutation({
    mutationFn: reassignProductBusinessOwner,
    onSuccess: () => {
      setAssignOpen(false)
      setSelectedBusiness(null)
      setSelectedOwnerId("")
      queryClient.invalidateQueries({ queryKey: ["product-business-owners"] })
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] })
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
    },
  })

  const rows = useMemo(() => {
    const cleanSearch = search.toLowerCase()

    return businesses
      .filter((business) => business.activated === true && business.status !== "inactive")
      .filter((business) => {
        const searchable = `${business.display_name || ""} ${business.display_email || ""} ${business.unique_code || ""} ${business.batch_name || ""}`.toLowerCase()
        return searchable.includes(cleanSearch)
      })
      .map((business) => ({
        ...business,
        id: business.id,
        businessName: business.display_name,
        ownerEmail: business.display_email,
        code: business.unique_code,
        scans: business.scans_count,
        statusLabel: business.business_status,
        reports: business.reports,
        activatedDate: business.activated_date,
        createdDate: business.created_date,
      }))
  }, [businesses, search])

  const openStatusConfirm = (business) => {
    setSelectedBusiness(business)
    setConfirmOpen(true)
  }

  const openReportModal = (business) => {
    setSelectedBusiness(business)
    setReportOpen(true)
  }

  const openAssignModal = (business) => {
    setSelectedBusiness(business)
    setSelectedOwnerId(business.owner_id || "")
    setAssignOpen(true)
  }

  const handleStatusConfirm = () => {
    statusMutation.mutate({
      productId: selectedBusiness.id,
      blocked: selectedBusiness.status !== "blocked",
    })
  }

  const handleReportConfirm = () => {
    reportMutation.mutate({
      productId: selectedBusiness.id,
      ownerId: selectedBusiness.owner_id,
      reason: reportReason,
    })
  }

  const handleAssignConfirm = () => {
    assignMutation.mutate({
      productId: selectedBusiness.id,
      ownerId: selectedOwnerId,
    })
  }

  return (
    <AdminLayout title="Business Owners" icon={Users} description="Manage business entries by product/code. One user can have multiple businesses because each active code can represent a separate business.">
      <SectionPanel title="Business Owners" description="Each row is based on one product/code, not one user account.">
        <div className="mb-4 flex h-10 w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500 dark:border-slate-800 dark:bg-slate-950 md:max-w-sm">
          <Search className="size-4" />
          <input className="w-full bg-transparent text-sm outline-none" placeholder="Search business, email, code or batch" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>

        {isLoading ? (
          <div className="rounded-lg border border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">Loading business owners...</div>
        ) : (
          <DataTable
            columns={[
              { key: "businessName", label: "Business" },
              { key: "ownerEmail", label: "Owner Email" },
              { key: "code", label: "Code" },
              { key: "batch_name", label: "Batch" },
              { key: "scans", label: "Scans" },
              { key: "statusLabel", label: "Status", render: (row) => <StatusPill status={row.statusLabel} /> },
              // { key: "reports", label: "Reports" },
              { key: "activatedDate", label: "Activated" },
              { key: "createdDate", label: "Created" },
              {
                key: "actions",
                label: "Actions",
                render: (row) => (
                  <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
                      >
                        <MoreHorizontal className="size-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => openAssignModal(row)}>
                        Reassign Owner
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem onClick={() => openReportModal(row)}>
                        Report
                      </DropdownMenuItem> */}
                      <DropdownMenuItem
                        className={row.status === "blocked" ? "text-emerald-600 focus:text-emerald-600" : "text-red-600 focus:text-red-600"}
                        onClick={() => openStatusConfirm(row)}
                      >
                        {row.status === "blocked" ? "Unblock" : "Block"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ),
              },
            ]}
            emptyText="No business owner records found. Activated codes will appear here."
            rows={rows}
          />
        )}
      </SectionPanel>

      <ConfirmationModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={selectedBusiness?.status === "blocked" ? "Unblock Business?" : "Block Business?"}
        description={`${selectedBusiness?.businessName || selectedBusiness?.code || "This business"} will be ${selectedBusiness?.status === "blocked" ? "allowed again" : "blocked"}. The permanent URL remains the same.`}
        confirmText={selectedBusiness?.status === "blocked" ? "Yes, Unblock" : "Yes, Block"}
        cancelText="Cancel"
        loading={statusMutation.isPending}
        onConfirm={handleStatusConfirm}
      />


      <ConfirmationModal
        open={assignOpen}
        onOpenChange={setAssignOpen}
        title="Reassign Business Owner"
        description={`${selectedBusiness?.businessName || selectedBusiness?.code || "This product"} will be assigned to the selected owner. Activation will reset and the selected owner must scan/login and activate again.`}
        confirmText="Assign Owner"
        cancelText="Cancel"
        loading={assignMutation.isPending}
        onConfirm={handleAssignConfirm}
      >
        <div className="mt-4 space-y-2">
          <label className="text-sm font-medium">Select owner</label>
          <select
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950"
            value={selectedOwnerId}
            onChange={(event) => setSelectedOwnerId(event.target.value)}
          >
            <option value="">Choose business owner</option>
            {assignableOwners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.full_name || owner.email} {owner.email ? `(${owner.email})` : ""}
              </option>
            ))}
          </select>
          {assignMutation.error && <p className="text-sm text-red-600 dark:text-red-400">{assignMutation.error.message}</p>}
        </div>
      </ConfirmationModal>
      <ConfirmationModal
        open={reportOpen}
        onOpenChange={setReportOpen}
        title="Report Business"
        description="Add a report note for this business/code."
        confirmText="Save Report"
        cancelText="Cancel"
        loading={reportMutation.isPending}
        onConfirm={handleReportConfirm}
      >
        <textarea
          className="mt-4 min-h-24 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950"
          placeholder="Reason for report"
          value={reportReason}
          onChange={(event) => setReportReason(event.target.value)}
        />
      </ConfirmationModal>
    </AdminLayout>
  )
}

export default AdminOwners
