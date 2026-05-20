import React from "react";
import Navbar from "@/components/Layout/Navbar/Navbar";
import Footer from "@/components/Layout/Footer/Footer";
import Features from "@/components/screens/Home/Features";
import HeroSection from "@/components/screens/Home/HeroSection";
import CustomerReview from "@/components/screens/Home/CustomerReview";
import DashboardOverview from "@/components/screens/Home/DashboardOverview";

const Home = () => {

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#f8faf6] text-[#101124]">
            <Navbar></Navbar>
            {/* Soft Light Background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-40 left-0 h-[520px] w-[520px] rounded-full bg-[#d8ff63]/45 blur-[90px]" />
                <div className="absolute -top-32 right-0 h-[520px] w-[520px] rounded-full bg-[#bfa7ff]/35 blur-[90px]" />
                <div className="absolute left-1/2 top-[520px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#9ee8ff]/30 blur-[100px]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.75),rgba(248,250,246,0.92))]" />
            </div>

            <div className="relative z-10">

                <HeroSection></HeroSection>

                <Features></Features>

                <DashboardOverview></DashboardOverview>

                <CustomerReview></CustomerReview>
            </div>

            <Footer></Footer>
        </main>
    );
};


export default Home;