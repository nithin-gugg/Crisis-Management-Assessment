import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AssessmentProvider } from '@/context/AssessmentContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Crisis Readiness Assessment | Maple Learning Solutions',
  description:
    'Assess your organization\'s crisis management readiness with our expert-designed 15-question assessment. Get a personalized report and training recommendations.',
  keywords: 'crisis management, business continuity, GCC, readiness assessment, eLearning',
  openGraph: {
    title: 'Crisis Readiness Assessment | Maple Learning Solutions',
    description: 'Assess your organization\'s crisis management readiness and get a personalized report.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <AssessmentProvider>
          {children}
        </AssessmentProvider>
      </body>
    </html>
  );
}
