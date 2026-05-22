import { useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "@/configuration/Supabase/supabaseClient"

const getDeviceInfo = () => {
  const ua = navigator.userAgent || ""
  const deviceType = /tablet|ipad|playbook|silk/i.test(ua)
    ? "Tablet"
    : /mobi|android|iphone/i.test(ua)
      ? "Mobile"
      : "Desktop"

  const browser = /chrome|crios/i.test(ua)
    ? "Chrome"
    : /safari/i.test(ua)
      ? "Safari"
      : /firefox/i.test(ua)
        ? "Firefox"
        : /edg/i.test(ua)
          ? "Edge"
          : "Unknown"

  const os = /windows/i.test(ua)
    ? "Windows"
    : /mac os/i.test(ua)
      ? "macOS"
      : /android/i.test(ua)
        ? "Android"
        : /iphone|ipad/i.test(ua)
          ? "iOS"
          : "Unknown"

  return { deviceType, browser, os }
}

const shouldLogScan = (code) => {
  const key = `tapro:last-scan:${code}`
  const now = Date.now()
  const last = Number(sessionStorage.getItem(key) || 0)

  if (now - last < 2500) return false

  sessionStorage.setItem(key, String(now))
  return true
}

const writeScanLog = async ({ productId = null, code, activationState = false, redirectResult }) => {
  const { deviceType, browser, os } = getDeviceInfo()

  try {
    await supabase.from("scan_logs").insert({
      product_id: productId,
      scanned_code: code,
      timestamp: new Date().toISOString(),
      device_type: deviceType,
      browser,
      os,
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

const recordScan = async ({ product = null, code, activationState = false, redirectResult, countScan = false }) => {
  if (!shouldLogScan(code)) return

  await writeScanLog({
    productId: product?.id || null,
    code,
    activationState,
    redirectResult,
  })

  if (countScan && product?.id) {
    await updateScanCounter(product)
  }
}

const PublicRedirect = () => {
  const { code } = useParams()
  const navigate = useNavigate()
  const processedRef = useRef(false)

  useEffect(() => {
    const checkCode = async () => {
      if (processedRef.current) return
      processedRef.current = true

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
        await recordScan({
          code: cleanCode,
          activationState: false,
          redirectResult: "invalid_code",
          countScan: false,
        })
        navigate("/invalid-product", { replace: true })
        return
      }

      if (product.status === "blocked") {
        await recordScan({
          product,
          code: cleanCode,
          activationState: Boolean(product.activated),
          redirectResult: "blocked_product",
          countScan: false,
        })
        navigate("/invalid-product", { replace: true })
        return
      }

      if (!product.activated) {
        await recordScan({
          product,
          code: cleanCode,
          activationState: false,
          redirectResult: "activation_required",
          countScan: false,
        })
        navigate(`/activate/${cleanCode}`, { replace: true })
        return
      }

      if (product.owner_id) {
        const { data: ownerProfile } = await supabase
          .from("profiles")
          .select("account_status")
          .eq("id", product.owner_id)
          .maybeSingle()

        if (ownerProfile?.account_status === "blocked" || product.status === "blocked") {
          await recordScan({
            product,
            code: cleanCode,
            activationState: true,
            redirectResult: "suspended_owner",
            countScan: false,
          })
          navigate("/suspended-product", { replace: true })
          return
        }
      }

      if (!product.redirect_url) {
        await recordScan({
          product,
          code: cleanCode,
          activationState: true,
          redirectResult: "missing_redirect_url",
          countScan: true,
        })
        navigate("/invalid-product", { replace: true })
        return
      }

      await recordScan({
        product,
        code: cleanCode,
        activationState: true,
        redirectResult: "redirected",
        countScan: true,
      })

      window.location.href = product.redirect_url
    }

    checkCode()
  }, [code, navigate])

  return <div className="flex min-h-screen items-center justify-center">Checking product...</div>
}

export default PublicRedirect
