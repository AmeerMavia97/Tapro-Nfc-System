import { useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { supabase } from "@/configuration/Supabase/supabaseClient"
import { clearCachedAuthUser, fetchCurrentUser, refreshCurrentUser } from "@/services/authApi"

export const AUTH_USER_QUERY_KEY = ["auth-user"]

export function useAuthUser() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: AUTH_USER_QUERY_KEY,
    queryFn: fetchCurrentUser,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  })

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        clearCachedAuthUser()
        queryClient.setQueryData(AUTH_USER_QUERY_KEY, null)
        return
      }

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        queryClient.fetchQuery({
          queryKey: AUTH_USER_QUERY_KEY,
          queryFn: refreshCurrentUser,
          staleTime: Infinity,
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [queryClient])

  return query
}
