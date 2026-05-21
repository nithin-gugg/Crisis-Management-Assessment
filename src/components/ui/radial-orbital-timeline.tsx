"use client";

import { useEffect, useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
  imageUrl?: string;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const cards = useMemo(() => timelineData.slice(0, 5), [timelineData]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!cards.length) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [cards.length]);

  const activeItem = cards[activeIndex];

  const getNodePosition = (index: number) => {
    const total = cards.length;

    // Active node always comes to the top
    const relativeIndex = (index - activeIndex + total) % total;
    const angle = -90 + relativeIndex * (360 / total);

    const radius = 270;
    const radian = (angle * Math.PI) / 180;

    return {
      x: radius * Math.cos(radian),
      y: radius * Math.sin(radian),
    };
  };

  if (!cards.length) return null;

  return (
    <div className="w-full h-full min-h-[400px] bg-transparent flex items-center justify-center overflow-hidden">
      <div className="relative w-[780px] h-[780px] flex items-center justify-center scale-50 sm:scale-[0.6] lg:scale-[0.55] xl:scale-[0.65] 2xl:scale-75 origin-center">
        {/* Orbit Circle */}
        <div className="absolute w-[590px] h-[590px] rounded-full border border-white/10" />

        {/* BCP ISO 27001 Stamp / Logo */}
        <div className="absolute z-10 w-[118px] h-[118px] rounded-full bg-white text-black flex flex-col items-center justify-center shadow-[0_0_35px_rgba(255,255,255,0.35)]">
          <ShieldCheck className="w-9 h-9 mb-1" />
          <span className="text-[16px] font-extrabold leading-none">
            BCP
          </span>
          <span className="text-[10px] font-bold tracking-wide">
            ISO 27001
          </span>
        </div>

        {/* Orbit Nodes */}
        {cards.map((item, index) => {
          const Icon = item.icon;
          const position = getNodePosition(index);
          const isActive = index === activeIndex;

          return (
            <div
              key={item.id}
              className="absolute transition-all duration-1000 ease-in-out"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
              }}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-14 h-14 rounded-full flex items-center justify-center border
                    transition-all duration-700
                    ${isActive
                      ? "bg-white text-black scale-125 border-white shadow-[0_0_30px_rgba(255,255,255,0.55)]"
                      : "bg-white/10 text-white/45 border-white/20 scale-100"
                    }
                  `}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <span
                  className={`
                    mt-4 text-lg font-bold text-center transition-all duration-700 whitespace-nowrap
                    ${isActive ? "text-white" : "text-white/40"}
                  `}
                >
                  {item.title}
                </span>
              </div>
            </div>
          );
        })}

        {/* Active Image Card */}
        <div
          key={activeItem.id}
          className="absolute z-20 transition-all duration-700 ease-in-out animate-fadeIn"
        >
          <div
            className="
              relative w-[320px] h-[440px] rounded-2xl overflow-hidden
              bg-[#04120c] border-2 border-emerald-500
              shadow-[0_0_35px_rgba(16,185,129,0.55)]
            "
          >
            {/* Line from active top node */}
            <div className="absolute -top-[78px] left-1/2 -translate-x-1/2 w-px h-[78px] bg-white/25 z-30" />

            {/* Card Image */}
            <div className="relative h-[295px] w-full overflow-hidden">
              {activeItem.imageUrl ? (
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-slate-800 via-slate-900 to-black" />
              )}

              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-[#04120c]" />
            </div>

            {/* Icon Circle */}
            <div className="absolute left-1/2 top-[255px] -translate-x-1/2">
              <div className="w-[80px] h-[80px] rounded-full bg-emerald-500/20 border-4 border-emerald-400 flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.8)]">
                <div className="w-[56px] h-[56px] rounded-full bg-emerald-500 flex items-center justify-center">
                  {(() => {
                    const Icon = activeItem.icon;
                    return <Icon className="w-8 h-8 text-white" />;
                  })()}
                </div>
              </div>
            </div>

            {/* Card Title */}
            <div className="absolute bottom-0 left-0 right-0 h-[145px] flex items-end justify-center px-6 pb-8">
              <h3 className="text-white text-center text-2xl font-bold leading-tight">
                {activeItem.title}
              </h3>
            </div>

            <div className="absolute inset-0 rounded-2xl border border-emerald-300/50 pointer-events-none" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.7s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
