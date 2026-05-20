import React from 'react'
import dashboardImage from '@/assets/DashboardImage.png'

const DashboardOverview = () => {
    return (
        <>
            <section id="dashboard" className="bg-[#f2f2f0] py-24">
                <div className="max-w-7xl mx-auto px-5 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto">
                        <p className="inline-flex rounded-full bg-[#d7ff3f] px-4 py-2 text-xs font-black">
                            Manage stands
                        </p>
                        <h2 className="mt-5 font-head font-semibold text-4xl md:text-[43px] font-black tracking-tight">
                            Ease into Productivity
                        </h2>
                        <p className="mt-4 text-[16px] text-gray-500">
                            Your business dashboard gives you one place to activate, update,
                            and manage review stand links.
                        </p>
                    </div>

                    <div className="mt-14 rounded-[2rem] bg-white p-4 md:p-0 shadow-[0_30px_100px_rgba(0,0,0,0.08)] border border-black/5">
                        <img
                            src={dashboardImage}
                            alt="TAPro dashboard preview"
                            className="w-full rounded-[1.5rem] object-cover"
                        />
                    </div>
                </div>
            </section>
        </>
    )
}

export default DashboardOverview
