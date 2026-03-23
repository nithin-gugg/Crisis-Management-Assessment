export interface UserData {
  name: string;
  email: string;
  phone: string;
}

export interface Answer {
  questionId: number;
  score: number;
}

export interface AssessmentResults {
  totalScore: number;
  level: 'High' | 'Moderate' | 'Low';
  weakSections: string[];
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  src: string;
}

export type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error';
