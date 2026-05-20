import React from "react";
import { ArrowUpRight, Smile, Users, CreditCard, Wallet, Clock } from "lucide-react";

const IntegrationToolsCard = () => {
    return (
        <div className="relative w-full max-w-[430px] mx-auto">
            {/* Background soft shapes */}
            <div className="absolute -top-8 -right-6 w-32 h-32 rounded-[32px] border border-black/5 bg-white/40" />
            <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-[32px] border border-black/5 bg-white/40" />

            {/* Main container */}
            <div className="relative min-h-[520px] rounded-[34px] bg-[#f4f4f2] border border-black/[0.04] shadow-[0_35px_90px_rgba(0,0,0,0.08)] px-8 pt-8 pb-10 overflow-hidden">
                {/* Top card */}

                <IntegrationTopBox></IntegrationTopBox>

                {/* Decorative middle outline */}
                <div className="absolute left-[62px] top-[170px] w-[250px] h-[230px] rounded-[30px] border border-black/[0.05]" />
                <div className="absolute right-[44px] top-[235px] w-[150px] h-[150px] rounded-[26px] border border-black/[0.05]" />

                {/* Floating cards */}
                <MiniMetric
                    className="left-[84px] top-[214px] bg-[#050505] text-white"
                    icon={<Smile size={16} />}
                    title="11,500+"
                    subtitle="Businesses Setup"
                    dark
                />

                <MiniMetric
                    className="right-[54px] top-[285px] bg-white text-[#111111]"
                    icon={<Users size={15} />}
                    title="75-80%"
                    subtitle="Tap-to-Review Rate"
                />

                <MiniMetric
                    className="left-[86px] top-[355px] bg-white text-[#111111]"
                    icon={<CreditCard size={15} />}
                    title="$0"
                    subtitle="Monthly Fees"
                />

                <MiniMetric
                    className="right-[58px] bottom-[44px] bg-white text-[#111111]"
                    icon={<Clock  size={15} />}
                    title="3 sec"
                    subtitle="Review Page Opens"
                />
            </div>
        </div>
    );
};

const MiniMetric = ({ className, icon, title, subtitle, dark }) => {
    return (
        <div
            className={`absolute z-20 flex items-center gap-3 rounded-xl px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.14)] ${className}`}
        >
            <span
                className={`flex h-8 w-8 items-center justify-center rounded-full ${dark ? "bg-[#d7ff3f] text-black" : "bg-[#f4f4f4] text-[#111111]"
                    }`}
            >
                {icon}
            </span>

            <span>
                <strong className="block font-head text-[15px] font-black leading-none">
                    {title}
                </strong>
                <small
                    className={`mt-1 block text-[10px] font-medium ${dark ? "text-white/55" : "text-[#9a9a9a]"
                        }`}
                >
                    {subtitle}
                </small>
            </span>
        </div>
    );
};



const IntegrationTopBox = () => {
    return (
        <div className="w-full max-w-[430px] z-40 relative">
            <div className="relative h-[156px] rounded-[22px] bg-white shadow-[0_22px_60px_rgba(0,0,0,0.08)] border border-[#f1f1f1] overflow-hidden">
                {/* Left Content */}
                <div className="absolute left-[26px] top-[38px] z-10">
                    <h4 className="text-[14px] font-head leading-none font-semibold text-[#121212]">
                        Review Stand Activation
                    </h4>

                    <p className="mt-[14px] text-[10px] leading-none font-medium text-[#9b9b9b]">
                        Setup Time :
                    </p>

                    <div className="mt-[10px] flex items-center gap-[7px]">
                        <h2 className="text-[30px] font-head leading-[30px] font-black tracking-[-1.5px] text-[#050505]">
                            60 sec
                        </h2>

                        <span className="inline-flex h-[18px] items-center gap-[4px] rounded-full bg-[#f0f0eb] px-[7px] text-[9px] font-bold text-[#171717]">
                            <span className="h-[5px] w-[5px] rounded-full bg-[#1b1b1b]" />
                            Live
                        </span>
                    </div>

                    <p className="mt-[10px] text-[10px] leading-none font-medium text-[#9b9b9b]">
                        to activate
                    </p>
                </div>

                {/* Gauge */}
                <div className="absolute right-[21px] top-[30px] h-[112px] w-[190px]">
                    <svg
                        width="190"
                        height="112"
                        viewBox="0 0 190 112"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute inset-0"
                    >
                        {/* Light full arc */}
                        <path
                            d="M34 96C34 62.8629 60.8629 36 94 36C127.137 36 154 62.8629 154 96"
                            stroke="#F3F3F1"
                            strokeWidth="25"
                            strokeLinecap="butt"
                        />

                        {/* Dark active arc */}
                        <path
                            d="M34 96C34 62.8629 60.8629 36 94 36C112.2 36 128.5 44.1 139.5 56.9"
                            stroke="#A4A4A4"
                            strokeWidth="25"
                            strokeLinecap="butt"
                        />

                        {/* Inner soft shadow arc */}
                        <path
                            d="M58 96C58 76.1177 74.1177 60 94 60C113.882 60 130 76.1177 130 96"
                            stroke="#FAFAFA"
                            strokeWidth="18"
                            strokeLinecap="butt"
                        />
                    </svg>

                    {/* Pointer */}
                    <div className="absolute left-[84px] top-[69px] h-[32px] w-[32px]">
                        <div
                            className="h-full w-full bg-[#050505]"
                            style={{
                                clipPath:
                                    "polygon(48% 0%, 82% 77%, 52% 64%, 18% 77%)",
                                transform: "rotate(42deg)",
                                borderRadius: "8px",
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};


export default IntegrationToolsCard;





