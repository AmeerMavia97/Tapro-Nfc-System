import { Link } from "react-router-dom"

const InvalidProduct = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-semibold">Invalid or unavailable product</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          This TAPro code is invalid, inactive, blocked, or missing a redirect destination.
        </p>
        <Link className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950" to="/">
          Go Home
        </Link>
      </div>
    </main>
  )
}

export default InvalidProduct
