import { NavLink } from "react-router-dom"
import Logo from "@/assets/TAPro-Logo.avif"
import { ownerTabs } from "@/screens/OwnerDashboard/ownerDashboardShared"

const OwnerSidebar = () => {
  return (
    <aside className="hidden w-[250px] shrink-0 p-0 lg:block">
      <div className="sticky top-6 flex h-[calc(100vh-48px)] flex-col">
        <div className="flex items-center gap-3 px-3 py-3">
          <NavLink to={'/'}>
            <img className="h-11 sm:w-24 sm:h-11.5" src={Logo} alt="" />
          </NavLink>
        </div>

        <div className="mt-5">
          <nav className="space-y-1.5">
            {ownerTabs.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  className={({ isActive }) =>
                    `group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive
                      ? "bg-slate-950 text-white shadow-xl shadow-slate-300/60"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                    }`
                  }
                  end={item.path === "/owner-dashboard"}
                  key={item.path}
                  to={item.path}
                >
                  <Icon className="size-4.5" />
                  <span>{item.label || item.title}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>
      </div>
    </aside>
  )
}

export default OwnerSidebar
