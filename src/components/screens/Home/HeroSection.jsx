import IntegrationToolsCard from '@/components/screens/Home/IntegrationToolsCard'
import { ArrowRight, Zap } from 'lucide-react'
import React from 'react'

const HeroSection = () => {
    return (
        <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-40 lg:px-8 lg:pb-28 lg:pt-48">
            <div className="grid items-center gap-14 lg:grid-cols-2">

                <div className="md:ml-4">
                    <p className="inline-flex items-center gap-2 text-xs font-bold mb-5">
                        <span className="w-7 h-7 rounded-full bg-[#d7ff3f] flex items-center font-para justify-center">
                            <Zap size={15} />
                        </span>
                        Connecting business owners
                    </p>

                    <h1 className="text-5xl md:text-6xl lg:text-[68px] font-black leading-[1.1] tracking-tight">
                        Activate Your Review Stand with TAPro
                    </h1>

                    <p className="mt-7 text-[16.5px] text-gray-500 max-w-xl leading-relaxed">
                        Create your business account, add your Google review link, and
                        connect your NFC or QR stand so customers can leave reviews with
                        one quick tap or scan.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-7 py-4 font-head text-white text-[16px] font-semibold hover:bg-[#161616]">
                            Get Started Free
                            <span className="w-6 h-6 rounded-full bg-[#d7ff3f] text-black flex items-center justify-center">
                                <ArrowRight size={14} />
                            </span>
                        </button>

                        <button className="inline-flex bg-white items-center justify-center gap-2 rounded-full px-7 py-4 font-semibold font-head hover:bg-white">
                            Learn more
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="mt-10 grid grid-cols-3 max-w-lg gap-8 border-t border-black/10 pt-6">
                        <Stat title="500+" desc="Trusted by owners" />
                        <Stat title="5M" desc="Saved setup hours" />
                        <Stat title="90%" desc="User satisfaction" />
                    </div>
                </div>

                <IntegrationToolsCard></IntegrationToolsCard>

            </div>
        </section>
    )
}

const Stat = ({ title, desc }) => (
  <div>
    <h4 className="text-2xl font-head font-black">{title}</h4>
    <p className="text-xs text-gray-500 mt-1">{desc}</p>
  </div>
);


export default HeroSection
