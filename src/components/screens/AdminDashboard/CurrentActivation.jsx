import { SectionPanel } from '@/components/screens/AdminDashboard/SectionPanel'
import React from 'react'

const CurrentActivation = ({ activePercent , inactive , analytics  }) => {
    return (
        <div className="mt-7">
            <SectionPanel title="Integration Health" description="Current activation distribution and platform readiness.">
                <div className="grid gap-5 sm:grid-cols-3">
                    {[
                        { label: "Activation Rate", value: `${activePercent}%`, helper: "active products" },
                        { label: "Pending Codes", value: inactive, helper: "waiting activation" },
                        { label: "Blocked Owners", value: analytics?.blockedOwners || 0, helper: "restricted accounts" },
                    ].map((item) => (
                        <div className="rounded-[1.4rem] bg-[#f8fafc] p-5" key={item.label}>
                            <p className="text-sm font-semibold text-slate-400">{item.label}</p>
                            <p className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950">{item.value}</p>
                            <p className="mt-1 text-xs text-slate-400">{item.helper}</p>
                        </div>
                    ))}
                </div>
            </SectionPanel>
        </div>
    )
}

export default CurrentActivation
