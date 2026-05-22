import { ShieldAlert } from "lucide-react"

const SuspendedProduct = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8fb] px-4 text-slate-950">
      <div className="w-full max-w-lg rounded-[32px] border border-red-100 bg-white p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <ShieldAlert className="size-8" />
        </div>
        <h1 className="mt-6 text-2xl font-black">Business Suspended</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          This TAPro business account is currently suspended, so the review redirect is unavailable. Please contact support or the business owner.
        </p>
      </div>
    </main>
  )
}

export default SuspendedProduct
