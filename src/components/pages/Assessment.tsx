'use client';

import React, { useMemo } from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { QUESTIONS, SCORING } from '@/lib/questions';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Activity } from 'lucide-react';

export const Assessment: React.FC = () => {
  const { currentStep, nextStep, prevStep, setAnswer, answers } = useAssessment();

  // currentStep 2–16 correspond to questions 1–15
  const questionIndex = currentStep - 2;
  const question = QUESTIONS[questionIndex];

  const progressPercent = ((questionIndex + 1) / QUESTIONS.length) * 100;

  // Section transition logic
  const SECTIONS = ['Leadership', 'Communication', 'Operations', 'Workforce', 'Training'];
  const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V'];
  const currentSectionIndex = Math.floor(questionIndex / 3);
  const isLastInSection = (questionIndex + 1) % 3 === 0;
  const isLastQuestion = questionIndex === QUESTIONS.length - 1;
  const nextSection = SECTIONS[currentSectionIndex + 1];

  const currentAnswer = useMemo(() => {
    return answers.find((a) => a.questionId === question.id)?.score;
  }, [answers, question.id]);

  const handleSelect = (score: number) => {
    setAnswer(question.id, score);
  };

  // Dynamic button label
  let buttonLabel: string;
  if (isLastQuestion) {
    buttonLabel = 'Finish Assessment';
  } else if (isLastInSection && nextSection) {
    buttonLabel = `Continue to Section ${ROMAN_NUMERALS[currentSectionIndex + 1]}: ${nextSection}`;
  } else {
    buttonLabel = 'Next';
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center py-6 px-4 overflow-hidden">
      {/* Progress Section */}
      <div className="w-full max-w-4xl mb-6">
        <div className="flex justify-between items-end mb-2">
          <div>
            <span className="text-brand-gold font-bold uppercase tracking-widest text-[10px]">
              Section {ROMAN_NUMERALS[currentSectionIndex]}: {question.section}
            </span>
            <h4 className="text-sm font-bold">Progress</h4>
          </div>
          <span className="text-brand-text-muted text-xs font-mono">
            Question {questionIndex + 1} of {QUESTIONS.length}
          </span>
        </div>
        <div className="h-1.5 w-full bg-brand-navy-light rounded-full overflow-hidden border border-brand-gold/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className="h-full bg-brand-gold shadow-[0_0_10px_rgba(215,181,91,0.5)]"
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-4xl flex-grow flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card-premium min-h-[400px] flex flex-col justify-between p-6 md:p-8"
          >
            <div>
              <div className="h-8 w-8 bg-brand-gold/10 rounded-lg flex items-center justify-center text-brand-gold mb-4">
                <Activity size={16} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-6 leading-tight">Q{questionIndex + 1}. {question.text}</h3>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Yes', score: SCORING.YES.points, tagline: SCORING.YES.tagline, icon: '✅' },
                  { label: 'Partially', score: SCORING.PARTIALLY.points, tagline: SCORING.PARTIALLY.tagline, icon: '⚠️' },
                  { label: 'No', score: SCORING.NO.points, tagline: SCORING.NO.tagline, icon: '❌' },
                ].map((option) => (
                  <button
                    key={option.score}
                    onClick={() => handleSelect(option.score)}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left group
                      ${
                        currentAnswer === option.score
                          ? 'border-brand-gold bg-brand-gold/10 shadow-lg'
                          : 'border-brand-gold/5 bg-brand-navy hover:border-brand-gold/40'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{option.icon}</span>
                      <div className="flex flex-col">
                        <span
                          className={`font-bold text-base ${currentAnswer === option.score ? 'text-brand-gold' : ''}`}
                        >
                          {option.label}
                        </span>
                        <span className="text-brand-text-muted text-[10px] uppercase tracking-wider">
                          {option.tagline}
                        </span>
                      </div>
                    </div>
                    {currentAnswer === option.score && <CheckCircle2 size={20} className="text-brand-gold" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-8 pt-6 border-t border-brand-gold/5">
              {/* Section completion message */}
              <AnimatePresence>
                {isLastInSection && !isLastQuestion && currentAnswer !== undefined && (
                  <motion.div
                    key={`section-done-${currentSectionIndex}`}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="flex items-center gap-2 text-emerald-400 font-semibold text-sm"
                  >
                    <CheckCircle2 size={18} className="shrink-0" />
                    <span>You&apos;ve completed <strong>{SECTIONS[currentSectionIndex]}</strong> 🎉</span>
                  </motion.div>
                )}
                {isLastQuestion && currentAnswer !== undefined && (
                  <motion.div
                    key="all-done"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="flex items-center gap-2 text-emerald-400 font-semibold text-sm"
                  >
                    <CheckCircle2 size={18} className="shrink-0" />
                    <span>All sections complete — ready to view your results! 🎉</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between">
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 text-brand-text-muted hover:text-brand-gold transition-colors font-semibold text-sm"
                >
                  <ArrowLeft size={18} /> Back
                </button>

                <button
                  disabled={currentAnswer === undefined}
                  onClick={nextStep}
                  className={`flex items-center gap-2 font-bold px-6 py-2.5 rounded-xl transition-all text-sm
                    ${
                      currentAnswer === undefined
                        ? 'bg-brand-navy-light text-brand-text-muted opacity-50 cursor-not-allowed'
                        : isLastInSection
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 ring-4 ring-emerald-500/20'
                        : 'bg-brand-gold text-brand-navy hover:bg-brand-gold-dark ring-4 ring-brand-gold/10'
                    }`}
                >
                  {buttonLabel}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
