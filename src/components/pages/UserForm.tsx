'use client';

import React, { useState } from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { motion } from 'framer-motion';
import { User, Mail, Phone, ArrowRight, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import { ConsentCheckbox } from '@/components/common/ConsentCheckbox';
import ReCAPTCHA from 'react-google-recaptcha';

export const UserForm: React.FC = () => {
  const { setUserData, nextStep, prevStep } = useAssessment();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company_website: '' });
  const [loading, setLoading] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name || !formData.email || !formData.phone || !consentPrivacy) {
      setFormError("Please fill out all required fields and accept the agreements.");
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (!captchaToken) {
      setFormError("Please verify that you are not a robot.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 400)); // brief UX delay

    // Store data into tracking context encompassing security tokens
    setUserData({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company_website: formData.company_website, // honeypot
      captchaToken
    });

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

          {formError && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center">
              {formError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input 
               type="text" 
               name="company_website" 
               className="hidden" 
               aria-hidden="true" 
               tabIndex={-1} 
               autoComplete="off" 
               value={formData.company_website} 
               onChange={(e) => setFormData({...formData, company_website: e.target.value})} 
            />
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

            <div className="pt-2">
              <ConsentCheckbox 
                checked={consentPrivacy} 
                onChange={setConsentPrivacy} 
                label="By submitting, you agree to our Privacy Policy and acknowledge our data handling practices." 
              />
            </div>

            <div className="pt-2">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                onChange={(token) => setCaptchaToken(token)}
                onErrored={() => setFormError("Security verification encountered an error. Please try again.")}
                theme="dark"
              />
            </div>

            <button
              disabled={loading || !consentPrivacy || !captchaToken}
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
