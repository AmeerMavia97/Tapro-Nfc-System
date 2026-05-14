import { Settings } from "lucide-react"
import AdminLayout from "@/components/AdminDashboard/AdminLayout"
import { ActionButton, SectionPanel } from "./adminDashboardShared"

const AdminSettings = () => {
  return (
    <AdminLayout title="Settings" icon={Settings} description="Configure platform behavior, redirect rules, API settings, and basic branding.">
      <div className="grid gap-6 xl:grid-cols-2">
        {[
          ["System Configuration", "Default public URL base", "https://go.taprocard.com"],
          ["Redirect Settings", "Fallback redirect URL", "https://taprocard.com"],
          ["Google Integration", "Google Places API", "Configured in environment"],
          ["Branding", "Platform name", "TapRoCard"],
        ].map(([title, label, value]) => (
          <SectionPanel title={title} key={title}>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
            <input
              className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-slate-700"
              defaultValue={value}
            />
            <div className="mt-4">
              <ActionButton variant="secondary">Save</ActionButton>
            </div>
          </SectionPanel>
        ))}
      </div>
    </AdminLayout>
  )
}

export default AdminSettings
