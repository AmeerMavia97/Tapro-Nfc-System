import React from 'react'
import { useQuery } from '@tanstack/react-query'
import MiniBars from '@/components/Chart/MiniBars'
import { getActivityLogs } from '@/services/productsApi'
import { SectionPanel } from '@/components/screens/AdminDashboard/SectionPanel'

const QrStatus = ({ activePercent  , active , inactive , inactivePercent}) => {

    const { data: logs = [] } = useQuery({ queryKey: ["activity-logs"], queryFn: getActivityLogs })

    
    return (
        <div className="mt-6 flex gap-4 xl:grid-cols-[1fr]">

            <div className="w-[60%]">
                <SectionPanel title="Product Status" description="Active vs inactive code distribution." className="min-h-[440px]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-4xl font-bold tracking-[-0.04em] text-slate-950">{active + inactive}</p>
                            <p className="mt-1 text-sm text-slate-400">Total products</p>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="size-3 rounded-full bg-lime-300" />
                                <span className="font-semibold text-slate-600">Active {activePercent}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="size-3 rounded-full bg-slate-950" />
                                <span className="font-semibold text-slate-600">Inactive {inactivePercent}%</span>
                            </div>
                        </div>
                    </div>

                    <MiniBars active={active} inactive={inactive} />

                </SectionPanel>
            </div>


            <div className="w-[40%]">
                <SectionPanel title="Recent Activity" description="Latest platform updates and admin actions.">
                    <div className="space-y-3 ">
                        {logs.slice(0, 6).length === 0 ? (
                            <p className="rounded-2xl bg-[#f8fafc] p-5 text-sm text-slate-400">No activity yet.</p>
                        ) : (
                            logs.slice(0, 6).map((activity) => (
                                <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#f8fafc] p-4" key={activity.id}>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-bold text-slate-800">{activity.action_description}</p>
                                        <p className="mt-1 text-xs text-slate-400">{activity.action_type}</p>
                                    </div>
                                    <span className="shrink-0 text-xs font-semibold text-slate-400">{activity.created_at ? new Date(activity.created_at).toLocaleString() : "-"}</span>
                                </div>
                            ))
                        )}
                    </div>
                </SectionPanel>
            </div>

        </div>
    )
}

export default QrStatus
