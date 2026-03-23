'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { QUESTIONS } from '@/lib/questions';
import { calculateResults } from '@/lib/scoring';
import { getRecommendations } from '@/lib/recommendations';
import type { UserData, Answer, AssessmentResults, SubmissionStatus } from '@/lib/types';

interface AssessmentContextType {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  answers: Answer[];
  setAnswer: (questionId: number, score: number) => void;
  currentStep: number;
  prevStep: () => void;
  nextStep: () => void;
  resetAssessment: () => void;
  isComplete: boolean;
  getResults: () => AssessmentResults;
  submissionStatus: SubmissionStatus;
  submitAssessment: () => Promise<void>;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserDataState] = useState<UserData | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');

  const setUserData = (data: UserData) => setUserDataState(data);

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
  };

  const isComplete = answers.length === QUESTIONS.length;

  const getResults = useCallback(() => calculateResults(answers), [answers]);

  const submitAssessment = useCallback(async () => {
    if (!userData) return;
    if (submissionStatus === 'loading' || submissionStatus === 'success') return;
    setSubmissionStatus('loading');

      const results = calculateResults(answers);
      const recommendations = getRecommendations(results.weakSections);

    try {
      const res = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          score: results.totalScore,
          level: results.level,
          weakAreas: results.weakSections,
          recommendations,
          answers,
        }),
      });

      if (!res.ok) throw new Error('Submission failed');
      setSubmissionStatus('success');
    } catch {
      setSubmissionStatus('error');
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
