import { LayoutDashboard, LockKeyhole, LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import ThemeToggle from "@/components/ui/ThemeToggle"
import { useAuth } from "@/context/useAuth"
import { logoutUser } from "@/services/authApi"

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)
    const { isAuthenticated, user } = useAuth()
    const userEmail = user?.email ?? ""
    const avatarLabel = userEmail ? userEmail.charAt(0).toUpperCase() : "U"

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleLogout = async () => {
        await logoutUser()
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
                                    to="/owner-dashboard"
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
                                <button
                                    className="flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                                    onClick={handleLogout}
                                    title="Logout"
                                    type="button"
                                >
                                    <LogOut className="size-4" />
                                </button>
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
