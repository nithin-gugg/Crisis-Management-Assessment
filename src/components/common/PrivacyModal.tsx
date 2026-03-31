'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose, onAgree }) => {
  const [scrollReachedBottom, setScrollReachedBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setScrollReachedBottom(false);
      
      // Auto-focus the modal when opened for accessibility
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Verify immediately if content fits without scrolling
      setTimeout(checkScroll, 150);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'auto';
      };
    }
  }, [isOpen, onClose]);

  const checkScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      // 10px buffer for precision differences in some browsers
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setScrollReachedBottom(true);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-navy/80 backdrop-blur-sm"
          />
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-2xl max-h-[85vh] bg-brand-navy border border-brand-gold/30 rounded-2xl flex flex-col shadow-2xl focus:outline-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-modal-title"
          >
            <div className="flex items-center justify-between p-5 border-b border-brand-gold/10 shrink-0">
              <h2 id="privacy-modal-title" className="text-xl font-bold text-white">Privacy Consent</h2>
              <button
                onClick={onClose}
                className="p-2 text-brand-text-muted hover:text-brand-gold transition-colors rounded-full hover:bg-brand-gold/10"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div 
              ref={contentRef} 
              onScroll={checkScroll}
              className="p-6 overflow-y-auto flex-grow text-[15px] leading-relaxed text-brand-text-secondary [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-brand-gold/40 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-brand-gold/60 [scrollbar-width:thin]"
            >
              <h3 className="text-lg font-bold text-brand-gold mb-4 uppercase">ASSESSMENT PRIVACY & CONFIDENTIALITY</h3>
              <p className="mb-6 text-white">Your assessment data is important to us, and so is protecting your privacy.</p>
              
              <div className="space-y-6">
                <div>
                  <p><span className="font-semibold text-brand-gold">✓ CONFIDENTIAL:</span> Your assessment results are confidential to your organization.<br/>We never share them with anyone without your written permission.</p>
                </div>
                <div>
                  <p><span className="font-semibold text-brand-gold">✓ SECURE:</span> Your data is stored on encrypted, SOC 2 compliant servers with<br/>access controls, encryption, and audit logging. Only authorized personnel<br/>can access it.</p>
                </div>
                <div>
                  <p><span className="font-semibold text-brand-gold">✓ MINIMAL:</span> We only collect information necessary for the assessment. We don't<br/>require names of employees, specific financial data, or other unnecessary details.</p>
                </div>
                <div>
                  <p><span className="font-semibold text-brand-gold">✓ YOUR CONTROL:</span> You own your assessment data. You can access it, correct it,<br/>or request deletion anytime.</p>
                </div>
                <div>
                  <p><span className="font-semibold text-brand-gold">✓ LIMITED USE:</span> We use your data only to:<br/>(1) Provide your assessment results<br/>(2) Improve our assessment tool<br/>We never use it for marketing or any other purpose.</p>
                </div>
                <div>
                  <p><span className="font-semibold text-brand-gold">✓ COMPLIANCE:</span> We comply with GDPR, state privacy laws, and other applicable<br/>regulations.</p>
                </div>
                <div>
                  <p><span className="font-semibold text-brand-gold">✓ PROTECTED:</span> All assessment data is transmitted via HTTPS encryption and stored<br/>with AES-256 encryption.</p>
                </div>
                <div>
                  <p><span className="font-semibold text-brand-gold">✓ LEGAL:</span> We've signed a Confidentiality Agreement protecting your data.</p>
                </div>
              </div>
              
              <div className="mt-8 pt-4 border-t border-brand-gold/10">
                <p>
                  For questions contact: <a href="mailto:info@maplelearningsolutions.com" className="text-brand-gold hover:underline">info@maplelearningsolutions.com</a>
                </p>
                <p className="mt-4 text-white font-medium">
                  By completing this assessment, you agree to these practices.
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-brand-gold/10 flex flex-col items-center shrink-0">
              <button
                disabled={!scrollReachedBottom}
                onClick={onAgree}
                className="w-auto px-8 py-3 btn-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-center whitespace-nowrap"
              >
                {scrollReachedBottom ? 'I Agree' : 'Please read to the end to agree'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
