import type { TrainingModule } from './types';

export const TRAINING_MODULE_LIBRARY: Record<string, TrainingModule> = {
  BCP: {
    id: 'bcp',
    title: 'Business Continuity & Workforce Resilience Response',
    description: 'Master the fundamentals of maintaining operations during disruption.',
    src: '/videos/bccr.mp4',
    thumbnail: '/thumbnails/bcc.webp',
  },
  REMOTE: {
    id: 'remote',
    title: 'Remote Work & Digital Operations',
    description: 'Strategies for managing distributed teams and secure digital workflows.',
    src: '/videos/remote.mp4',
    thumbnail: '/thumbnails/remote.webp',
  },
  SAFETY: {
    id: 'safety',
    title: 'Safety & Security Awareness',
    description: 'Essential protocols for physical security and personnel safety.',
    src: '/videos/safety.mp4',
    thumbnail: '/thumbnails/safety.webp',
  },
  RESILIENCE: {
    id: 'resilience',
    title: 'Mental Health & Workforce Resilience',
    description: 'Techniques to support employee wellbeing during high-stress periods.',
    src: '/videos/mental-health.mp4',
    thumbnail: '/thumbnails/mental-health.webp',
  },
};

export const getRecommendations = (weakSections: string[]): TrainingModule[] => {
  const recommendations: TrainingModule[] = [];

  if (weakSections.includes('Leadership')) {
    recommendations.push(TRAINING_MODULE_LIBRARY['BCP']);
    recommendations.push(TRAINING_MODULE_LIBRARY['RESILIENCE']);
  }
  if (weakSections.includes('Communication')) {
    recommendations.push(TRAINING_MODULE_LIBRARY['REMOTE']);
    recommendations.push(TRAINING_MODULE_LIBRARY['BCP']);
  }
  if (weakSections.includes('Operations')) {
    recommendations.push(TRAINING_MODULE_LIBRARY['BCP']);
  }
  if (weakSections.includes('Workforce')) {
    recommendations.push(TRAINING_MODULE_LIBRARY['SAFETY']);
    recommendations.push(TRAINING_MODULE_LIBRARY['RESILIENCE']);
  }
  if (weakSections.includes('Training')) {
    recommendations.push(TRAINING_MODULE_LIBRARY['BCP']);
    recommendations.push(TRAINING_MODULE_LIBRARY['SAFETY']);
  }

  // Default fallback if no weak sections
  if (recommendations.length === 0) {
    recommendations.push(TRAINING_MODULE_LIBRARY['BCP']);
    recommendations.push(TRAINING_MODULE_LIBRARY['REMOTE']);
    recommendations.push(TRAINING_MODULE_LIBRARY['RESILIENCE']);
  }

  // Deduplicate and return top 3
  const unique = Array.from(new Set(recommendations.map((r) => r.id)))
    .map((id) => recommendations.find((r) => r.id === id)!)
    .slice(0, 3);

  return unique;
};
