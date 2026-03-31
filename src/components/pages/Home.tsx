'use client';

import React from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { ShieldCheck, Users, Zap, Globe, Lock, Activity, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

const SOLUTIONS = [
  {
    icon: ShieldCheck,
    title: 'Business Continuity & Workforce Resilience Response',
    description:
      'Emergency protocols, evacuation procedures, shelter-in-place and resilience communication modules tailored for industry sectors.',
  },
  {
    icon: Globe,
    title: 'Remote Work & Digital Operations',
    description:
      'Digital workflows, virtual leadership and collaboration tools training ready for deployment within days.',
  },
  {
    icon: Lock,
    title: 'Safety & Security Awareness',
    description: 'Drone threat response, cybersecurity awareness and infrastructure safety training.',
  },
  {
    icon: Activity,
    title: 'Mental Health & Workforce Resilience',
    description: 'Stress management and workforce resilience psychology programs in Arabic & English.',
  },
  {
    icon: Users,
    title: 'Healthcare & Emergency Services',
    description: 'Surge capacity, triage procedures and PPE compliance training.',
  },
  {
    icon: GraduationCap,
    title: 'Government & Defense Upskilling',
    description: 'Civil defence operations and logistics capability programs.',
  },
];

const FEATURES = [
  { icon: Zap, title: 'Compliance & Workplace Training', text: 'War-risk clauses · Force-majeure · Regulatory updates' },
  { icon: Zap, title: '2–3 Week Delivery', text: 'AI-powered production · Fully operational teams' },
  { icon: Zap, title: 'White-label ready', text: 'Co-branding available · Custom LMS deployment' },
];

export const Home: React.FC = () => {
  const { nextStep } = useAssessment();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-10 md:pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-gold/5 to-transparent -z-10 blur-3xl opacity-30" />

        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-gold/10 text-brand-gold text-sm font-semibold tracking-wider uppercase mb-6 border border-brand-gold/20">
              Get Your Workforce Resilience Score
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-brand-text-primary mb-6 leading-tight max-w-4xl mx-auto">
              Business Continuity <br />
              <span className="text-brand-gold">eLearning Solutions</span> <br />
              for the GCC
            </h1>
            <p className="text-lg md:text-xl text-brand-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              Maple Learning Solutions delivers AI-powered, multilingual training programs built for organizations that
              need to act fast — Fintech, Healthcare, Manufacturing, Oil & Gas, Education, and Enterprise.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <span className="text-sm font-medium text-brand-text-muted flex items-center gap-2">
                <Globe size={16} className="text-brand-gold" /> Arabic + English
              </span>
              <span className="text-sm font-medium text-brand-text-muted flex items-center gap-2">
                <Zap size={16} className="text-brand-gold" /> Rapid rollout
              </span>
              <span className="text-sm font-medium text-brand-text-muted flex items-center gap-2">
                <ShieldCheck size={16} className="text-brand-gold" /> White-label ready
              </span>
            </div>

            <button onClick={nextStep} className="btn-primary flex items-center gap-2 group mx-auto">
              Get Started <Zap size={18} className="group-hover:animate-pulse" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-24 bg-brand-navy-light/20 relative">
        <div className="max-w-[1220px] mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Specialized Readiness Tracks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOLUTIONS.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-premium group"
              >
                <div className="h-12 w-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-4 group-hover:bg-brand-gold group-hover:text-brand-navy transition-colors">
                  <item.icon size={24} />
                </div>
                <h3 className="font-bold text-lg leading-tight mb-2 [text-wrap:balance]">{item.title}</h3>
                <p className="text-brand-text-muted text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Blocks */}
      <section className="py-24">
        <div className="max-w-[1220px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {FEATURES.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="h-14 w-14 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold mb-6">
                  <feature.icon size={28} />
                </div>
                <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                <p className="text-brand-text-secondary">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
