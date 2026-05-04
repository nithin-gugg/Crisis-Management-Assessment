'use client';

import React from 'react';
import { Header } from '@/components/common/Header';
import Footer from '@/components/Footer';
import { Search, PenTool, Activity, ShieldCheck, MapPin, Zap, ClipboardList, ChevronDown, Mic, Send } from 'lucide-react';
import Image from 'next/image';
import { WorldMap } from '@/components/ui/map';
import { StickyCapabilities } from '@/components/ui/sticky-capabilities';
import { StarsBackground } from '@/components/ui/stars';
import { TestimonialsSectionBasic } from '@/components/blocks/demo';
import { LiveMetrics } from '@/components/ui/live-metrics';
import { motion } from 'framer-motion';
import { CopilotChat } from '@/components/ui/copilot-chat';

export default function Home2() {
    return (
        <StarsBackground className="min-h-screen flex flex-col text-white font-sans">
            <Header />

            <main className="flex-1 w-full flex flex-col items-center">
                {/* HERO SECTION */}
                <section className="w-full max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 flex flex-col gap-6 relative z-10">
                        <div className="inline-block px-3 py-1 border border-blue-500/30 bg-blue-500/10 rounded-full text-xs font-medium text-blue-400 w-max uppercase tracking-wider mb-2">
                            Next-Generation Platform
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight">
                            Total Business<br />
                            Resilience,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b4db] to-[#0083b0]">Strategically</span><br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8e2de2] to-[#4a00e0]">Managed.</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed">
                            The ultimate command center for modern enterprises. Anticipate, prepare, and manage disruptions before they become crises.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mt-4">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                                INITIATE PLATFORM
                            </button>
                            <button className="bg-transparent border border-gray-600 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded transition-all flex items-center justify-center gap-2">
                                VIEW CAPABILITIES <ChevronDown size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 relative w-full h-[400px] lg:h-[500px]">
                        {/* Mockup visualization since we don't have the exact image */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a233a] to-[#0f172a] border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden flex flex-col">
                            <div className="h-8 border-b border-gray-700/50 flex items-center px-4 gap-2 bg-[#1e293b]/50">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col gap-6">
                                <div className="flex gap-4">
                                    <div className="flex-1 bg-black/30 rounded-lg border border-gray-700/50 p-4">
                                        <div className="text-sm text-gray-400">Current Risk</div>
                                        <div className="text-2xl font-bold text-green-400">0.024 <span className="text-sm font-normal text-gray-500">avg</span></div>
                                    </div>
                                    <div className="flex-1 bg-black/30 rounded-lg border border-gray-700/50 p-4">
                                        <div className="text-sm text-gray-400">Active Incidents</div>
                                        <div className="text-2xl font-bold text-white">1,402 <span className="text-sm font-normal text-gray-500">tracked</span></div>
                                    </div>
                                </div>
                                <div className="flex-1 bg-black/30 rounded-lg border border-gray-700/50 relative overflow-hidden flex items-center justify-center p-0 md:p-0">
                                    <WorldMap
                                        dots={[
                                            // USA internal
                                            {
                                                start: { lat: 64.2008, lng: -149.4937, label: "Alaska" },
                                                end: { lat: 34.0522, lng: -118.2437, label: "Los Angeles" }
                                            },

                                            // USA → India
                                            {
                                                start: { lat: 38.9072, lng: -77.0369, label: "USA" },
                                                end: { lat: 28.6139, lng: 77.2090, label: "India" }
                                            },

                                            // USA → Brazil
                                            {
                                                start: { lat: 64.2008, lng: -149.4937, label: "Alaska" },
                                                end: { lat: -15.7975, lng: -47.8919, label: "Brazil" }
                                            },

                                            // Brazil → Portugal
                                            {
                                                start: { lat: -15.7975, lng: -47.8919, label: "Brazil" },
                                                end: { lat: 38.7223, lng: -9.1393, label: "Portugal" }
                                            },

                                            // UAE → India
                                            {
                                                start: { lat: 25.276987, lng: 55.296249, label: "UAE" },
                                                end: { lat: 28.6139, lng: 77.2090, label: "India" }
                                            },

                                            // UK → India
                                            {
                                                start: { lat: 51.5074, lng: -0.1278, label: "UK" },
                                                end: { lat: 28.6139, lng: 77.2090, label: "India" }
                                            },

                                            // India → Russia
                                            {
                                                start: { lat: 28.6139, lng: 77.2090, label: "India" },
                                                end: { lat: 43.1332, lng: 131.9113, label: "Russia" }
                                            }
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Glow effect behind the dashboard */}
                        <div className="absolute -inset-4 bg-blue-500/20 blur-[60px] -z-10 rounded-full"></div>
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
                <CopilotChat />

            </main>

            <Footer />
        </StarsBackground>
    );
}
