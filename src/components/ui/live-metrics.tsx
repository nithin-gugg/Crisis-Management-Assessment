"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronDown, Zap } from "lucide-react";

export function LiveMetrics() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);

    const chartData = [
        { day: 'Mon', val: 40, label: '40% Health' },
        { day: 'Tue', val: 60, label: '60% Health' },
        { day: 'Wed', val: 45, label: '45% Health' },
        { day: 'Thu', val: 55, label: '55% Health' },
        { day: 'Fri', val: 80, label: '80% Health' },
        { day: 'Sat', val: 50, label: '50% Health' },
        { day: 'Sun', val: 65, label: '65% Health' },
        { day: 'Mon', val: 100, label: '100% Health' },
        { day: 'Tue', val: 70, label: '70% Health' },
        { day: 'Wed', val: 55, label: '55% Health' },
    ];

    return (
        <div ref={containerRef} className="flex-1 w-full flex flex-col gap-4">
            <div className="flex gap-4">
                {/* Uptime Card */}
                <div className="flex-1 bg-[#111827] border border-gray-700/80 rounded-xl p-6 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Uptime</span>
                        <span className="text-blue-400 text-xs flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded-full">
                            <span>Status Normal</span>
                            <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                        </span>
                    </div>
                    <div className="text-4xl font-bold mb-2 text-white">
                        {isInView ? <CountUp end={85} suffix="%" /> : "0%"}
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden mt-4">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: isInView ? "85%" : 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-blue-500 rounded-full"
                        />
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500/10 blur-xl rounded-full"></div>
                </div>

                {/* Risk Mitigation Card */}
                <div className="flex-1 bg-[#111827] border border-gray-700/80 rounded-xl p-6 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Risk Mitigation</span>
                        <span className="text-green-400 text-xs flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-full">
                            <Zap size={14} className="group-hover:scale-110 transition-transform" />
                            <span>Active</span>
                        </span>
                    </div>
                    <div className="text-4xl font-bold mb-2 text-white">
                         {isInView ? <CountUp end={2.4} decimals={1} suffix="m" /> : "0m"}
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden mt-4">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: isInView ? "60%" : 0 }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                            className="h-full bg-green-500 rounded-full"
                        />
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-green-500/10 blur-xl rounded-full"></div>
                </div>
            </div>

            {/* Core Health Chart */}
            <div className="bg-[#111827] border border-gray-700/80 rounded-xl p-6 relative">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Last 10 Days</div>
                        <div className="font-semibold text-lg text-white">Continuous Core Health</div>
                    </div>
                    <div className="flex gap-2">
                        {/* Interactive Toggle */}
                        <div className="text-xs text-white px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm cursor-pointer transition">Global</div>
                        <div className="text-xs text-gray-400 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-md border border-gray-700 cursor-pointer transition">Local</div>
                    </div>
                </div>

                <div className="h-32 flex items-end justify-between gap-2 px-2 relative">
                    {chartData.map((data, i) => (
                        <div 
                            key={i} 
                            className="w-full flex flex-col justify-end items-center h-full group relative"
                            onMouseEnter={() => setHoveredBar(i)}
                            onMouseLeave={() => setHoveredBar(null)}
                        >
                            {hoveredBar === i && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute -top-10 bg-gray-800 text-white text-xs py-1.5 px-2.5 rounded-md whitespace-nowrap z-10 border border-gray-700 shadow-xl"
                                >
                                    {data.label}
                                </motion.div>
                            )}
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: isInView ? `${data.val}%` : 0 }}
                                transition={{ duration: 1, ease: "easeOut", delay: i * 0.05 + 0.5 }}
                                className={`w-full rounded-t-sm transition-colors duration-300 ${
                                    hoveredBar === i 
                                        ? 'bg-blue-400 cursor-pointer' 
                                        : (i === 7 || i === 4 ? 'bg-blue-500' : 'bg-[#1e293b]')
                                }`} 
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-between px-2 mt-3">
                    {chartData.map((data, i) => (
                        <span key={i} className="text-[10px] text-gray-500 w-full text-center font-medium">{data.day}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Simple CountUp component for numerical animation
function CountUp({ end, suffix = "", decimals = 0 }: { end: number, suffix?: string, decimals?: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        const duration = 1500; // 1.5s
        
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            // easeOutQuart
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            
            setCount(easeProgress * end);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }, [end]);

    return <span>{count.toFixed(decimals)}{suffix}</span>;
}
