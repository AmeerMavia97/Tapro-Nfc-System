import { useAuthUser } from "@/components/hooks/useAuthUser";
import { Navigate } from "react-router-dom"

export default function RoleProtectedRoute({ children, allowedRole }) {
  const { data, isLoading } = useAuthUser()

  const user = data?.user
  const profile = data?.profile

  if (isLoading) return <p>Loading...</p>

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!profile) {
    return <p>Loading profile...</p>
  }

  if (profile.role !== allowedRole) {
    return <Navigate to="/" replace />
  }

  return children
}