'use client';

import { useAssessment } from '@/context/AssessmentContext';
import Home2 from '@/app/home2/page';
import { UserForm } from '@/components/pages/UserForm';
import { Assessment } from '@/components/pages/Assessment';
import { ScoreCheckForm } from '@/components/pages/ScoreCheckForm';
import { Results } from '@/components/pages/Results';
import { Layout } from '@/components/common/Layout';

export default function Page() {
  const { currentStep } = useAssessment();

  return (
    <>
      {currentStep === 0 && <Home2 />}
      {currentStep >= 1 && (
        <Layout>
          {currentStep === 1 && <UserForm />}
          {currentStep >= 2 && currentStep <= 16 && <Assessment />}
          {currentStep === 17 && <ScoreCheckForm />}
          {currentStep === 18 && <Results />}
        </Layout>
      )}
    </>
  );
}
