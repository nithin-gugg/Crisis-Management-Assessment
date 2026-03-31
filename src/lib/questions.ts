export interface Question {
  id: number;
  section: 'Leadership' | 'Communication' | 'Operations' | 'Workforce' | 'Training';
  text: string;
}

export const QUESTIONS: Question[] = [
  // Leadership (Q1-Q3)
  { id: 1, section: 'Leadership', text: 'Does your organization have a clearly defined workforce resilience team with assigned roles and responsibilities?' },
  { id: 2, section: 'Leadership', text: 'Is there a formal process for periodic review and updating of workforce resilience response plans by executive leadership?' },
  { id: 3, section: 'Leadership', text: 'Are decision-making protocols established for rapid response during high-pressure scenarios?' },

  // Communication (Q4-Q6)
  { id: 4, section: 'Communication', text: 'Do you have a pre-approved internal communication strategy to reach all employees instantly during workforce resilience events?' },
  { id: 5, section: 'Communication', text: 'Is there a designated spokesperson and external communication plan for media and stakeholders?' },
  { id: 6, section: 'Communication', text: 'Are multi-channel communication tools (SMS, App, Email) tested and ready for deployment?' },

  // Operations (Q7-Q9)
  { id: 7, section: 'Operations', text: 'Are essential business functions identified and prioritized for recovery in a Business Continuity Plan (BCP)?' },
  { id: 8, section: 'Operations', text: 'Do you have redundant systems or secondary suppliers for critical operational dependencies?' },
  { id: 9, section: 'Operations', text: 'Is there a clear procedure for transitioning to remote or alternative site operations?' },

  // Workforce (Q10-Q12)
  { id: 10, section: 'Workforce', text: 'Are safety and security protocols for on-site personnel clearly communicated and practiced?' },
  { id: 11, section: 'Workforce', text: 'Does the organization provide mental health and workforce resilience support for high-stress scenarios?' },
  { id: 12, section: 'Workforce', text: 'Is there a system to track and verify the safety of all employees in real-time during an emergency?' },

  // Training (Q13-Q15)
  { id: 13, section: 'Training', text: 'Are employees regularly trained on workforce resilience protocols through simulation drills or eLearning?' },
  { id: 14, section: 'Training', text: 'Is there specialized training for managers on leading remote or stressed teams during high-pressure situations?' },
  { id: 15, section: 'Training', text: 'Do you conduct "Post-Incident Reviews" to update training programs based on lessons learned?' },
];

export const SCORING = {
  YES: { points: 2, tagline: 'Fully implemented' },
  PARTIALLY: { points: 1, tagline: 'In progress' },
  NO: { points: 0, tagline: 'Not implemented' },
};

export const READINESS_LEVELS = {
  HIGH: { range: [24, 30], label: 'High', color: 'text-green-500' },
  MODERATE: { range: [15, 23], label: 'Moderate', color: 'text-brand-gold' },
  LOW: { range: [0, 14], label: 'Low', color: 'text-red-500' },
};
