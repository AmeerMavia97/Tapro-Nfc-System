import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import ThemeToggle from "@/components/ui/ThemeToggle"
import { AUTH_USER_QUERY_KEY, useAuthUser } from "@/components/hooks/useAuthUser"
import { getDashboardPath, logoutUser } from "@/services/authApi"
import { LayoutDashboard, LockKeyhole, LogOut } from "lucide-react"
import Logout from "@/components/Layout/Logout/Logout"


const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { data = {}, isLoading } = useAuthUser()
    const user = data?.user;
    const profile = data?.profile;
    const isAuthenticated = !!user;

    // EXTRACT USER DATA TO SHOW 
    const userEmail = user?.email ?? ""
    const avatarLabel = userEmail ? userEmail.charAt(0).toUpperCase() : "U"
    const dashboardPath = getDashboardPath(profile)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleLogout = async () => {
        await logoutUser()
        queryClient.setQueryData(AUTH_USER_QUERY_KEY, null)
        navigate("/login", { replace: true })
    }

    return (
        <nav className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between rounded-xl border border-slate-200 bg-white/90 px-4 shadow-sm shadow-slate-200/70 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-black/20 sm:px-6">
                    <Link to="/" className="flex items-center gap-3 text-slate-950 dark:text-white">
                        <span className="flex size-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                            <LockKeyhole className="size-4" />
                        </span>
                        <span className="text-lg font-semibold tracking-normal font-head">TapRoCard</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to={dashboardPath}
                                    className="hidden h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 sm:inline-flex"
                                >
                                    <LayoutDashboard className="size-4" />
                                    Dashboard
                                </Link>
                                <span
                                    className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700"
                                    title={userEmail}
                                >
                                    {avatarLabel}
                                </span>
                               <Logout/>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 "
                            >
                                Sign in
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
