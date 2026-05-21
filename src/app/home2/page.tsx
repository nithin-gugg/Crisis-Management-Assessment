'use client';

import React from 'react';
import { Header } from '@/components/common/Header';
import Footer from '@/components/Footer';
import { Search, PenTool, Activity, ShieldCheck, ChevronDown, Zap } from 'lucide-react';
import { WorldMap } from '@/components/ui/map';
import { StickyCapabilities } from '@/components/ui/sticky-capabilities';
import { StarsBackground } from '@/components/ui/stars';
import { TestimonialsSectionBasic } from '@/components/blocks/demo';
import { LiveMetrics } from '@/components/ui/live-metrics';
import { motion } from 'framer-motion';
import { CopilotChat } from '@/components/ui/copilot-chat';
import { useAssessment } from '@/context/AssessmentContext';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
export default function Home2() {
    const { nextStep } = useAssessment();

    return (
        <StarsBackground className="min-h-screen flex flex-col text-white font-sans">
            <Header />

            <main className="flex-1 w-full flex flex-col items-center">
                {/* HERO SECTION */}
                <section className="relative w-full pt-3 md:py-38 flex flex-col items-center justify-center overflow-hidden border-b border-white/5 bg-[#020617] z-10">
                    {/* Background Video */}
                    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-50"
                        >
                            <source src="/hero-video-bg.mp4" type="video/mp4" />
                        </video>
                        {/* Gradient overlays removed as per request */}
                    </div>

                    <div className="w-full max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-start text-left gap-6">
                        <div className="inline-block px-4 py-1.5 border border-[#1d4ed8]/50 bg-[#1d4ed8]/10 rounded-full text-xs font-semibold text-[#60a5fa] w-max uppercase tracking-wider mb-2 shadow-[0_0_15px_rgba(29,78,216,0.2)]">
                            NEXT-GENERATION PLATFORM
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight max-w-4xl drop-shadow-2xl text-white">
                            Total Business Resilience,<br />
                            <span className="text-[#E6B959] drop-shadow-md">Strategically Managed.</span>
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed drop-shadow-lg mb-2">
                            Built on globally recognized standards — ISO 22301 for Business Continuity and ISO 27001
                            for Information Security — ensuring trusted resilience and secure operations.
                        </p>

                        {/* ISO Certificates */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8 mt-2 mb-4">
                            <div className="flex items-center gap-3">
                                <Image src="/iso27001.png" alt="ISO 22301" width={48} height={48} className="object-contain" />
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-lg leading-tight">ISO 22301</span>
                                    <span className="text-gray-400 text-xs">Business Continuity Management</span>
                                </div>
                            </div>
                            <div className="hidden sm:block w-[1px] h-10 bg-gray-600/50"></div>
                            <div className="flex items-center gap-3">
                                <Image src="/iso22301.png" alt="ISO 27001" width={48} height={48} className="object-contain" />
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-lg leading-tight">ISO 27001</span>
                                    <span className="text-gray-400 text-xs">Information Security Management</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-start">
                            <Button
                                onClick={nextStep}
                                size="lg"
                                className="flex items-center justify-center gap-2 group bg-[#E6B959] hover:bg-[#d4a849] text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(230,185,89,0.3)] hover:shadow-[0_0_30px_rgba(230,185,89,0.5)]"
                            >
                                Get Your Score Now <Zap size={18} className="fill-black group-hover:animate-pulse" />
                            </Button>
                        </div>
                    </div>
                </section>

                {/* STRATEGIC RESILIENCE FRAMEWORK */}
                <section className="w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Strategic Resilience Framework</h2>
                    <p className="text-gray-400 text-center max-w-2xl mb-16">
                        A battle-tested methodology empowering organizations to turn disruption into an advantage.
                    </p>

                    <div className="w-full relative">
                        {/* Connecting Line with flowing gradient */}
                        <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-[2px] bg-gray-800/50 rounded-full overflow-hidden">
                            <motion.div
                                className="w-1/3 h-full bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                animate={{ x: ["-100%", "300%"] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
                            {[
                                { step: 1, title: 'Identify', desc: 'Understand vulnerabilities and asset criticality.', icon: <Search size={24} className="text-blue-400" /> },
                                { step: 2, title: 'Build', desc: 'Develop comprehensive continuity plans.', icon: <PenTool size={24} className="text-purple-400" /> },
                                { step: 3, title: 'Test', desc: 'Validate strategies through simulations.', icon: <Activity size={24} className="text-green-400" /> },
                                { step: 4, title: 'Sustain', desc: 'Embed resilience into culture.', icon: <ShieldCheck size={24} className="text-emerald-400" /> },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center text-center group">
                                    <div className="w-20 h-20 rounded-full bg-[#111827] border border-gray-700/80 flex items-center justify-center mb-6 shadow-xl relative transition-transform duration-300 group-hover:-translate-y-2">
                                        {item.icon}
                                        <div className="absolute -bottom-3 text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-300 border border-gray-700">0{item.step}</div>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-400 px-4">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* INTEGRATED CAPABILITIES */}
                <StickyCapabilities />

                {/* QUANTIFIABLE RESILIENCE */}
                <section className="w-full max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Quantifiable Resilience</h2>
                        <p className="text-gray-400 mb-8 max-w-md">
                            Move beyond subjective assessments. Monitor your true operational readiness with precision metrics.
                        </p>
                        <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/30">
                                <Activity size={20} className="text-blue-400" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-white">UPTIME</div>
                                <div className="text-xs text-gray-500">System reliability</div>
                            </div>
                        </div>
                        <div className="flex gap-4 items-center mt-6">
                            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center border border-green-500/30">
                                <ShieldCheck size={20} className="text-green-400" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-white">RISK</div>
                                <div className="text-xs text-gray-500">Mitigation status</div>
                            </div>
                        </div>
                    </div>

                    <LiveMetrics />
                </section>

                {/* TESTIMONIALS */}
                <TestimonialsSectionBasic />

                {/* HOW CAN I HELP */}
                <CopilotChat onStartAssessment={nextStep} />

            </main>

            <Footer />
        </StarsBackground>
    );
}
