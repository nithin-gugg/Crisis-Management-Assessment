'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { getRecommendations } from '@/lib/recommendations';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  AlertCircle,
  Play,
  Download,
  MessageSquare,
  RefreshCcw,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { IframeModal } from '@/components/common/Modal';
import Footer from '@/components/Footer';

export const Results: React.FC = () => {
  const { userData, getResults, resetAssessment, submissionStatus, submitAssessment } = useAssessment();
  const results = useMemo(() => getResults(), [getResults]);
  const recommendations = useMemo(() => getRecommendations(results.weakSections), [results.weakSections]);
  const [activeModule, setActiveModule] = useState<{ title: string; src: string } | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const hasSubmittedRef = useRef(false);

  // Trigger API submission once when Results page mounts.
  // useRef guard ensures exactly one call even in React Strict Mode (which
  // intentionally mounts components twice in development).
  useEffect(() => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;
    submitAssessment();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  const getReadinessConfig = (level: string) => {
    switch (level) {
      case 'High':
        return { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'Resilient' };
      case 'Moderate':
        return {
          color: 'text-brand-gold',
          bg: 'bg-brand-gold/10',
          border: 'border-brand-gold/20',
          text: 'Developing',
        };
      default:
        return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'Vulnerable' };
    }
  };

  const config = getReadinessConfig(results.level);

  const handleDownloadReport = async () => {
    if (!userData) return;
    setDownloadLoading(true);
    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          score: results.totalScore,
          level: results.level,
          weakAreas: results.weakSections,
          recommendations: recommendations.map((r) => ({ title: r.title, description: r.description })),
        }),
      });
      if (!res.ok) throw new Error('Failed to generate PDF');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Crisis_Readiness_Report_${userData.name.replace(/\s+/g, '_')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download error:', err);
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Submission status banner */}
        {submissionStatus === 'loading' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 px-5 py-3 rounded-xl bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-sm font-medium"
          >
            <Loader2 size={16} className="animate-spin shrink-0" />
            Generating your report and sending it to {userData?.email}...
          </motion.div>
        )}
        {submissionStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 px-5 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium"
          >
            <CheckCircle2 size={16} className="shrink-0" />
            Report sent to {userData?.email} — check your inbox for the PDF!
          </motion.div>
        )}
        {submissionStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium"
          >
            <AlertTriangle size={16} className="shrink-0" />
            Could not send the email report. You can still download it manually below.
          </motion.div>
        )}

        {/* Hero */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`inline-flex items-center justify-center p-4 rounded-3xl ${config.bg} ${config.color} mb-6`}
          >
            <TrendingUp size={48} />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Your Crisis Readiness: <span className={config.color}>{results.level}</span>
          </h2>
          <p className="text-brand-text-secondary text-lg">
            Based on your responses, your organization is currently{' '}
            <span className="font-bold">{config.text}</span>.
          </p>
        </div>

        {/* Score + Weak Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="card-premium lg:col-span-1 flex flex-col items-center justify-center text-center p-10">
            <span className="text-brand-text-muted text-xs font-bold uppercase tracking-widest mb-2">Total Score</span>
            <div className="text-7xl font-black text-brand-gold mb-2">{results.totalScore}</div>
            <span className="text-brand-text-muted">out of 30 points</span>
            <div className="w-full h-1 bg-brand-navy mt-8 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(results.totalScore / 30) * 100}%` }}
                className={`h-full ${config.color.replace('text', 'bg')}`}
              />
            </div>
          </div>

          <div className="card-premium lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="text-brand-gold" />
              <h3 className="text-xl font-bold">Key Areas to Improve</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {results.weakSections.length > 0 ? (
                results.weakSections.map((section: string) => (
                  <div
                    key={section}
                    className="px-5 py-3 rounded-xl bg-brand-navy border border-red-500/20 text-red-100 font-medium flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    {section}
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 font-medium w-full text-center">
                  Outstanding performance! No critical weak areas identified.
                </div>
              )}
            </div>
            <p className="mt-8 text-brand-text-muted text-sm italic">
              * Sections marked with improvement needs scored 0 or 1 on at least one critical indicator.
            </p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">Recommended Training Modules</h3>
            <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">Expert-curated for you</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-premium flex flex-col group cursor-pointer"
                onClick={() => setActiveModule(rec)}
              >
                <div className="flex-grow">
                  <div className="h-12 w-12 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-6 group-hover:bg-brand-gold group-hover:text-brand-navy transition-colors">
                    <Play size={20} fill="currentColor" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 leading-tight group-hover:text-brand-gold transition-colors [text-wrap:balance]">
                    {rec.title}
                  </h4>
                  <p className="text-brand-text-muted text-sm leading-relaxed">{rec.description}</p>
                </div>
                <button className="mt-8 flex items-center gap-2 text-brand-gold font-bold text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                  Start Module <ExternalLink size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Next Steps CTA */}
        <div className="bg-brand-navy-light/40 border border-brand-gold/10 rounded-3xl p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">Maximize Your Crisis Readiness</h3>
          <p className="text-brand-text-secondary max-w-2xl mx-auto mb-10">
            Download your detailed report or speak with our GCC crisis management experts for a customized training
            roadmap.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <button
              onClick={handleDownloadReport}
              disabled={downloadLoading}
              className="btn-secondary flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {downloadLoading ? <Loader2 size={18} className="animate-spin" /> : <Download size={20} />}
              Download Report
            </button>
            <button
              className="btn-primary flex items-center justify-center gap-2"
              onClick={() => window.open('https://www.maplelearningsolutions.com/contact', '_blank')}
            >
              <MessageSquare size={20} /> Book Consultation
            </button>
            <button
              onClick={resetAssessment}
              className="p-4 rounded-xl border border-brand-text-muted/20 text-brand-text-muted hover:text-brand-text-primary hover:border-brand-text-primary transition-all flex items-center justify-center gap-2"
            >
              <RefreshCcw size={18} /> Retake Assessment
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-brand-gold/5 flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex items-center gap-3 text-left">
              <div className="p-3 rounded-full bg-brand-gold/10 text-brand-gold">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="font-bold text-sm">Get Customized Training Plan</p>
                <p className="text-xs text-brand-text-muted">Tailored for your specific industry</p>
              </div>
            </div>
            <div className="hidden md:block w-px h-8 bg-brand-gold/10" />
            <a 
              href="https://www.maplelearningsolutions.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="p-3 rounded-full bg-brand-gold/10 text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-navy transition-colors">
                <MessageSquare size={24} />
              </div>
              <div>
                <p className="font-bold text-sm group-hover:text-brand-gold transition-colors">Talk to an Expert</p>
                <p className="text-xs text-brand-text-muted">24/7 strategic response support</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      <IframeModal
        isOpen={!!activeModule}
        onClose={() => setActiveModule(null)}
        title={activeModule?.title || ''}
        iframeSrc={activeModule?.src || ''}
      />

      <Footer />
    </div>
  );
};
