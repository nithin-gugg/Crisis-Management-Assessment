"use client";

import React from 'react';
import Image from 'next/image';

const capabilitiesData = [
   {
      title: "Business Continuity & Workforce Resilience Response",
      description: "Emergency response and continuity training that helps teams act effectively during disruptions.",
      imageSrc: "/thumbnails/bcc.webp"
   },
   {
      title: "Remote Work & Digital Operations",
      description: "Digital workflow and virtual leadership training to maintain stability during disruptions.",
      imageSrc: "/thumbnails/remote.webp"
   },
   {
      title: "Safety & Security Awareness",
      description: "Safety and cybersecurity programs that strengthen workforce preparedness and resilience.",
      imageSrc: "/thumbnails/safety.webp"
   },
   {
      title: "Mental Health & Workforce Resilience",
      description: "Resilience and wellbeing programs that support employees during high-pressure situations.",
      imageSrc: "/thumbnails/mental-health.webp"
   },
   {
      title: "Healthcare & Emergency Services",
      description: "Emergency response and compliance training for healthcare continuity and preparedness.",
      imageSrc: "/thumbnails/hospital.webp"
   },
   {
      title: "Government & Defense Upskilling",
      description: "Operational readiness programs designed for crisis management and continuity planning.",
      imageSrc: "/thumbnails/govt.webp"
   }
];

export function StickyCapabilities() {
   return (
      <section className="w-full max-w-7xl mx-auto px-6 py-20 border-t border-gray-800/50">
         <div className="mb-12 max-w-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 leading-tight text-[#d4f870]">
               Business Resilience Solutions
            </h2>
            <p className="text-gray-300 text-lg">
               Building operational resilience through training, preparedness, and continuity programs.
            </p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {capabilitiesData.map((card, idx) => (
               <div key={idx} className="flex flex-col sm:flex-row bg-[#1c1f26] border border-gray-700/60 hover:border-gray-500 transition-colors duration-300 overflow-hidden group min-h-[320px]">
                  <div className="w-full sm:w-1/2 p-6 flex flex-col justify-center">
                     <h3 className="text-lg font-bold mb-2 text-white tracking-wide">{card.title}</h3>
                     <p className="text-sm text-gray-300 leading-relaxed">
                        {card.description}
                     </p>
                  </div>
                  <div className="w-full sm:w-1/2 relative min-h-[220px] sm:min-h-full overflow-hidden">
                     <Image
                        src={card.imageSrc}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        alt={card.title}
                     />
                  </div>
               </div>
            ))}
         </div>
      </section>
   );
}
