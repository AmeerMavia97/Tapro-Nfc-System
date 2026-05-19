import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const ConfirmationModal = ({
    open,
    onOpenChange,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    loading = false,
    children,
}) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className={' py-5'}>
                <AlertDialogHeader >
                    <AlertDialogTitle className={"font-head text-[21px]"}>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>

                {children}

                <AlertDialogFooter className={'border-[#e5e5e6]'}>
                    <AlertDialogCancel className={'cursor-pointer hover:bg-black hover:text-white  px-5 py-5 '} disabled={loading}>
                        {cancelText}
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={loading}
                        className={'bg-black !border-black text-white cursor-pointer hover:bg-white hover:border-[1px] hover:text-black px-5 py-5 '}
                        onClick={(e) => {
                            e.preventDefault()
                            onConfirm?.()
                        }}
                    >
                        {loading ? "Loading..." : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ConfirmationModal