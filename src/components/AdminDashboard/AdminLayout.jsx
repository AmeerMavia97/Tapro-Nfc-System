import { useState } from "react"
import AdminHeader from "@/components/AdminDashboard/AdminHeader"
import AdminMobileDrawer from "@/components/AdminDashboard/AdminMobileDrawer"
import AdminSidebar from "@/components/AdminDashboard/AdminSidebar"

const AdminLayout = ({ title, description, children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="relative flex min-h-screen gap-6 p-4 sm:p-6 lg:p-6">
        <AdminSidebar />
        <AdminMobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

        <section className="min-w-0 flex-1">
          <div className="min-h-[calc(100vh-4rem)] overflow-hidden rounded-[2.5rem] bg-white shadow-[0_28px_90px_rgba(15,23,42,0.10)] ring-1 ring-slate-100">
            <AdminHeader title={title} description={description} onMenuClick={() => setDrawerOpen(true)} />

            <div className="px-5 py-6 sm:px-7 lg:px-6">
              <div className="pr-4 sm:pr-5 lg:pr-3">
                {children}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default AdminLayout
