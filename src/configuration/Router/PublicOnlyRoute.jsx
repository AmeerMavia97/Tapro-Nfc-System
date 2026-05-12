import { useAuthUser } from "@/components/hooks/useAuthUser"
import { getDashboardPath } from "@/services/authApi"
import { Navigate } from "react-router-dom"

export default function PublicOnlyRoute({ children }) {
  const { data, isLoading, isFetching } = useAuthUser()
  const user = data?.user
  const profile = data?.profile

  if (isLoading || isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-medium text-slate-600 dark:bg-slate-950 dark:text-slate-300">
        Loading...
      </div>
    )
  }

  if (user && profile) {
    return <Navigate to={getDashboardPath(profile)} replace />
  }

  return children
}
