import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AssessmentProvider } from '@/context/AssessmentContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Crisis Management Training in GCC | BCP & Readiness',
  description:
    "Crisis Management Training in GCC | BCP & Readiness helps organizations prepare for disruptions, build resilience, and ensure business continuity.",
  keywords:
    'crisis management, business continuity, GCC, readiness assessment, eLearning',

  alternates: {
    canonical: "https://gccbcp.maplelearningsolutions.com/",
  },

  openGraph: {
    title: 'Crisis Readiness Assessment | Maple Learning Solutions',
    description:
      "Assess your organization's crisis management readiness and get a personalized report.",
    type: 'website',
    url: "https://gccbcp.maplelearningsolutions.com/",
    images: [
      {
        url: "https://gccbcp.maplelearningsolutions.com/og-image.webp", // ✅ IMPORTANT
        width: 1200,
        height: 630,
        alt: "Crisis Readiness Assessment",
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Crisis Readiness Assessment | Maple Learning Solutions',
    description:
      "Assess your organization's crisis management readiness and get a personalized report.",
    images: ["https://gccbcp.maplelearningsolutions.com/og-image.webp"], // ✅ IMPORTANT
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
