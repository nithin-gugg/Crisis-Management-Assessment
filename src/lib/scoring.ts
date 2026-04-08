import { QUESTIONS } from './questions';
import type { Answer, AssessmentResults } from './types';

export function calculateResults(answers: Answer[]): AssessmentResults {
  const totalScore = answers.reduce((sum, a) => sum + a.score, 0);

  let level: 'High' | 'Moderate' | 'Low' = 'Low';
  if (totalScore >= 24) level = 'High';
  else if (totalScore >= 15) level = 'Moderate';

  // Identify weak sections and aggregate scores
  const sectionScoresArr: Record<string, number[]> = {};
  QUESTIONS.forEach((q) => {
    const answer = answers.find((a) => a.questionId === q.id);
    if (!sectionScoresArr[q.section]) sectionScoresArr[q.section] = [];
    if (answer) sectionScoresArr[q.section].push(answer.score);
  });

  const weakSections = Object.entries(sectionScoresArr)
    .filter(([, scores]) => scores.some((s) => s === 0 || s === 1))
    .map(([section]) => section);

  const sectionScores: Record<string, number> = {};
  for (const [section, scores] of Object.entries(sectionScoresArr)) {
    sectionScores[section] = scores.reduce((sum, s) => sum + s, 0);
  }

  return { totalScore, level, weakSections, sectionScores };
}
