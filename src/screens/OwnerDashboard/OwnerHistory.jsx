import { useQuery } from "@tanstack/react-query"
import OwnerLayout, { DataTable, ErrorPanel, LoadingPanel, SectionPanel } from "./ownerDashboardShared"
import { getOwnerActivityLogs, getOwnerScanLogs } from "@/services/ownerApi"

const OwnerHistory = () => {
  const activityQuery = useQuery({ queryKey: ["owner-activity-logs"], queryFn: () => getOwnerActivityLogs(200) })
  const scansQuery = useQuery({ queryKey: ["owner-scan-logs"], queryFn: () => getOwnerScanLogs(200) })

  const isLoading = activityQuery.isLoading || scansQuery.isLoading
  const error = activityQuery.error || scansQuery.error

  if (isLoading) return <OwnerLayout title="Activity / History"><LoadingPanel /></OwnerLayout>
  if (error) return <OwnerLayout title="Activity / History"><ErrorPanel message={error.message} /></OwnerLayout>

  return (
    <OwnerLayout title="Activity / History">
      <div className="space-y-6">
        <SectionPanel title="Activity / History" description="Product activations, redirect updates, and ownership changes.">
          <DataTable
            columns={[
              { key: "action_description", label: "Activity" },
              { key: "action_type", label: "Type" },
              { key: "created_at", label: "Time", render: (row) => row.created_at ? new Date(row.created_at).toLocaleString() : "-" },
            ]}
            rows={activityQuery.data || []}
            emptyText="No activity found yet."
          />
        </SectionPanel>

        <SectionPanel title="Scan Logs" description="Recent scan history from your products.">
          <DataTable
            columns={[
              { key: "scanned_code", label: "Code" },
              { key: "device_type", label: "Device" },
              { key: "redirect_result", label: "Result" },
              { key: "timestamp", label: "Time", render: (row) => row.timestamp ? new Date(row.timestamp).toLocaleString() : "-" },
            ]}
            rows={scansQuery.data || []}
            emptyText="No scan logs yet."
          />
        </SectionPanel>
      </div>
    </OwnerLayout>
  )
}

export default OwnerHistory
