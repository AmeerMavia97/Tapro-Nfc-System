import React from 'react'

export const StatusPill = ({ status }) => {
    const styles = {
        Active: "bg-lime-100 text-lime-800",
        active: "bg-lime-100 text-lime-800",
        Inactive: "bg-slate-100 text-slate-700",
        inactive: "bg-slate-100 text-slate-700",
        Paused: "bg-amber-100 text-amber-800",
        Suspended: "bg-red-100 text-red-700",
        blocked: "bg-red-100 text-red-700",
        Completed: "bg-lime-100 text-lime-800",
        "In Production": "bg-blue-100 text-blue-800",
        "Quality Check": "bg-amber-100 text-amber-800",
    }

    return <span className={`rounded-full px-3 py-1 text-xs font-bold ${styles[status] || styles.Inactive}`}>{status}</span>
}
