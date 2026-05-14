import { supabase } from "@/configuration/Supabase/supabaseClient"

const PUBLIC_URL_BASE = (import.meta.env.VITE_PUBLIC_URL_BASE || "https://go.taprocard.com").replace(/\/$/, "")

const makeUniqueCode = () => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""

  for (let index = 0; index < 8; index += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)]
  }

  return code
}

const makeRows = ({ batchName, batchId, quantity, redirectUrl }) => {
  return Array.from({ length: Number(quantity) }).map(() => {
    const uniqueCode = makeUniqueCode()
    const publicUrl = `${PUBLIC_URL_BASE}/${uniqueCode}`

    return {
      batch_id: batchId,
      batch_name: batchName.trim(),
      unique_code: uniqueCode,
      permanent_url: publicUrl,
      redirect_url: redirectUrl?.trim() || null,
      activated: false,
      owner_id: null,
    }
  })
}

export const getPermanentUrl = (uniqueCode, permanentUrl) => {
  return permanentUrl || `${PUBLIC_URL_BASE}/${uniqueCode}`
}

export async function generateProducts({ batchName, quantity, }) {
  const cleanBatchName = batchName.trim()
  const total = Number(quantity)

  if (!cleanBatchName) throw new Error("Batch name is required")
  if (!Number.isInteger(total) || total < 1) throw new Error("Quantity must be greater than 0")
  if (total > 1000) throw new Error("Maximum 1000 URLs can be generated at once")

  const { data: batch, error: batchError } = await supabase
    .from("product_batches")
    .insert({ name: cleanBatchName, quantity: total })
    .select("id,name,quantity,created_at")
    .single()

  if (batchError) throw new Error(batchError.message)

  const rows = makeRows({
    batchId: batch.id,
    batchName: cleanBatchName,
    quantity: total,
  })

  const { data, error } = await supabase
    .from("products")
    .insert(rows)
    .select("*")

  if (error) throw new Error(error.message)

  return data || []
}

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("id,unique_code,permanent_url,batch_name,owner_id,activated,activation_time,redirect_url,created_at")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)

  return data || []
}

export async function getProductBatches() {
  const { data, error } = await supabase
    .from("product_batches")
    .select("id,name,quantity,created_at")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)

  return data || []
}

export async function updateProductRedirect({ id, redirectUrl }) {
  const { data, error } = await supabase
    .from("products")
    .update({ redirect_url: redirectUrl?.trim() || null })
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw new Error(error.message)

  return data
}

export async function getScanLogs() {
  const { data, error } = await supabase
    .from("scan_logs")
    .select("id,scanned_code,timestamp,device_type,location,activation_state,redirect_result")
    .order("timestamp", { ascending: false })
    .limit(100)

  if (error) throw new Error(error.message)

  return data || []
}
