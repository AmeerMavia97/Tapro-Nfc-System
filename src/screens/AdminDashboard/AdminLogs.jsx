import { Activity } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import AdminLayout from "@/components/AdminDashboard/AdminLayout"
import { getScanLogs } from "@/services/productsApi"
import { DataTable, SectionPanel, activityRows } from "./adminDashboardShared"

const AdminLogs = () => {
  const { data: scanLogs = [] } = useQuery({ queryKey: ["scan-logs"], queryFn: getScanLogs })

  const rows = scanLogs.length
    ? scanLogs.map((log) => ({
        id: log.id || `${log.scanned_code}-${log.timestamp}`,
        event: log.scanned_code,
        type: log.activation_state,
        user: log.device_type || "Scanner",
        time: log.timestamp ? new Date(log.timestamp).toLocaleString() : "-",
      }))
    : activityRows.map((row) => ({ ...row, id: row.event }))

  return (
    <AdminLayout title="Activity Logs" icon={Activity} description="Audit activation history, scan activity, admin actions, and ownership updates.">
      <SectionPanel title="Activity Logs" description="Activation, scan, admin, and ownership history.">
        <DataTable
          columns={[
            { key: "event", label: "Event" },
            { key: "type", label: "Type" },
            { key: "user", label: "User" },
            { key: "time", label: "Time" },
          ]}
          rows={rows}
        />
      </SectionPanel>
    </AdminLayout>
  )
}

export default AdminLogs
