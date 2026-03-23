import { QUESTIONS } from './questions';
import type { Answer, AssessmentResults } from './types';

export function calculateResults(answers: Answer[]): AssessmentResults {
  const totalScore = answers.reduce((sum, a) => sum + a.score, 0);

  let level: 'High' | 'Moderate' | 'Low' = 'Low';
  if (totalScore >= 24) level = 'High';
  else if (totalScore >= 15) level = 'Moderate';

  // Identify weak sections
  const sectionScores: Record<string, number[]> = {};
  QUESTIONS.forEach((q) => {
    const answer = answers.find((a) => a.questionId === q.id);
    if (!sectionScores[q.section]) sectionScores[q.section] = [];
    if (answer) sectionScores[q.section].push(answer.score);
  });

  const weakSections = Object.entries(sectionScores)
    .filter(([, scores]) => scores.some((s) => s === 0 || s === 1))
    .map(([section]) => section);

  return { totalScore, level, weakSections };
}
