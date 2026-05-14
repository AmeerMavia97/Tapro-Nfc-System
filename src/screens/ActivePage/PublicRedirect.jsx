import { supabase } from "@/configuration/Supabase/supabaseClient"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

const PublicRedirect = () => {
  const { code } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const checkCode = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("unique_code", code)
        .single()

      if (error || !data) {
        navigate("/invalid")
        return
      }

      if (!data.activated) {
        navigate(`/activate/${code}`)
        return
      }

      window.location.href = data.redirect_url
    }

    checkCode()
  }, [code, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center">
      Checking product...
    </div>
  )
}

export default PublicRedirect