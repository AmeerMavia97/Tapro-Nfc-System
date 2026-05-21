import { useMemo, useState } from "react"
import { Search, UserRound } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import AdminLayout from "@/components/AdminDashboard/AdminLayout"
import { getAdminUsers } from "@/services/productsApi"
import { DataTable } from "./adminDashboardShared"
import { StatusPill } from "@/components/ui/statusPill"
import { SectionPanel } from '@/components/screens/AdminDashboard/SectionPanel'


const AdminUsers = () => {
  const [search, setSearch] = useState("")
  const { data: users = [], isLoading } = useQuery({ queryKey: ["admin-users"], queryFn: getAdminUsers })

  const rows = useMemo(() => {
    const cleanSearch = search.toLowerCase()

    return users
      .filter((user) => `${user.name || ""} ${user.email || ""}`.toLowerCase().includes(cleanSearch))
      .map((user) => ({
        ...user,
        id: user.id,
        name: user.name,
        email: user.email,
        joined: user.joined,
        productCount: user.products_count,
        activeProducts: user.active_products,
        accountStatus: user.account_status,
      }))
  }, [users, search])

  return (
    <AdminLayout title="Users" icon={UserRound} description="View all registered user accounts and their active product count.">
      <SectionPanel title="All Users" description="This page is account-based. Business Owners page is code/product-based.">
        <div className="mb-4 flex h-10 w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500 dark:border-slate-800 dark:bg-slate-950 md:max-w-sm">
          <Search className="size-4" />
          <input className="w-full bg-transparent text-sm outline-none" placeholder="Search user or email" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>

        {isLoading ? (
          <div className="rounded-lg border border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">Loading users...</div>
        ) : (
          <DataTable
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "joined", label: "Account Created" },
              { key: "productCount", label: "Products" },
              { key: "activeProducts", label: "Active Products" },
              { key: "accountStatus", label: "Account", render: (row) => <StatusPill status={row.accountStatus} /> },
            ]}
            emptyText="No users found."
            rows={rows}
          />
        )}
      </SectionPanel>
    </AdminLayout>
  )
}

export default AdminUsers
