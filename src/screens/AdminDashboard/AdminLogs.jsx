import { Activity } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import AdminLayout from "@/components/AdminDashboard/AdminLayout"
import { getActivityLogs, getScanLogs } from "@/services/productsApi"
import { DataTable } from "./adminDashboardShared"
import { StatusPill } from "@/components/ui/statusPill"
import { SectionPanel } from '@/components/screens/AdminDashboard/SectionPanel'


const AdminLogs = () => {
  const { data: activityLogs = [], isLoading: activityLoading } = useQuery({ queryKey: ["activity-logs"], queryFn: getActivityLogs })
  const { data: scanLogs = [], isLoading: scanLoading } = useQuery({ queryKey: ["scan-logs"], queryFn: getScanLogs })

  const activityRows = activityLogs.map((log) => ({
    id: log.id,
    event: log.action_description,
    type: log.action_type,
    user: log.user_id || "System",
    time: log.created_at ? new Date(log.created_at).toLocaleString() : "-",
  }))

  const scanRows = scanLogs.map((log) => ({
    id: log.id || `${log.scanned_code}-${log.timestamp}`,
    code: log.scanned_code,
    device: log.device_type || "Unknown",
    location: log.location || [log.city, log.country].filter(Boolean).join(", ") || "-",
    state: log.activation_state ? "Active" : "Inactive",
    result: log.redirect_result || "-",
    time: log.timestamp ? new Date(log.timestamp).toLocaleString() : "-",
  }))

  return (
    <AdminLayout title="Activity Logs" icon={Activity} description="Functional audit history for activation, scan activity, owner actions, and admin changes.">
      <div className="space-y-6">
        <SectionPanel title="System Activity" description="Admin actions, product generation, activation, reports, and account status changes.">
          {activityLoading ? (
            <div className="rounded-lg border border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">Loading activity logs...</div>
          ) : (
            <DataTable
              columns={[
                { key: "event", label: "Event" },
                { key: "type", label: "Type" },
                { key: "user", label: "User" },
                { key: "time", label: "Time" },
              ]}
              emptyText="No activity logs yet."
              rows={activityRows}
            />
          )}
        </SectionPanel>

        <SectionPanel title="Scan Logs" description="Latest public URL scans and redirect results.">
          {scanLoading ? (
            <div className="rounded-lg border border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">Loading scan logs...</div>
          ) : (
            <DataTable
              columns={[
                { key: "code", label: "Code" },
                { key: "device", label: "Device" },
                { key: "location", label: "Location" },
                { key: "state", label: "Activation", render: (row) => <StatusPill status={row.state} /> },
                { key: "result", label: "Result" },
                { key: "time", label: "Time" },
              ]}
              emptyText="No scans yet."
              rows={scanRows}
            />
          )}
        </SectionPanel>
      </div>
    </AdminLayout>
  )
}

export default AdminLogs
