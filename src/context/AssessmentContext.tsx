'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { QUESTIONS } from '@/lib/questions';
import { calculateResults } from '@/lib/scoring';
import { getRecommendations } from '@/lib/recommendations';
import type { UserData, Answer, AssessmentResults, SubmissionStatus } from '@/lib/types';

interface AssessmentContextType {
  userData: UserData | null;
  setUserData: (data: Partial<UserData>) => void;
  submissionError: string | null;
  answers: Answer[];
  setAnswer: (questionId: number, score: number) => void;
  currentStep: number;
  prevStep: () => void;
  nextStep: () => void;
  resetAssessment: () => void;
  isComplete: boolean;
  getResults: () => AssessmentResults;
  submissionStatus: SubmissionStatus;
  submitAssessment: (email?: string) => Promise<void>;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserDataState] = useState<UserData | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const setUserData = (data: Partial<UserData>) => setUserDataState((prev) => (prev ? { ...prev, ...data } : data as UserData));

  const setAnswer = (questionId: number, score: number) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);
      if (existing) return prev.map((a) => (a.questionId === questionId ? { ...a, score } : a));
      return [...prev, { questionId, score }];
    });
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => Math.max(0, prev - 1));

  const resetAssessment = () => {
    setAnswers([]);
    setCurrentStep(0);
    setUserDataState(null);
    setSubmissionStatus('idle');
    setSubmissionError(null);
  };

  const isComplete = answers.length === QUESTIONS.length;

  const getResults = useCallback(() => calculateResults(answers), [answers]);

  const submitAssessment = useCallback(async (emailOverride?: string) => {
    if (!userData) return;
    
    // Prioritize the passed email from the form over the (unreliable) state during submission
    const currentEmail = emailOverride || userData.email;
    if (!currentEmail) {
       throw new Error("Email is required for submission.");
    }

    if (submissionStatus === 'loading' || submissionStatus === 'success') return;
    setSubmissionStatus('loading');

      const results = calculateResults(answers);
      const recommendations = getRecommendations(results.weakSections);

    try {
      setSubmissionError(null);
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          email: currentEmail,
          phone: userData.phone,
          company_website: userData.company_website,
          captchaToken: userData.captchaToken,
          score: results.totalScore,
          level: results.level,
          weakAreas: results.weakSections,
          recommendations,
          answers,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Submission failed.');
      }
      setSubmissionStatus('success');
    } catch (err: any) {
      setSubmissionStatus('error');
      setSubmissionError(err.message || 'An unexpected error occurred.');
    }
  }, [userData, answers]);

  return (
    <AssessmentContext.Provider
      value={{
        userData,
        setUserData,
        answers,
        setAnswer,
        currentStep,
        nextStep,
        prevStep,
        resetAssessment,
        isComplete,
        getResults,
        submissionStatus,
        submissionError,
        submitAssessment,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) throw new Error('useAssessment must be used within an AssessmentProvider');
  return context;
};
