import { supabase } from "@/configuration/Supabase/supabaseClient"
import { useParams, useNavigate } from "react-router-dom"

const ActivateProduct = () => {
  const { code } = useParams()
  const navigate = useNavigate()

  const handleActivate = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      navigate("/login")
      return
    }

    const googleReviewUrl =
      "https://search.google.com/local/writereview?placeid=test"

    const { error } = await supabase
      .from("products")
      .update({
        activated: true,
        owner_id: user.id,
        activation_time: new Date().toISOString(),
        redirect_url: googleReviewUrl,
      })
      .eq("unique_code", code)

    if (!error) {
      alert("Product activated successfully")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <button
        onClick={handleActivate}
        className="rounded-lg bg-black px-6 py-3 text-white"
      >
        Activate Product
      </button>
    </div>
  )
}

export default ActivateProduct