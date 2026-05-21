import { Link, NavLink } from "react-router-dom"
import Logo from '@/assets/TAPro-Logo.avif'
import { getDashboardPath } from "@/services/authApi"
import Logout from "@/components/Layout/Logout/Logout"
import { ArrowRight, LayoutDashboard } from "lucide-react"
import { useAuthUser } from "@/components/hooks/useAuthUser"


const Navbar = () => {

    const { data = {}, isLoading } = useAuthUser()
    const user = data?.user;
    const profile = data?.profile;
    const isAuthenticated = !!user;

    // EXTRACT USER DATA TO SHOW 
    const userEmail = user?.email ?? ""
    const avatarLabel = userEmail ? userEmail.charAt(0).toUpperCase() : "U"
    const dashboardPath = getDashboardPath(profile)



    return (

        <header className="fixed left-0 top-5 z-50 w-full">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
                <div className="flex h-20 items-center justify-between rounded-full border border-white/70 bg-white/55 px-5 shadow-[0_20px_80px_rgba(16,17,36,0.10)] backdrop-blur-2xl md:px-7">

                    <div>
                        <NavLink to={'/'}>
                            <img className="h-11 sm:w-24 sm:h-11.5" src={Logo} alt="" />
                        </NavLink>
                    </div>


                    <div className="flex items-center gap-2">

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to={dashboardPath}
                                    className="inline-flex items-center gap-2 rounded-full bg-[#101124] p-3 sm:px-5 sm:py-3 text-sm font-semibold text-white shadow-lg shadow-[#101124]/15 transition hover:bg-black"
                                >
                                    <LayoutDashboard className="size-4" />
                                    <span className="hidden sm:inline"> Dashboard </span>
                                </Link>

                                <span
                                    className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700"
                                    title={userEmail}
                                >
                                    {avatarLabel}
                                </span>
                                <Logout />
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                >
                                    <button className="hidden rounded-full border border-[#101124]/10 bg-white/70 px-6 py-2.5 text-sm font-bold text-[#101124] shadow-sm backdrop-blur-xl transition hover:bg-white sm:inline-flex">
                                        Login
                                    </button>
                                </Link>
                                <Link
                                    to="/register">
                                    <button className="inline-flex items-center gap-2 rounded-full bg-[#101124] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#101124]/15 transition hover:bg-black">
                                        Sign Up
                                        <ArrowRight size={16} />
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>

    )
}

export default Navbar
