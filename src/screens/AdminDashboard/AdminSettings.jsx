import { useEffect, useState } from "react"
import { CheckCircle2, Loader2, Settings, UserRound } from "lucide-react"
import AdminLayout from "@/components/AdminDashboard/AdminLayout"
import { getAdminProfile, updateAdminProfile } from "@/services/authApi"
import ConfirmationModal from "@/components/Modal/ConfirmationModal"

const AdminSettings = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    role: "",
    accountStatus: "",
  })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        const profile = await getAdminProfile()

        setForm({
          fullName: profile?.full_name || "",
          email: profile?.email || "",
          role: profile?.role || "",
          accountStatus: profile?.account_status || "",
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setConfirmOpen(true)
  }

  const handleConfirmSave = async () => {
    try {
      setSaving(true)
      setError("")

      const updated = await updateAdminProfile({
        fullName: form.fullName,
      })

      setForm((prev) => ({
        ...prev,
        fullName: updated?.full_name || "",
      }))

      setConfirmOpen(false)
      setSuccessOpen(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Settings" icon={Settings}>
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="size-6 animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      title="Settings"
      icon={Settings}
      description="Manage your admin profile details."
    >
      <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            <UserRound className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Admin Profile</h2>
            <p className="text-sm text-slate-500">
              Update your admin account information.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {successOpen && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            <CheckCircle2 className="size-4" />
            Profile updated successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Full Name
            </label>
            <input
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950"
              value={form.fullName}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  fullName: e.target.value,
                }))
              }
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              className="h-11 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-800"
              value={form.email}
              disabled
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Role
              </label>
              <input
                className="h-11 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-800"
                value={form.role}
                disabled
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Account Status
              </label>
              <input
                className="h-11 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-800"
                value={form.accountStatus}
                disabled
              />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-950"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      <ConfirmationModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Save changes?"
        description="Are you sure you want to update your admin profile details?"
        confirmText="Yes, Save"
        cancelText="Cancel"
        loading={saving}
        onConfirm={handleConfirmSave}
      />
    </AdminLayout>
  )
}

export default AdminSettings