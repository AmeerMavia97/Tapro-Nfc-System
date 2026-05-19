import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "@/configuration/Supabase/supabaseClient"

const getDeviceType = () => {
  const ua = navigator.userAgent || ""
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "Tablet"
  if (/mobi|android|iphone/i.test(ua)) return "Mobile"
  return "Desktop"
}

const logScan = async ({ productId = null, code, activationState = false, redirectResult }) => {
  try {
    await supabase.from("scan_logs").insert({
      product_id: productId,
      scanned_code: code,
      device_type: getDeviceType(),
      activation_state: activationState,
      redirect_result: redirectResult,
    })
  } catch (error) {
    console.warn("Scan log failed", error)
  }
}

const updateScanCounter = async (product) => {
  try {
    const { error: rpcError } = await supabase.rpc("record_product_scan", {
      target_product_id: product.id,
    })

    if (!rpcError) return

    await supabase
      .from("products")
      .update({
        total_scans: Number(product.total_scans || 0) + 1,
        last_scan_at: new Date().toISOString(),
      })
      .eq("id", product.id)
  } catch (error) {
    console.warn("Scan counter update failed", error)
  }
}

const PublicRedirect = () => {
  const { code } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const checkCode = async () => {
      const cleanCode = String(code || "").trim().toUpperCase()

      if (!cleanCode) {
        navigate("/invalid-product", { replace: true })
        return
      }

      const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("unique_code", cleanCode)
        .maybeSingle()

      if (error || !product) {
        await logScan({
          code: cleanCode,
          activationState: false,
          redirectResult: "invalid_code",
        })
        navigate("/invalid-product", { replace: true })
        return
      }

      if (product.status === "blocked") {
        await logScan({
          productId: product.id,
          code: cleanCode,
          activationState: Boolean(product.activated),
          redirectResult: "blocked_product",
        })
        navigate("/invalid-product", { replace: true })
        return
      }

      if (!product.activated) {
        await logScan({
          productId: product.id,
          code: cleanCode,
          activationState: false,
          redirectResult: "activation_required",
        })
        navigate(`/activate/${cleanCode}`, { replace: true })
        return
      }

      await logScan({
        productId: product.id,
        code: cleanCode,
        activationState: true,
        redirectResult: product.redirect_url ? "redirected" : "missing_redirect_url",
      })

      await updateScanCounter(product)

      if (!product.redirect_url) {
        navigate("/invalid-product", { replace: true })
        return
      }

      window.location.href = product.redirect_url
    }

    checkCode()
  }, [code, navigate])

  return <div className="flex min-h-screen items-center justify-center">Checking product...</div>
}

export default PublicRedirect
