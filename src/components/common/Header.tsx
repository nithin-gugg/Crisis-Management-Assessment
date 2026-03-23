'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Zap, MessageSquare } from 'lucide-react';
import { useAssessment } from '@/context/AssessmentContext';

export const Header: React.FC = () => {
  const { currentStep, nextStep, isComplete } = useAssessment();

  // Hide header during the assessment questions
  if (currentStep > 0 && !isComplete) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-navy/80 backdrop-blur-md border-b border-brand-gold/10">
      <div className="max-w-[1220px] mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="h-14 w-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="Maple Learning Logo"
              width={160}
              height={56}
              className="h-full w-auto object-contain"
              priority
            />
          </div>
        </div>

        <nav className="flex items-center gap-6">
          {currentStep === 0 ? (
            <button onClick={nextStep} className="btn-primary flex items-center gap-2 group text-sm py-2 px-4 shadow-none">
               Get Started <Zap size={16} className="group-hover:animate-pulse" />
            </button>
          ) : isComplete ? (
            <Link 
              href="https://www.maplelearningsolutions.com/ar/elearning-solutions-in-uae#cta-ae" 
              target="_blank"
              className="btn-primary flex items-center gap-2 text-sm py-2 px-4 shadow-none"
            >
              Contact Us <MessageSquare size={16} />
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
};
