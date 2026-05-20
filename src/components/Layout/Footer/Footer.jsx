import React from "react";
import Logo from '@/assets/TAPro-Logo.avif'

import {
  ArrowRight,
} from "lucide-react";

const Footer = () => {
    return (
        <footer className="relative overflow-hidden px-4 pb-6 bg-[#fbfbf7] ">
            {/* background glow same as header */}
            {/* <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -left-20 bottom-10 h-[420px] w-[420px] rounded-full bg-[#eaeae8]/25 blur-[90px]" />
                <div className="absolute -right-20 bottom-0 h-[420px] w-[420px] rounded-full bg-[#eaeae8]/45 blur-[90px]" />
            </div> */}

            <div className="mx-auto max-w-[1540px]">
                <div className="rounded-[46px] border border-white/70 bg-white/55 px-8 py-10 shadow-[0_35px_100px_rgba(20,22,40,0.12)] backdrop-blur-3xl md:px-12 md:py-12">
                    <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
                        {/* Brand */}
                        <div>
                            <img
                                src={Logo}
                                alt="TAPro Cards"
                                className="h-[60px] w-auto object-contain"
                            />

                            <p className="mt-6 max-w-md text-[14.5px] leading-6 text-[#5f6272]">
                                A simple activation platform for business owners using TAPro NFC
                                and QR review stands. Activate your stand, connect your review
                                URL, and manage your business setup from one clean dashboard.
                            </p>
                           
                        </div>

                        <FooterColumn
                            title="Product"
                            links={["Dashboard", "Activation", "Review Links", "Stand Setup"]}
                        />

                        <FooterColumn
                            title="Company"
                            links={["About", "How It Works", "Customer Stories", "Contact"]}
                        />

                        <div>
                            <h4 className="text-[17px] font-head font-black text-[#101124]">
                                Get Started
                            </h4>

                            <p className="mt-5 text-[15px] leading-7 text-[#5f6272]">
                                Activate your review stand and connect your business URL in just
                                a few minutes.
                            </p>

                            <a
                                href="/dashboard"
                                className="mt-7 font-head  inline-flex h-[54px] items-center gap-3 rounded-full bg-[#09091d] px-7 text-[15px] font-semibold text-white shadow-[0_18px_40px_rgba(9,9,29,0.18)] transition hover:bg-black"
                            >
                                Open Dashboard
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d7ff3f] text-black">
                                    <ArrowRight size={15} />
                                </span>
                            </a>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col gap-4 border-t border-[#101124]/10 pt-7 text-[14px] text-[#747789] md:flex-row md:items-center md:justify-between">
                        <p>© 2026 TAPro Activate. All rights reserved.</p>

                        <div className="flex flex-wrap gap-5">
                            <a href="#" className="hover:text-[#101124]">
                                Privacy Policy
                            </a>
                            <a href="#" className="hover:text-[#101124]">
                                Terms & Conditions
                            </a>
                            <a href="#" className="hover:text-[#101124]">
                                Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>



    )
}


const FooterColumn = ({ title, links }) => {
    return (
        <div>
            <h4 className="text-[17px] font-head font-black text-[#101124]">{title}</h4>

            <ul className="mt-5 space-y-3">
                {links.map((link) => (
                    <li key={link}>
                        <a
                            href="#"
                            className="text-[14.5px] font-medium text-[#5f6272] transition hover:text-[#101124]"
                        >
                            {link}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const SocialIcon = ({ icon }) => {
    return (
        <a
            href="#"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#dfe5ef] bg-white/55 text-[#101124] shadow-sm backdrop-blur-xl transition hover:bg-[#09091d] hover:text-white"
        >
            {icon}
        </a>
    );
};


export default Footer
