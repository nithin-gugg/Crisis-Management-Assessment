'use client';

import React, { useState } from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Loader2, Award } from 'lucide-react';

export const ScoreCheckForm: React.FC = () => {
  const { setUserData, submitAssessment, nextStep, userData } = useAssessment();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Please enter your email address to see your score.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      // 1. Update user data with email
      setUserData({ email });
      
      // 2. Submit assessment
      await submitAssessment(email);
      
      // 3. Move to results
      nextStep();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-8">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="card-premium !rounded-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-brand-gold/10 text-brand-gold mb-3">
              <Award size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Assessment Complete!</h2>
            <p className="text-brand-text-secondary text-sm">
              Great job, <span className="text-brand-gold font-bold">{userData?.name || 'there'}</span>! Your Resilience score is ready. Enter your email to view your personalized report.
            </p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold flex items-center gap-2 ml-1">
                <Mail size={14} className="text-brand-gold" /> Business Email Address
              </label>
              <input
                required
                type="email"
                placeholder="john@organization.com"
                className="w-full h-12 bg-brand-navy border border-brand-gold/20 rounded-xl px-4 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all placeholder:text-brand-text-muted text-brand-text-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full btn-primary mt-6 mb-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Analyzing Results...
                </>
              ) : (
                <>
                  Check My Score <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[10px] text-brand-text-muted mt-4">
            We will send a detailed PDF report of your assessment to this email.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
