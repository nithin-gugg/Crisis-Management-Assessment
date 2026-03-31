import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AssessmentProvider } from '@/context/AssessmentContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('https://gccbcp.maplelearningsolutions.com/'),
  title: 'Crisis Readiness Assessment | Maple Learning Solutions',
  description:
    "Assess your organization's crisis management readiness and get a personalized report.",
  keywords:
    'crisis management, business continuity, GCC, readiness assessment, eLearning',
  applicationName: 'Maple Learning Solutions',
  authors: [{ name: 'Maple Learning Solutions' }],

  alternates: {
    canonical: 'https://gccbcp.maplelearningsolutions.com/',
  },

  openGraph: {
    title: 'Crisis Readiness Assessment | Maple Learning Solutions',
    description:
      "Assess your organization's crisis management readiness and get a personalized report.",
    type: 'website',
    url: 'https://gccbcp.maplelearningsolutions.com/',
    siteName: 'Maple Learning Solutions',
    locale: 'en_US',
    images: [
      {
        url: 'https://gccbcp.maplelearningsolutions.com/og-image.webp', // ✅ IMPORTANT
        secureUrl: 'https://gccbcp.maplelearningsolutions.com/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Crisis Readiness Assessment Thumbnail',
        type: 'image/webp',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Crisis Readiness Assessment | Maple Learning Solutions',
    description:
      "Assess your organization's crisis management readiness and get a personalized report.",
    images: ['https://gccbcp.maplelearningsolutions.com/og-image.webp'], // ✅ IMPORTANT
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
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
