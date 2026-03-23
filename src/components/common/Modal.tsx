'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  iframeSrc: string;
}

export const IframeModal: React.FC<ModalProps> = ({ isOpen, onClose, title, iframeSrc }) => {
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (isOpen) setLoading(true);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-navy/95 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full h-full md:max-w-6xl md:h-[85vh] bg-brand-navy border border-brand-gold/30 rounded-none md:rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-4 md:p-6 border-b border-brand-gold/10 flex items-center justify-between">
              <h3 className="text-xl font-bold truncate pr-10">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-brand-gold/10 rounded-full transition-colors text-brand-gold"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-grow relative bg-black">
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-brand-gold">
                  <Loader2 className="animate-spin" size={48} />
                  <span className="font-medium animate-pulse tracking-widest text-xs uppercase">
                    Initializing Module...
                  </span>
                </div>
              )}
              <iframe
                src={iframeSrc}
                title={title}
                onLoad={() => setLoading(false)}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
