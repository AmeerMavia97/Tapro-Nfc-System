import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"

import { useQueryClient } from "@tanstack/react-query"
import ConfirmationModal from "@/components/Modal/ConfirmationModal"
import { AUTH_USER_QUERY_KEY } from "@/components/hooks/useAuthUser"
import { logoutUser } from "@/services/authApi"

const Logout = ({
    className = "",
    iconClassName = "size-4",
    title = "Logout",
    buttonText,
    showIcon = true,
    variant = "icon",
}) => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {
        try {
            setLoading(true)

            await logoutUser()

            queryClient.setQueryData(AUTH_USER_QUERY_KEY, null)

            localStorage.removeItem("token")
            sessionStorage.clear()

            navigate("/login?logout=success", {
                replace: true,
            })
        } catch (error) {
            console.error("Logout failed", error)
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <button
                className={
                    className ||
                    "flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                }
                onClick={() => setOpen(true)}
                title={title}
                type="button"
            >
                {showIcon && <LogOut className={iconClassName} />}

                {buttonText && (
                    <span className={showIcon ? "ml-2" : ""}>
                        {buttonText}
                    </span>
                )}
            </button>

            <ConfirmationModal
                open={open}
                onOpenChange={setOpen}
                title="Logout Confirmation"
                description="Are you sure you want to logout from your account?"
                confirmText="Yes, Logout"
                cancelText="Cancel"
                loading={loading}
                onConfirm={handleLogout}
            />
        </>
    )
}

export default Logout