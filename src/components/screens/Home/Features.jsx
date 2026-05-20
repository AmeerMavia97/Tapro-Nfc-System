import { ArrowRight, Building2, Link2, QrCode, ScanLine, Settings, ShieldCheck } from 'lucide-react';
import React from 'react'

const Features = () => {
    return (
        <>

            {/* Features */}
            <section id="features" className="py-20">
                <div className="mx-auto max-w-7xl px-5 lg:px-8">
                    <div className="mb-12  items-center flex flex-col gap-4 ">
                        <span className="inline-flex rounded-full border border-white/75 bg-white/55 px-4 py-2 text-sm font-bold text-[#56596c] shadow-sm backdrop-blur-xl">
                            Dashboard Features
                        </span>

                        <h2 className="mt-5 text-[32px] font-head font-black tracking-tight text-[#101124] md:text-[43px] leading-[1.1]">
                            Manage Your Review Stand From One Place
                        </h2>

                        <p className="text-[16.5px] leading-relaxed text-[#606375]">
                            Your dashboard gives you full control over your stand setup,
                            connected review links, and business details.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <FeatureCard
                            icon={<ScanLine />}
                            title="Stand Activation"
                            text="Activate your NFC or QR review stand with your business account."
                            active
                        />

                        <FeatureCard
                            icon={<Link2 />}
                            title="Review Link Management"
                            text="Update your Google review URL, Yelp link, Trustpilot link, or custom URL anytime."
                        />

                        <FeatureCard
                            icon={<Building2 />}
                            title="Multiple Stand Setup"
                            text="Manage one stand or multiple stands for different counters, branches, or locations."
                        />

                        <FeatureCard
                            icon={<ShieldCheck />}
                            title="Secure Access"
                            text="Only logged-in business owners can manage their stand settings."
                        />

                        <FeatureCard
                            icon={<Settings />}
                            title="Easy Updates"
                            text="Changed your review page? Update your stand destination in seconds."
                        />

                        <FeatureCard
                            icon={<QrCode />}
                            title="NFC and QR Ready"
                            text="Works perfectly for both tap to review and scan to review customer flows."
                        />
                    </div>
                </div>
            </section>

        </>
    )
}

const FeatureCard = ({ icon, title, text, active }) => (
    <div
        className={`rounded-[1.7rem] border p-7 pb-8 backdrop-blur-2xl transition-all hover:-translate-y-1 ${active
            ? "border-[#101124]/10 bg-[#101124] text-white shadow-[0_25px_90px_rgba(16,17,36,0.18)]"
            : "border-white/75 bg-white/55 text-[#101124] shadow-[0_20px_70px_rgba(16,17,36,0.08)] hover:bg-white/75"
            }`}
    >
        <div
            className={`mb-7 flex h-12 w-12 items-center justify-center rounded-2xl ${active ? "bg-[#d8ff63] text-[#101124]" : "bg-[#eff2ea] text-[#101124]"
                }`}
        >
            {React.cloneElement(icon, { size: 22 })}
        </div>

        <h3 className="text-[22px] font-head font-black font-semibold">{title}</h3>

        <p
            className={`mt-3 leading-relaxed ${active ? "text-white/68" : "text-[#606375]"
                }`}
        >
            {text}
        </p>

        {/* <button
            className={`mt-6 inline-flex font-head items-center gap-2 text-sm font-black ${active ? "text-[#d8ff63]" : "text-[#101124]"
                }`}
        >
            Learn more <ArrowRight size={15} />
        </button> */}
    </div>
);

export default Features
