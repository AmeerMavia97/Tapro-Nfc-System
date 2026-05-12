import { fetchCurrentUser } from "@/services/authApi"
import { useQuery } from "@tanstack/react-query"

export function useAuthUser() {
  return useQuery({
    queryKey: ["auth-user"],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 min cache
    refetchOnWindowFocus: true,
  })
}