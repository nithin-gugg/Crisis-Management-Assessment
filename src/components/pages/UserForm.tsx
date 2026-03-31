'use client';

import React, { useState } from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { motion } from 'framer-motion';
import { User, Mail, Phone, ArrowRight, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';

export const UserForm: React.FC = () => {
  const { setUserData, nextStep, prevStep } = useAssessment();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentNDA, setConsentNDA] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !consentPrivacy || !consentNDA) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400)); // brief UX delay
    setUserData(formData);
    setLoading(false);
    nextStep();
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-8">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="card-premium !rounded-2xl">
          <div className="text-center mb-8 relative">
            <button 
              type="button" 
              onClick={prevStep}
              className="absolute left-0 top-0 p-2 text-brand-text-muted hover:text-brand-gold transition-colors"
              title="Back to Home"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-brand-gold/10 text-brand-gold mb-3">
              <ShieldCheck size={28} />
            </div>
            <h2 className="text-xl font-bold mb-1">Get Your Readiness Score</h2>
            <p className="text-brand-text-secondary text-xs">Please provide your details to begin the assessment.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold flex items-center gap-2 ml-1">
                <User size={14} className="text-brand-gold" /> Full Name
              </label>
              <input
                required
                type="text"
                placeholder="John Doe"
                className="w-full h-12 bg-brand-navy border border-brand-gold/20 rounded-xl px-4 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all placeholder:text-brand-text-muted text-brand-text-primary"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold flex items-center gap-2 ml-1">
                <Mail size={14} className="text-brand-gold" /> Email Address
              </label>
              <input
                required
                type="email"
                placeholder="john@organization.com"
                className="w-full h-12 bg-brand-navy border border-brand-gold/20 rounded-xl px-4 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all placeholder:text-brand-text-muted text-brand-text-primary"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold flex items-center gap-2 ml-1">
                <Phone size={14} className="text-brand-gold" /> Phone Number
              </label>
              <input
                required
                type="tel"
                placeholder="+971 -- --- ----"
                className="w-full h-12 bg-brand-navy border border-brand-gold/20 rounded-xl px-4 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all placeholder:text-brand-text-muted text-brand-text-primary"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    required
                    className="peer appearance-none w-5 h-5 border-2 border-brand-gold/30 rounded bg-brand-navy checked:bg-brand-gold checked:border-brand-gold transition-all cursor-pointer"
                    checked={consentPrivacy}
                    onChange={(e) => setConsentPrivacy(e.target.checked)}
                  />
                  <div className="absolute text-brand-navy opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>
                <span className="text-sm text-brand-text-secondary group-hover:text-brand-text-primary transition-colors leading-tight">
                  I consent to privacy policy of the details
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    required
                    className="peer appearance-none w-5 h-5 border-2 border-brand-gold/30 rounded bg-brand-navy checked:bg-brand-gold checked:border-brand-gold transition-all cursor-pointer"
                    checked={consentNDA}
                    onChange={(e) => setConsentNDA(e.target.checked)}
                  />
                  <div className="absolute text-brand-navy opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>
                <span className="text-sm text-brand-text-secondary group-hover:text-brand-text-primary transition-colors leading-tight">
                  I agree to the Non-Disclosure Agreement (NDA)
                </span>
              </label>
            </div>

            <button
              disabled={loading || !consentPrivacy || !consentNDA}
              type="submit"
              className="w-full btn-primary mt-6 mb-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  Start Assessment <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[10px] text-brand-text-muted mt-4">
            Security & Privacy: Your data is handled according to GCC compliance standards.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
