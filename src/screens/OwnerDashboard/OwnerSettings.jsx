import { CheckCircle2, UserRound } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import OwnerLayout, { ActionButton, ErrorPanel, LoadingPanel, SectionPanel } from "./ownerDashboardShared"
import ConfirmationModal from "@/components/Modal/ConfirmationModal"
import { getCurrentOwnerProfile, updateCurrentOwnerProfile } from "@/services/ownerApi"

const OwnerSettings = () => {
  const queryClient = useQueryClient()
  const [fullName, setFullName] = useState("")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [success, setSuccess] = useState(false)

  const { data: profile, isLoading, error } = useQuery({ queryKey: ["owner-profile"], queryFn: getCurrentOwnerProfile })

  useEffect(() => {
    if (profile) setFullName(profile.full_name || "")
  }, [profile])

  const updateMutation = useMutation({
    mutationFn: updateCurrentOwnerProfile,
    onSuccess: () => {
      setSuccess(true)
      setConfirmOpen(false)
      queryClient.invalidateQueries({ queryKey: ["owner-profile"] })
      queryClient.invalidateQueries({ queryKey: ["auth-user"] })
    },
  })

  if (isLoading) return <OwnerLayout title="Settings/Profile"><LoadingPanel /></OwnerLayout>
  if (error) return <OwnerLayout title="Settings/Profile"><ErrorPanel message={error.message} /></OwnerLayout>

  return (
    <OwnerLayout title="Settings/Profile">
      <div className="grid gap-6 xl:grid-cols-2">
        <SectionPanel title="Profile Details" description="Update your owner profile name.">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <UserRound className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Owner Profile</h2>
              <p className="text-sm text-slate-500">This name appears on your owner account.</p>
            </div>
          </div>

          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-500/10 dark:text-green-300">
              <CheckCircle2 className="size-4" />
              Profile updated successfully.
            </div>
          )}

          {updateMutation.error && <ErrorPanel message={updateMutation.error.message} />}

          <form className="mt-4 space-y-5" onSubmit={(event) => { event.preventDefault(); setConfirmOpen(true) }}>
            <div>
              <label className="mb-1 block text-sm font-medium">Full Name</label>
              <input
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950"
                value={fullName}
                onChange={(event) => { setFullName(event.target.value); setSuccess(false) }}
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input className="h-11 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-800" value={profile?.email || profile?.auth_email || ""} disabled />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Role</label>
                <input className="h-11 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-800" value={profile?.role || "user"} disabled />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Account Status</label>
                <input className="h-11 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-800" value={profile?.account_status === "blocked" ? "Suspended" : "Active"} disabled />
              </div>
            </div>

            <ActionButton disabled={updateMutation.isPending}>Save Changes</ActionButton>
          </form>
        </SectionPanel>

        <SectionPanel title="Account Security" description="Password changes are handled from the secure password reset flow.">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            Use forgot password from login screen if you need to reset your password. Your email is protected by Supabase authentication.
          </p>
        </SectionPanel>
      </div>

      <ConfirmationModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Save profile changes?"
        description="Are you sure you want to update your profile details?"
        confirmText="Yes, Save"
        cancelText="Cancel"
        loading={updateMutation.isPending}
        onConfirm={() => updateMutation.mutate({ fullName })}
      />
    </OwnerLayout>
  )
}

export default OwnerSettings
