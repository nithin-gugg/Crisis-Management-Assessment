"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Laptop, ShieldCheck, Heart, Activity, Landmark, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useAssessment } from '@/context/AssessmentContext';
import { Button } from './button';

const capabilitiesData = [
   {
      tag: "[01] RESPONSE",
      title: "Business Continuity & Workforce Resilience Response",
      description: "Emergency protocols, evacuation procedures, and shelter-in-place training aligned with Business Continuity Management frameworks, enabling teams to respond effectively during crisis situations.",
      image: (
         <div className="w-full h-full relative">
            <Image src="/thumbnails/bcc.webp" alt="Response" fill className="object-cover" />
         </div>
      )
   },
   {
      tag: "[02] DIGITAL",
      title: "Remote Work & Digital Operations",
      description: "Digital workflows and virtual leadership training designed to support business continuity planning and maintain operational stability during disruptions and crisis scenarios.",
      image: (
         <div className="w-full h-full relative">
            <Image src="/thumbnails/remote.webp" alt="Digital Operations" fill className="object-cover" />
         </div>
      )
   },
   {
      tag: "[03] SECURITY",
      title: "Safety & Security Awareness",
      description: "Comprehensive safety and cybersecurity training programs that strengthen crisis management preparedness and ensure workforce readiness against emerging threats.",
      image: (
         <div className="w-full h-full relative">
            <Image src="/thumbnails/safety.webp" alt="Security" fill className="object-cover" />
         </div>
      )
   },
   {
      tag: "[04] WELLBEING",
      title: "Mental Health & Workforce Resilience",
      description: "Stress management and resilience programs that support employees during disruptions, enhancing crisis response capability and overall business continuity readiness.",
      image: (
         <div className="w-full h-full relative">
            <Image src="/thumbnails/mental-health.webp" alt="Mental Health" fill className="object-cover" />
         </div>
      )
   },
   {
      tag: "[05] HEALTHCARE",
      title: "Healthcare & Emergency Services",
      description: "Training for surge capacity, triage procedures, and compliance aligned with Business Continuity Management to ensure effective response during emergencies and crisis situations.",
      image: (
         <div className="w-full h-full relative">
            <Image src="/thumbnails/hospital.webp" alt="Healthcare" fill className="object-cover" />
         </div>
      )
   },
   {
      tag: "[06] GOV & DEFENSE",
      title: "Government & Defense Upskilling",
      description: "Capability-building programs focused on operational readiness, supporting crisis management strategies and national-level business continuity preparedness.",
      image: (
         <div className="w-full h-full relative">
            <Image src="/thumbnails/govt.webp" alt="Gov and Defense" fill className="object-cover" />
         </div>
      )
   }
];

export function StickyCapabilities() {
   const { nextStep } = useAssessment();
   const [activeCard, setActiveCard] = useState(0);
   const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

   useEffect(() => {
      const handleScroll = () => {
         const scrollPosition = window.scrollY + window.innerHeight / 2;
         let closestCard = activeCard;
         let minDistance = Infinity;

         cardRefs.current.forEach((ref, idx) => {
            if (ref) {
               const { top, bottom } = ref.getBoundingClientRect();
               const refCenter = top + window.scrollY + (bottom - top) / 2;
               const distance = Math.abs(scrollPosition - refCenter);
               if (distance < minDistance) {
                  minDistance = distance;
                  closestCard = idx;
               }
            }
         });

         if (closestCard !== activeCard) {
            setActiveCard(closestCard);
         }
      };

      window.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
   }, [activeCard]);

   return (
      <section className="w-full max-w-7xl mx-auto px-6 py-20 border-t border-gray-800/50">
         <div className="flex flex-col md:flex-row w-full gap-10 lg:gap-20 relative">

            {/* Left Side: Scrolling Cards */}
            <div className="w-full md:w-1/2 flex flex-col pb-[10vh] md:pb-[30vh]">
               {capabilitiesData.map((card, idx) => (
                  <div
                     key={idx}
                     ref={(el) => { cardRefs.current[idx] = el; }}
                     className={`flex flex-col justify-center min-h-[70vh] md:min-h-[100vh] py-10 md:py-20 transition-opacity duration-500 ${activeCard === idx ? 'opacity-100' : 'opacity-30 md:opacity-20'}`}
                  >
                     <div className="text-blue-500 font-mono text-sm sm:text-base uppercase tracking-wider mb-4 md:mb-6">
                        {card.tag}
                     </div>
                     <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">{card.title}</h3>
                     <p className="text-gray-400 text-base sm:text-lg mb-8 md:mb-10 leading-relaxed">{card.description}</p>

                     {/* Mobile image representation */}
                     <div className="md:hidden w-full aspect-square bg-[#0b0f19] rounded-2xl border border-gray-800 overflow-hidden relative shadow-xl mb-10">
                        {card.image}
                     </div>

                     {/* Footer info (present in all cards) */}
                     <div className="mt-2 md:mt-4 pt-6 md:pt-8 border-t border-gray-800">
                        <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4 md:mb-6">Connect your data</div>
                        <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8">
                           {/* Fake icons mimicking the image */}
                           <div className="w-8 h-8 bg-[#2D8CFF] rounded-full flex items-center justify-center text-white text-xs font-bold">Z</div>
                           <div className="w-8 h-8 bg-black border border-gray-700 rounded-full flex items-center justify-center text-white text-xs font-bold">N</div>
                           <div className="w-8 h-8 bg-[#FF4F00] rounded-full flex items-center justify-center text-white text-[10px] font-bold">Zp</div>
                           <div className="w-8 h-8 bg-[#F24E1E] rounded-full flex items-center justify-center text-white text-xs font-bold">F</div>
                           <div className="w-8 h-8 bg-[#00C473] rounded-full flex items-center justify-center text-white text-[10px] font-bold">S</div>
                        </div>
                        <Button 
                           onClick={nextStep}
                           variant="brandSecondary"
                           size="sm"
                           className="flex items-center gap-2 h-auto py-2 px-4"
                        >
                           Discover all integrations <ArrowRight size={16} />
                        </Button>
                     </div>
                  </div>
               ))}
            </div>

            {/* Right Side: Sticky Image/Visualization container (Desktop Only) */}
            <div className="hidden md:flex w-full md:w-1/2 h-[calc(100vh-80px)] sticky top-20 items-center justify-center py-10">
               <div className="w-full h-full max-h-[700px] bg-[#0b0f19] rounded-2xl border border-gray-800 overflow-hidden relative shadow-2xl">
                  <AnimatePresence mode="wait">
                     <motion.div
                        key={activeCard}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="absolute inset-0"
                     >
                        {capabilitiesData[activeCard].image}
                     </motion.div>
                  </AnimatePresence>
               </div>
            </div>

         </div>
      </section>
   );
}
