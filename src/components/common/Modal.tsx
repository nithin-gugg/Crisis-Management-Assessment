'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import 'plyr/dist/plyr.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoSrc: string;
}

export const IframeModal: React.FC<ModalProps> = ({ isOpen, onClose, title, videoSrc }) => {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) setLoading(true);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    let isCancelled = false;
    let player: any = null;

    // Fully isolate Plyr DOM changes from React by creating the video node manually
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    const videoEl = document.createElement('video');
    videoEl.className = 'plyr-react plyr';
    videoEl.controls = true;
    videoEl.playsInline = true;
    containerRef.current.appendChild(videoEl);

    import('plyr').then((module) => {
      if (isCancelled) return;
      // @ts-ignore
      const Plyr = module.default || module;
      
      player = new Plyr(videoEl, {
        autoplay: true,
        muted: true, // For more reliable autoplay across browsers
        controls: [
          'play-large',
          'rewind',
          'play',
          'fast-forward',
          'progress',
          'current-time',
          'mute',
          'volume',
          'fullscreen'
        ],
        seekTime: 10,
        disableContextMenu: true,
        tooltips: { controls: true, seek: true }
      });

      player.source = {
        type: 'video',
        sources: [
          {
            src: videoSrc,
            type: 'video/mp4',
          },
        ],
      };
      
      player.on('ready', () => {
        if (!isCancelled) {
          setLoading(false);
          player.play().catch((err: any) => {
            console.log("Autoplay was prevented:", err);
          });
        }
      });
    }).catch(err => {
      console.error('Failed to load plyr', err);
      if (!isCancelled) setLoading(false);
    });

    return () => {
      isCancelled = true;
      if (player) {
        try {
          player.destroy();
        } catch (e) {
          console.error("Plyr cleanup err", e);
        }
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [isOpen, videoSrc]);

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
            <div className="flex-grow relative bg-black flex flex-col justify-center overflow-hidden">
              <style>{`
                .plyr {
                  height: 100%;
                  width: 100%;
                }
                .plyr__video-wrapper {
                  height: 100%;
                }
                .plyr__video-wrapper video {
                  object-fit: contain;
                }
              `}</style>
              {loading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 text-brand-gold bg-black/50 backdrop-blur-sm">
                  <Loader2 className="animate-spin" size={48} />
                  <span className="font-medium animate-pulse tracking-widest text-xs uppercase">
                    Initializing Module...
                  </span>
                </div>
              )}
              <div
                ref={containerRef}
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
