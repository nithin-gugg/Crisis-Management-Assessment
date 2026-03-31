'use client';

import React, { useState } from 'react';
import { PrivacyModal } from './PrivacyModal';

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export const ConsentCheckbox: React.FC<ConsentCheckboxProps> = ({ 
  checked, 
  onChange,
  label = "I consent to the privacy policy"
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (checked) {
      onChange(false);
    } else {
      setModalOpen(true);
    }
  };

  const handleAgree = () => {
    onChange(true);
    setModalOpen(false);
  };

  return (
    <>
      <label className="flex items-start gap-3 cursor-pointer group w-fit">
        <div className="relative flex items-center justify-center mt-0.5 shrink-0">
          <input
            type="checkbox"
            required
            className="peer appearance-none w-5 h-5 border-2 border-brand-gold/30 rounded bg-brand-navy checked:bg-brand-gold checked:border-brand-gold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-gold outline-none"
            checked={checked}
            onChange={() => {}} // React requirements for controlled components without direct handler
            onClick={handleInputClick}
            aria-label={label}
          />
          <div className="absolute text-brand-navy opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
        <span 
          className="text-sm text-brand-text-secondary group-hover:text-brand-text-primary transition-colors leading-tight"
          onClick={(e) => {
            e.preventDefault();
            if (checked) onChange(false);
            else setModalOpen(true);
          }}
        >
          {label}
        </span>
      </label>

      {/* Portal-based modal injected dynamically */}
      <PrivacyModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onAgree={handleAgree} 
      />
    </>
  );
};
