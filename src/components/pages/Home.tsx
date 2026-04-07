'use client';

import React from 'react';
import Image from 'next/image';
import { useAssessment } from '@/context/AssessmentContext';
import { ShieldCheck, Users, Zap, Globe, Lock, Activity, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

const SOLUTIONS = [
  {
    icon: ShieldCheck,
    title: 'Business Continuity & Workforce Resilience Response',
    description:(
      <>  
      Emergency protocols, evacuation procedures, and shelter-in-place training aligned with <strong>Business Continuity Management</strong> frameworks, enabling teams to respond effectively during <span className='italic'>crisis situations</span>.
      </>
    ),
      
    thumbnail: '/thumbnails/bcc.webp',
  },
  {
    icon: Globe,
    title: 'Remote Work & Digital Operations',
    description:(
      <>
      Digital workflows and virtual leadership training designed to support <strong>business continuity planning</strong> and maintain operational stability during disruptions and <span className='italic'>crisis scenarios</span>.
      </>
    ),
    thumbnail: '/thumbnails/remote.webp',
  },
  {
    icon: Lock,
    title: 'Safety & Security Awareness',
    description: (
      <>  
      Comprehensive safety and cybersecurity training programs that strengthen <strong>crisis management preparedness</strong> and ensure workforce readiness against emerging threats.
      </>
    ),
    thumbnail: '/thumbnails/safety.webp',
  },
  {
    icon: Activity,
    title: 'Mental Health & Workforce Resilience',
    description:(
      <>
      Stress management and resilience programs that 
      support employees during disruptions, enhancing 
      <strong> crisis response capability</strong> and overall <span className='italic'>business continuity readiness</span>.
      </>
    ),
    thumbnail: '/thumbnails/mental-health.webp',
  },
  {
    icon: Users,
    title: 'Healthcare & Emergency Services',
     description:(
      <>
      Training for surge capacity, triage procedures, and compliance aligned with <strong>Business Continuity Management</strong> to ensure effective response during emergencies and <span className='italic'>crisis situations</span>.  
      </>
    ),
    thumbnail: '/thumbnails/hospital.webp',
  },
  {
    icon: GraduationCap,
    title: 'Government & Defense Upskilling',
    description: (
      <>  
      Capability-building programs focused on operational readiness, supporting <strong>crisis management strategies</strong> and national-level <span className='italic'>business continuity preparedness</span>.
      </>
    ),
    thumbnail: '/thumbnails/govt.webp', // Generic fallback
  },
];



export const Home: React.FC = () => {
  const { nextStep } = useAssessment();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section id="hero" className="relative pt-12 pb-24 md:pt-12 md:pb-16 overflow-hidden min-h-[65vh] flex items-center bg-brand-navy">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            // src="/hero-women.png"
            //  src="/hero-image.webp"
             src="/12074.jpg"
            //  src="/16038.jpg"
            alt="Business continuity Management"
            fill
            className="object-cover object-center opacity-60 md:opacity-100"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-navy/40 to-brand-navy/80 md:bg-gradient-to-r md:from-brand-navy/95 md:via-brand-navy/70 md:to-transparent" />
        </div>

        <div className="max-w-[1440px] px-6 md:px-12 lg:px-24 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="max-w-2xl flex flex-col items-center md:items-start text-center md:text-left"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-6 border border-brand-gold/20 backdrop-blur-sm">
              Business Continuity Framework
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-text-primary mb-6 leading-[1.1] [text-wrap:balance]">
              Business Continuity <br />
              <span className="text-brand-gold">Management Training</span> <br />
              in UAE
            </h1>
            <p className="text-base md:text-lg text-brand-text-secondary/90 mb-10 leading-relaxed max-w-xl">
              Strengthen your organization with Business Continuity Management training that prepares your workforce to handle disruptions, minimize risks, and respond effectively to crisis situations.
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 mb-12">
              <span className="text-xs font-semibold text-brand-text-secondary flex items-center gap-2 bg-brand-navy-light/60 px-3 py-2 rounded-lg backdrop-blur-md border border-white/10">
                <Globe size={14} className="text-brand-gold" /> Arabic + English
              </span>
              <span className="text-xs font-semibold text-brand-text-secondary flex items-center gap-2 bg-brand-navy-light/60 px-3 py-2 rounded-lg backdrop-blur-md border border-white/10">
                <Zap size={14} className="text-brand-gold" /> Rapid rollout
              </span>
              <span className="text-xs font-semibold text-brand-text-secondary flex items-center gap-2 bg-brand-navy-light/60 px-3 py-2 rounded-lg backdrop-blur-md border border-white/10">
                <ShieldCheck size={14} className="text-brand-gold" /> White-label ready
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button 
                onClick={nextStep} 
                className="btn-primary flex items-center gap-2 group w-full sm:w-auto justify-center text-sm md:text-base py-3 px-8 whitespace-nowrap"
              >
                Get Your Score Now <Zap size={18} className="group-hover:animate-pulse" />
              </button>
              <button 
                onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })} 
                className="btn-secondary w-full sm:w-auto justify-center text-sm md:text-base py-3 px-8 whitespace-nowrap"
              >
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Risk Metrics Section */}
      <section className="py-20">
        <div className="max-w-[1220px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
                Resilience Through <br className="hidden md:block" /> Intelligent Preparedness
              </h2>
              <p className="text-lg text-brand-text-muted leading-relaxed max-w-xl">
                In the GCC’s hyper-connected economy, resilience is no longer reactive—it is 
                engineered through <strong className="text-brand-gold">Business Continuity Management</strong>. The GCC BCP platform enables 
                organizations to anticipate disruptions, strengthen continuity frameworks, 
                and ensure operational stability at scale while enhancing <span className="italic">crisis preparedness</span>
              </p>
            </motion.div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-[#f8faff] p-8 md:p-10 border-l-4 shadow-sm rounded-xl"
              >
                <div className="h-12 w-12 text-red-600 mb-6 bg-red-50 flex items-center justify-center rounded-lg">
                  <Activity size={28} />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3">Operational Continuity, Assured</h3>
                <p className="text-black leading-relaxed text-sm md:text-base">
                 Minimize downtime with AI-driven <strong>Business Continuity Management</strong> 
                 and real-time response frameworks designed to handle disruptions and 
                 support effective <span className="italic">crisis response</span>.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-[#f8faff] p-8 md:p-10 border-l-4 shadow-sm rounded-xl"
              >
                <div className="h-12 w-12 text-brand-gold mb-6 bg-amber-50 flex items-center justify-center rounded-lg">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3">Proactive Risk Intelligence</h3>
                <p className="text-black leading-relaxed text-sm md:text-base">
                  Detect risks early with predictive insights and 
                  adaptive learning that strengthen <strong>business continuity planning</strong> 
                  and improve <span className="italic">crisis management readiness</span>.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section id="solutions" className="py-24 bg-brand-navy-light/20 relative">
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
                className="card-premium group !p-0 overflow-hidden flex flex-col"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-brand-navy-light">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-brand-navy/30 group-hover:bg-brand-navy/10 transition-colors duration-300" />
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="h-10 w-10 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-4 group-hover:bg-brand-gold group-hover:text-brand-navy transition-colors shrink-0">
                    <item.icon size={20} />
                  </div>
                  <h3 className="font-bold text-lg leading-tight mb-2 [text-wrap:balance] group-hover:text-brand-gold transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-brand-text-muted text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex justify-center"
          >
            <button 
              onClick={nextStep} 
              className="btn-primary flex items-center gap-2 group w-full sm:w-auto justify-center text-sm md:text-base py-3 px-8 whitespace-nowrap"
            >
              Get Your Score Now <Zap size={18} className="group-hover:animate-pulse" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Feature Blocks */}
      {/* Vulnerability Insight Section */}
      <section className="py-24 bg-brand-navy relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-[1220px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: Visuals */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                <Image
                  src="/3stepss.jpg"
                  alt="Modern Building Vulnerability"
                  fill
                  className="object-cover grayscale brightness-75 transition-all duration-700 hover:scale-105 hover:grayscale-0 hover:brightness-100"
                />
                
                {/* 84% Floating Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="absolute bottom-6 right-6 md:bottom-10 md:right-10 bg-brand-navy/60 backdrop-blur-xl border border-brand-gold/20 p-6 md:p-8 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-[240px]"
                >
                  <div className="text-4xl md:text-5xl font-black text-brand-gold mb-2 tracking-tighter">
                    84%
                  </div>
                  <div className="text-[10px] md:text-[11px] font-bold text-white/60 uppercase tracking-[0.2em] leading-tight">
                   Faster Compliance & Training Delivery
                  </div>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-brand-gold/10 rounded-full blur-2xl -z-10" />
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column: Content */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-3xl md:text-3xl lg:text-4xl font-extrabold text-white mb-8 leading-[1.05]">
                AI-Powered Training & <br />
                <span className="text-brand-gold italic">Compliance Delivery</span>
              </h2>

              <div className="space-y-12">
                {/* Item 01 */}
                <div className="flex gap-6 group">
                  <div className="text-2xl font-black text-brand-gold/40 group-hover:text-brand-gold transition-colors duration-300 tabular-nums">
                    01
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Compliance & Workplace Training</h3>
                    <p className="text-brand-text-secondary leading-relaxed text-base md:text-lg opacity-80 group-hover:opacity-100 transition-opacity">
                      War-risk clauses, force majeure, and regulatory updates integrated with  <strong className="text-brand-gold"> Business Continuity Management </strong> frameworks to ensure organizations remain compliant and prepared for <span className="italic"> crisis situations.</span>
                    </p>
                  </div>
                </div>

                {/* Item 02 */}
                <div className="flex gap-6 group">
                  <div className="text-2xl font-black text-brand-gold/40 group-hover:text-brand-gold transition-colors duration-300 tabular-nums">
                    02
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">2–3 Week Delivery</h3>
                    <p className="text-brand-text-secondary leading-relaxed text-base md:text-lg opacity-80 group-hover:opacity-100 transition-opacity">
                      AI-powered production and fully operational teams delivering rapid deployment of <strong className="text-brand-gold">business continuity and crisis management training</strong> programs for immediate <span className="italic"> workforce readiness.</span>
                    </p>
                  </div>
                </div>

                  <div className="flex gap-6 group">
                  <div className="text-2xl font-black text-brand-gold/40 group-hover:text-brand-gold transition-colors duration-300 tabular-nums">
                    03
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">White-label ready</h3>
                    <p className="text-brand-text-secondary leading-relaxed text-base md:text-lg opacity-80 group-hover:opacity-100 transition-opacity">
                     Co-branding and custom LMS deployment designed to support <strong className="text-brand-gold">Business Continuity Management training</strong> and scalable <span  className="italic">crisis preparedness </span>programs across organizations.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-brand-navy border-t border-white/5 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-[1220px] mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
              Strengthen Your Business Continuity Today
            </h2>
            <p className="text-lg md:text-xl text-brand-text-secondary max-w-2xl mb-12 leading-relaxed opacity-90">
              Evaluate your resilience, identify gaps, and take control with structured <strong className="text-brand-gold">Business Continuity Management</strong> strategies designed for <span className="italic"> crisis readiness.</span>
            </p>

            <button 
                onClick={nextStep} 
                className="btn-primary flex items-center gap-2 group w-full sm:w-auto justify-center text-sm md:text-base py-3 px-8 whitespace-nowrap"
              >
                Get Your Score Now <Zap size={18} className="group-hover:animate-pulse" />
              </button>

            <div className="mt-16 pt-8 border-t border-white/10 w-full max-w-md">
              <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-white/40 uppercase">
                Takes less than 12 minutes • Your responses remain strictly confidential
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
