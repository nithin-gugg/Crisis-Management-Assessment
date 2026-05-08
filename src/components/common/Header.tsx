'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Zap, MessageSquare } from 'lucide-react';
import { useAssessment } from '@/context/AssessmentContext';
import { Button } from '@/components/ui/button';

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
          <div className="h-[45px] md:h-14 w-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
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
            <Button 
                onClick={nextStep} 
                variant="brandPrimary" 
                size="sm" 
                className="flex items-center gap-2 group shadow-none"
            >
               Get Your Score Now <Zap size={16} className="group-hover:animate-pulse" />
            </Button>
          ) : isComplete ? (
            <Button 
              variant="brandPrimary" 
              size="sm" 
              className="flex items-center gap-2 shadow-none"
              asChild
            >
              <Link 
                href="https://www.maplelearningsolutions.com/elearning-solutions-in-uae#cta-ae" 
                target="_blank"
              >
                Contact Us <MessageSquare size={16} />
              </Link>
            </Button>
          ) : null}
        </nav>
      </div>
    </header>
  );
};
