import { BarChart3 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getAdminAnalytics } from "@/services/productsApi"
import AdminLayout from "@/components/AdminDashboard/AdminLayout"
import QrStatus from "@/components/screens/AdminDashboard/QrStatus"
import DashboardStats from "@/components/screens/AdminDashboard/DashboardStats"
import CurrentActivation from "@/components/screens/AdminDashboard/CurrentActivation"



const AdminDashboard = () => {


  const { data: analytics, isLoading } = useQuery({ queryKey: ["admin-analytics"], queryFn: getAdminAnalytics })


  const active = analytics?.activeProducts || 0
  const inactive = analytics?.inactiveProducts || 0
  const total = Math.max(active + inactive, 1)
  const activePercent = Math.round((active / total) * 100)
  const inactivePercent = Math.round((inactive / total) * 100)

  
  return (
    <AdminLayout
      title="Dashboard"
      icon={BarChart3}
      description="Live overview of QR/NFC codes, products, scans, owners, and recent platform activity."
    >
      <DashboardStats analytics={analytics} isLoading={isLoading} ></DashboardStats>

      <QrStatus active={active} inactive={inactive} activePercent={activePercent} inactivePercent={inactivePercent} ></QrStatus>

      <CurrentActivation activePercent={activePercent} inactive={inactive} analytics={analytics} ></CurrentActivation>

    </AdminLayout>
  )
}

export default AdminDashboard
