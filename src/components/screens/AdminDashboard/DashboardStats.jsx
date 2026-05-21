import { CreditCard, KeyRound, TrendingUp, Users } from 'lucide-react'
import React from 'react'

const DashboardStats = ({ analytics , isLoading }) => {

    const dashboardStats = [
        { label: "Total Codes", value: analytics?.totalProducts || 0, helper: `${analytics?.totalBatches || 0} batches generated`, icon: KeyRound },
        { label: "Active Codes", value: analytics?.activeProducts || 0, helper: `${analytics?.inactiveProducts || 0} inactive codes`, icon: CreditCard },
        { label: "Total Scans", value: analytics?.totalScans || 0, helper: "From scan logs", icon: TrendingUp },
        { label: "Owners", value: analytics?.totalOwners || 0, helper: `${analytics?.blockedOwners || 0} blocked accounts`, icon: Users },
    ]


    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-4">
                {dashboardStats.map((stat) => {
                    const Icon = stat.icon

                    return (
                        <article
                            className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.055)]"
                            key={stat.label}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <span className="flex size-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-950">
                                    <Icon className="size-5" />
                                </span>
                                <p className="text-right text-3xl font-bold tracking-[-0.04em] text-slate-950">
                                    {isLoading ? "..." : stat.value}
                                </p>
                            </div>
                            <div className="mt-8">
                                <p className="text-lg font-bold text-slate-950">{stat.label}</p>
                                <p className="mt-1 text-sm text-slate-400">{stat.helper}</p>
                            </div>
                        </article>
                    )
                })}
            </div>
        </div>
    )
}

export default DashboardStats
