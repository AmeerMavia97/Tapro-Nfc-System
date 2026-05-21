import Logout from "@/components/Layout/Logout/Logout"
import { Menu, Search } from "lucide-react"

const OwnerHeader = ({ title = "Dashboard Overview", description = "Quick view of activated products, scans, review growth, and recent activity.", onMenuClick }) => {
  return (
    <header className="border-b border-slate-100 px-5 pb-4 pt-6 sm:px-7 lg:px-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <button
            aria-label="Open menu"
            className="mt-1 flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-200 transition hover:bg-slate-800 lg:hidden"
            onClick={onMenuClick}
            type="button"
          >
            <Menu className="size-5" />
          </button>

          <div className="min-w-0">
            <p className="text-xs font-head font-semibold uppercase text-slate-400">
              Owner Workspace
            </p>
            <h1 className="mt-1 font-head text-4xl font-semibold text-slate-950 md:text-4xl">
              {title}
            </h1>
            {description && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex w-full items-center gap-5 xl:w-auto">
          <div className="flex h-11.5 w-full items-center gap-3 rounded-[1.4rem] bg-[#f3f6fb] px-5 text-slate-400 ring-1 ring-slate-100 xl:w-[390px]">
            <Search className="size-5 shrink-0" />
            <input
              className="h-full w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
              placeholder="Search owner dashboard..."
              type="search"
            />
          </div>
          <Logout />
        </div>
      </div>
    </header>
  )
}

export default OwnerHeader
