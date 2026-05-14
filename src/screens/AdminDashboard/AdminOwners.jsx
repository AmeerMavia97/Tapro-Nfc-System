import { Plus, Search, Users } from "lucide-react"
import AdminLayout from "@/components/AdminDashboard/AdminLayout"
import { ActionButton, DataTable, SectionPanel, StatusPill, ownerRows } from "./adminDashboardShared"

const AdminOwners = () => {
  return (
    <AdminLayout title="Business Owners" icon={Users} description="Manage business owner accounts, product assignment, and account access actions.">
      <SectionPanel title="Business Owners" description="View owners, assign products, and manage account access.">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex h-10 w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500 dark:border-slate-800 dark:bg-slate-950 md:max-w-sm">
            <Search className="size-4" />
            <input className="w-full bg-transparent text-sm outline-none" placeholder="Search business owner" />
          </div>
          <ActionButton icon={Plus}>Assign Product</ActionButton>
        </div>
        <DataTable
          columns={[
            { key: "name", label: "Owner" },
            { key: "products", label: "Products" },
            { key: "scans", label: "Scans" },
            { key: "status", label: "Status", render: (row) => <StatusPill status={row.status} /> },
            { key: "action", label: "Action", render: () => <ActionButton variant="secondary">Reset</ActionButton> },
          ]}
          rows={ownerRows.map((row) => ({ ...row, id: row.name }))}
        />
      </SectionPanel>
    </AdminLayout>
  )
}

export default AdminOwners
