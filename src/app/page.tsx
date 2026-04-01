'use client';

import { Layout } from '@/components/common/Layout';
import { useAssessment } from '@/context/AssessmentContext';
import { Home } from '@/components/pages/Home';
import { UserForm } from '@/components/pages/UserForm';
import { Assessment } from '@/components/pages/Assessment';
import { ScoreCheckForm } from '@/components/pages/ScoreCheckForm';
import { Results } from '@/components/pages/Results';

export default function Page() {
  const { currentStep } = useAssessment();

  return (
    <Layout>
      {currentStep === 0 && <Home />}
      {currentStep === 1 && <UserForm />}
      {currentStep >= 2 && currentStep <= 16 && <Assessment />}
      {currentStep === 17 && <ScoreCheckForm />}
      {currentStep === 18 && <Results />}
    </Layout>
  );
}
