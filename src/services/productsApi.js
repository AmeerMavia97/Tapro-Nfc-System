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

const PUBLIC_URL_BASE = (import.meta.env.VITE_PUBLIC_URL_BASE || "https://go.taprocard.com").replace(/\/$/, "")
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

const getBatchPrefix = (batchName = "") => {
  const words = batchName
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)

  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`
  return (words[0] || "TP").slice(0, 2).padEnd(2, "X")
}

const randomString = (length = 8) => {
  const values = new Uint32Array(length)
  crypto.getRandomValues(values)
  return Array.from(values).map((value) => ALPHABET[value % ALPHABET.length]).join("")
}

const makeUniqueCode = (batchName = "", usedCodes = new Set()) => {
  let code = ""
  do {
    code = `${getBatchPrefix(batchName)}-${randomString(8)}`
  } while (usedCodes.has(code))
  usedCodes.add(code)
  return code
}

const makeRows = ({ batchName, batchId, quantity }) => {
  const usedCodes = new Set()

  return Array.from({ length: Number(quantity) }).map(() => {
    const uniqueCode = makeUniqueCode(batchName, usedCodes)
    const publicUrl = `${PUBLIC_URL_BASE}/${uniqueCode}`

    return {
      batch_id: batchId,
      batch_name: batchName.trim(),
      unique_code: uniqueCode,
      permanent_url: publicUrl,
      redirect_url: null,
      activated: false,
      owner_id: null,
      status: "inactive",
    }
  })
}

const logActivity = async ({ actionType, description, metadata = null, userId = null }) => {
  await supabase.from("activity_logs").insert({
    action_type: actionType,
    action_description: description,
    metadata,
    user_id: userId,
  })
}

export const getPermanentUrl = (uniqueCode, permanentUrl) => permanentUrl || `${PUBLIC_URL_BASE}/${uniqueCode}`

export async function generateProducts({ batchName, quantity }) {
  const cleanBatchName = batchName.trim()
  const total = Number(quantity)

  if (!cleanBatchName) throw new Error("Batch name is required")
  if (!Number.isInteger(total) || total < 1) throw new Error("Quantity must be greater than 0")
  if (total > 1000) throw new Error("Maximum 1000 URLs can be generated at once")

  const { data: authData } = await supabase.auth.getUser()

  const { data: batch, error: batchError } = await supabase
    .from("product_batches")
    .insert({ name: cleanBatchName, quantity: total, created_by: authData?.user?.id || null })
    .select("id,name,quantity,created_at")
    .single()

  if (batchError) throw new Error(batchError.message)

  const rows = makeRows({ batchId: batch.id, batchName: cleanBatchName, quantity: total })

  const { data, error } = await supabase.from("products").insert(rows).select("*")

  if (error) throw new Error(error.message)

  await logActivity({
    actionType: "Product Generated",
    description: `${total} permanent URLs generated for batch ${cleanBatchName}`,
    userId: authData?.user?.id || null,
    metadata: { batch_id: batch.id, batch_name: cleanBatchName, quantity: total },
  })

  return data || []
}

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("id,batch_id,unique_code,permanent_url,batch_name,owner_id,owner_name,owner_email,business_name,activated,activation_time,redirect_url,google_place_id,status,total_scans,last_scan_at,created_at")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function getProductBatches() {
  const { data, error } = await supabase
    .from("product_batches")
    .select("id,name,quantity,created_by,created_at")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function updateProductRedirect() {
  throw new Error("Generated URLs and review destinations are locked. Use product reassignment flow instead.")
}

export async function getScanLogs() {
  const { data, error } = await supabase
    .from("scan_logs")
    .select("id,product_id,scanned_code,timestamp,created_at,device_type,browser,os,country,city,location,activation_state,redirect_result")
    .order("created_at", { ascending: false })
    .limit(200)

  if (error) throw new Error(error.message)
  return data || []
}

export async function getActivityLogs() {
  const { data, error } = await supabase
    .from("activity_logs")
    .select("id,user_id,action_type,action_description,metadata,created_at")
    .order("created_at", { ascending: false })
    .limit(200)

  if (error) throw new Error(error.message)
  return data || []
}

export async function getBusinessOwners() {
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id,full_name,email,role,created_at,account_status,report_count,blocked_at")
    .eq("role", "user")
    .order("created_at", { ascending: false })

  if (profilesError) throw new Error(profilesError.message)

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id,owner_id,activated,total_scans")

  if (productsError) throw new Error(productsError.message)

  return (profiles || []).map((owner) => {
    const ownerProducts = (products || []).filter((product) => product.owner_id === owner.id)
    const activeProducts = ownerProducts.filter((product) => product.activated).length
    const scans = ownerProducts.reduce((sum, product) => sum + Number(product.total_scans || 0), 0)

    return {
      ...owner,
      products_count: ownerProducts.length,
      active_products: activeProducts,
      inactive_products: ownerProducts.length - activeProducts,
      scans_count: scans,
      product_status: activeProducts > 0 ? "Active" : "Inactive",
      account_status: owner.account_status || "active",
      report_count: owner.report_count || 0,
    }
  })
}

export async function updateOwnerStatus({ ownerId, blocked }) {
  const payload = {
    account_status: blocked ? "blocked" : "active",
    blocked_at: blocked ? new Date().toISOString() : null,
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", ownerId)
    .select("*")
    .single()

  if (error) throw new Error(error.message)

  const { data: authData } = await supabase.auth.getUser()
  await logActivity({
    actionType: blocked ? "Owner Blocked" : "Owner Unblocked",
    description: `${data?.email || ownerId} was ${blocked ? "blocked" : "unblocked"}`,
    userId: authData?.user?.id || null,
    metadata: { owner_id: ownerId, account_status: payload.account_status },
  })

  return data
}

export async function addOwnerReport({ ownerId, reason }) {
  if (!reason?.trim()) throw new Error("Report reason is required")

  const { data: authData } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("owner_reports")
    .insert({ owner_id: ownerId, reason: reason.trim(), reported_by: authData?.user?.id || null })
    .select("*")
    .single()

  if (error) throw new Error(error.message)

  await supabase.rpc("increment_owner_report_count", { target_owner_id: ownerId }).catch(async () => {
    const { data: owner } = await supabase.from("profiles").select("report_count").eq("id", ownerId).single()
    await supabase.from("profiles").update({ report_count: Number(owner?.report_count || 0) + 1 }).eq("id", ownerId)
  })

  await logActivity({
    actionType: "Owner Reported",
    description: `Report added for owner`,
    userId: authData?.user?.id || null,
    metadata: { owner_id: ownerId, reason: reason.trim() },
  })

  return data
}

export async function getProductBusinessOwners() {
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id,unique_code,permanent_url,batch_name,owner_id,owner_name,owner_email,business_name,activated,activation_time,redirect_url,google_place_id,status,total_scans,last_scan_at,created_at,report_count")
    .eq("activated", true)
    .order("activation_time", { ascending: false })

  if (productsError) throw new Error(productsError.message)

  const ownerIds = [...new Set((products || []).map((product) => product.owner_id).filter(Boolean))]
  let profilesById = {}

  if (ownerIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id,full_name,email,account_status")
      .in("id", ownerIds)

    profilesById = Object.fromEntries((profiles || []).map((profile) => [profile.id, profile]))
  }

  return (products || []).map((product) => {
    const ownerProfile = profilesById[product.owner_id]
    const isOwnerBlocked = ownerProfile?.account_status === "blocked"
    const isProductBlocked = product.status === "blocked"
    const isSuspended = isOwnerBlocked || isProductBlocked
    const isActive = Boolean(product.activated && product.owner_id && !isSuspended)

    return {
      ...product,
      owner_account_status: ownerProfile?.account_status || "active",
      display_name: product.business_name || product.owner_name || ownerProfile?.full_name || "Unassigned Business",
      display_email: product.owner_email || ownerProfile?.email || "-",
      code: product.unique_code,
      scans_count: Number(product.total_scans || 0),
      business_status: isSuspended ? "Suspended" : isActive ? "Active" : "Inactive",
      reports: Number(product.report_count || 0),
      activated_date: product.activation_time ? new Date(product.activation_time).toLocaleDateString() : "-",
      created_date: product.created_at ? new Date(product.created_at).toLocaleDateString() : "-",
    }
  })
}

export async function updateProductBusinessStatus({ productId, blocked }) {
  const nextStatus = blocked ? "blocked" : "active"

  const { data: existingProduct } = await supabase
    .from("products")
    .select("id,owner_id,business_name,unique_code")
    .eq("id", productId)
    .single()

  const { data, error } = await supabase
    .from("products")
    .update({ status: nextStatus })
    .eq("id", productId)
    .select("*")
    .single()

  if (error) throw new Error(error.message)

  if (existingProduct?.owner_id) {
    await supabase
      .from("profiles")
      .update({
        account_status: blocked ? "blocked" : "active",
        blocked_at: blocked ? new Date().toISOString() : null,
      })
      .eq("id", existingProduct.owner_id)
  }

  const { data: authData } = await supabase.auth.getUser()
  await logActivity({
    actionType: blocked ? "Business Blocked" : "Business Unblocked",
    description: `${data?.business_name || data?.unique_code || productId} was ${blocked ? "blocked" : "unblocked"}`,
    userId: authData?.user?.id || null,
    metadata: { product_id: productId, owner_id: existingProduct?.owner_id || null, unique_code: data?.unique_code, status: nextStatus },
  })

  return data
}

export async function addProductBusinessReport({ productId, ownerId, reason }) {
  if (!reason?.trim()) throw new Error("Report reason is required")

  const { data: authData } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("owner_reports")
    .insert({
      owner_id: ownerId || authData?.user?.id || null,
      product_id: productId,
      reason: reason.trim(),
      reported_by: authData?.user?.id || null,
    })
    .select("*")
    .single()

  if (error) throw new Error(error.message)

  const { data: product } = await supabase.from("products").select("report_count,unique_code").eq("id", productId).single()
  await supabase
    .from("products")
    .update({ report_count: Number(product?.report_count || 0) + 1 })
    .eq("id", productId)

  await logActivity({
    actionType: "Business Reported",
    description: `Report added for ${product?.unique_code || productId}`,
    userId: authData?.user?.id || null,
    metadata: { product_id: productId, owner_id: ownerId, reason: reason.trim() },
  })

  return data
}


export async function getAssignableOwners() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,full_name,email,role,account_status,created_at")
    .eq("role", "user")
    .neq("account_status", "blocked")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function reassignProductBusinessOwner({ productId, ownerId }) {
  if (!productId) throw new Error("Product is required")
  if (!ownerId) throw new Error("Please select a business owner")

  const { data: owner, error: ownerError } = await supabase
    .from("profiles")
    .select("id,full_name,email,account_status,role")
    .eq("id", ownerId)
    .eq("role", "user")
    .single()

  if (ownerError || !owner) throw new Error("Selected owner was not found")
  if (owner.account_status === "blocked") throw new Error("Blocked owner cannot be assigned")

  const { data: authData } = await supabase.auth.getUser()

  const basePayload = {
    owner_id: owner.id,
    owner_name: owner.full_name || null,
    owner_email: owner.email || null,
    business_name: null,
    redirect_url: null,
    google_place_id: null,
    activated: false,
    activation_time: null,
    status: "inactive",
  }

  const payloadWithAudit = {
    ...basePayload,
    reassigned_by: authData?.user?.id || null,
    reassigned_at: new Date().toISOString(),
  }

  let response = await supabase
    .from("products")
    .update(payloadWithAudit)
    .eq("id", productId)
    .select("*")
    .single()

  if (response.error && String(response.error.message || "").includes("reassigned_at")) {
    response = await supabase
      .from("products")
      .update(basePayload)
      .eq("id", productId)
      .select("*")
      .single()
  }

  if (response.error) throw new Error(response.error.message)

  const data = response.data

  await logActivity({
    actionType: "Business Owner Reassigned",
    description: `${data.unique_code} assigned to ${owner.email}. Activation is pending until the assigned owner scans and activates it.`,
    userId: authData?.user?.id || null,
    metadata: { product_id: productId, unique_code: data.unique_code, owner_id: owner.id, owner_email: owner.email },
  })

  return data
}

export async function getAdminUsers() {
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id,full_name,email,role,created_at,account_status")
    .eq("role", "user")
    .order("created_at", { ascending: false })

  if (profilesError) throw new Error(profilesError.message)

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id,owner_id,activated,status")

  if (productsError) throw new Error(productsError.message)

  return (profiles || []).map((user) => {
    const userProducts = (products || []).filter((product) => product.owner_id === user.id)
    const activeProducts = userProducts.filter((product) => product.activated && product.status !== "blocked").length

    return {
      ...user,
      name: user.full_name || "No name",
      email: user.email || "-",
      joined: user.created_at ? new Date(user.created_at).toLocaleDateString() : "-",
      products_count: userProducts.length,
      active_products: activeProducts,
      account_status: user.account_status === "blocked" ? "Suspended" : "Active",
    }
  })
}

export async function getAdminAnalytics() {
  const [productsResult, ownersResult, logsResult, batchesResult] = await Promise.all([
    getProducts(),
    getBusinessOwners(),
    getScanLogs(),
    getProductBatches(),
  ])

  const products = productsResult || []
  const owners = ownersResult || []
  const logs = logsResult || []
  const batches = batchesResult || []

  const activeProducts = products.filter((product) => product.activated).length
  const productScanTotal = products.reduce((sum, product) => sum + Number(product.total_scans || 0), 0)
  const totalScans = Math.max(logs.length, productScanTotal)
  const inactiveProducts = products.length - activeProducts
  const blockedOwners = owners.filter((owner) => owner.account_status === "blocked").length

  const byCode = products
    .map((product) => ({
      id: product.id,
      unique_code: product.unique_code,
      business_name: product.business_name || "Unassigned",
      total_scans: Number(product.total_scans || 0),
      status: product.activated ? "Active" : "Inactive",
    }))
    .sort((a, b) => b.total_scans - a.total_scans)
    .slice(0, 10)

  const sevenDays = getLast7DayKeys().map(({ key, label }) => {
    const count = logs.filter((log) => getDateKey(getLogTimestamp(log)) === key).length
    return { label, value: count }
  })

  return {
    totalProducts: products.length,
    activeProducts,
    inactiveProducts,
    totalScans,
    totalOwners: owners.length,
    blockedOwners,
    totalBatches: batches.length,
    mostScanned: byCode,
    sevenDays,
  }
}

export async function getCurrentAdminProfile() {
  const { data: authData } = await supabase.auth.getUser()
  const user = authData?.user
  if (!user) throw new Error("User session not found")

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  if (error) throw new Error(error.message)

  return { ...data, auth_email: user.email }
}

export async function updateCurrentAdminProfile({ fullName, email }) {
  const { data: authData } = await supabase.auth.getUser()
  const user = authData?.user
  if (!user) throw new Error("User session not found")

  if (email && email !== user.email) {
    const { error: authError } = await supabase.auth.updateUser({ email })
    if (authError) throw new Error(authError.message)
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ full_name: fullName?.trim() || null, email: email?.trim() || user.email })
    .eq("id", user.id)
    .select("*")
    .single()

  if (error) throw new Error(error.message)

  await logActivity({
    actionType: "Admin Profile Updated",
    description: "Admin profile details were updated",
    userId: user.id,
    metadata: { email: email?.trim() || user.email },
  })

  return data
}
