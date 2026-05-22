import { useAuthUser } from "@/components/hooks/useAuthUser"
import { getDashboardPath } from "@/services/authApi"
import { Navigate, useLocation } from "react-router-dom"

export default function RoleProtectedRoute({ children, allowedRole }) {
  const location = useLocation()
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

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!profile) {
    return <Navigate to="/login" replace />
  }

  if (profile.role !== allowedRole) {
    return <Navigate to={getDashboardPath(profile)} replace />
  }

  return children
}
