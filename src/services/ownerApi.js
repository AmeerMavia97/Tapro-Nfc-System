import { supabase } from "@/configuration/Supabase/supabaseClient"

const getLogTimestamp = (log) => log?.timestamp || log?.created_at || null
const getDateKey = (value) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString().slice(0, 10)
}


const getLast7DayKeys = () =>
  Array.from({ length: 7 }).map((_, index) => {
    const date = new Date()
    date.setHours(12, 0, 0, 0)
    date.setDate(date.getDate() - (6 - index))
    return {
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
    }
  })

const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) throw new Error("User session not found")
  return data.user
}

export const logOwnerActivity = async ({ actionType, description, metadata = null, userId = null }) => {
  try {
    await supabase.from("activity_logs").insert({
      user_id: userId,
      action_type: actionType,
      action_description: description,
      metadata,
    })
  } catch {
  }
}

export async function getCurrentOwnerProfile() {
  const user = await getCurrentUser()

  const { data, error } = await supabase
    .from("profiles")
    .select("id,full_name,email,role,account_status,created_at")
    .eq("id", user.id)
    .single()

  if (error) throw new Error(error.message)
  return { ...data, auth_email: user.email }
}

export async function updateCurrentOwnerProfile({ fullName }) {
  const user = await getCurrentUser()

  const { data, error } = await supabase
    .from("profiles")
    .update({ full_name: fullName?.trim() || null })
    .eq("id", user.id)
    .select("id,full_name,email,role,account_status,created_at")
    .single()

  if (error) throw new Error(error.message)

  await logOwnerActivity({
    actionType: "Owner Profile Updated",
    description: "Owner profile name was updated",
    userId: user.id,
    metadata: { full_name: fullName?.trim() || null },
  })

  return data
}

export async function getOwnerProducts() {
  const user = await getCurrentUser()

  const { data, error } = await supabase
    .from("products")
    .select("id,batch_id,batch_name,unique_code,permanent_url,redirect_url,google_place_id,owner_id,owner_name,owner_email,business_name,activated,activation_time,status,total_scans,last_scan_at,created_at")
    .eq("owner_id", user.id)
    .order("activation_time", { ascending: false, nullsFirst: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function getOwnerScanLogs(limit = 200) {
  const products = await getOwnerProducts()
  const productIds = products.map((product) => product.id)

  if (productIds.length === 0) return []

  const { data, error } = await supabase
    .from("scan_logs")
    .select("id,product_id,scanned_code,timestamp,created_at,device_type,browser,os,country,city,location,activation_state,redirect_result")
    .in("product_id", productIds)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return data || []
}

export async function updateOwnerProductRedirect() {
  throw new Error("Review destinations are locked after activation. Please contact admin for reassignment or support changes.")
}

export async function getOwnerActivityLogs(limit = 200) {
  const user = await getCurrentUser()
  const products = await getOwnerProducts()
  const productCodes = new Set(products.map((product) => product.unique_code))

  const { data, error } = await supabase
    .from("activity_logs")
    .select("id,user_id,action_type,action_description,metadata,created_at")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)

  return (data || []).filter((log) => {
    if (log.user_id === user.id) return true
    const code = log.metadata?.unique_code
    return code ? productCodes.has(code) : false
  })
}

export async function getOwnerDashboardData() {
  const [profile, products, scanLogs, activityLogs] = await Promise.all([
    getCurrentOwnerProfile(),
    getOwnerProducts(),
    getOwnerScanLogs(200),
    getOwnerActivityLogs(200).catch(() => []),
  ])

  const activeProducts = products.filter((product) => product.activated && product.status !== "blocked")
  const totalScans = products.reduce((sum, product) => sum + Number(product.total_scans || 0), 0) || scanLogs.length
  const topProduct = [...products].sort((a, b) => Number(b.total_scans || 0) - Number(a.total_scans || 0))[0]
  const connectedBusinesses = new Set(products.map((product) => product.business_name).filter(Boolean)).size

  const sevenDays = getLast7DayKeys().map(({ key, label }) => {
    const count = scanLogs.filter((log) => getDateKey(getLogTimestamp(log)) === key).length
    return { label, value: count }
  })

  return {
    profile,
    products,
    scanLogs,
    activityLogs,
    activeProductsCount: activeProducts.length,
    pendingProductsCount: products.filter((product) => !product.activated).length,
    totalScans,
    topProduct,
    connectedBusinesses,
    sevenDays,
  }
}
