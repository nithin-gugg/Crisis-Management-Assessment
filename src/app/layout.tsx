import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AssessmentProvider } from '@/context/AssessmentContext';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });


const schemaData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "Maple Learning Solutions",
      "url": "https://gccbcp.maplelearningsolutions.com/",
      "logo": "https://maplelearningsolutions.com/logo.png",
      "sameAs": [
        "https://www.linkedin.com/company/maple-learning-solutions"
      ],
      "areaServed": {
        "@type": "Place",
        "name": "GCC"
      }
    },
    {
      "@type": "Course",
      "name": "Workforce Resilience Training in GCC | BCP & Readiness",
      "description": "Workforce resilience training program designed to help organizations in the GCC region build business continuity, workforce resilience, and effective response strategies during disruptions.",
      "provider": {
        "@type": "Organization",
        "name": "Maple Learning Solutions",
        "url": "https://maplelearningsolutions.com/"
      },
      "educationalLevel": "Professional",
      "inLanguage": "en",
      "url": "https://gccbcp.maplelearningsolutions.com/",
      "image": "https://maplelearningsolutions.com/logo.png",
      "offers": {
        "@type": "Offer",
        "category": "Training",
        "availability": "https://schema.org/InStock",
        "url": "https://gccbcp.maplelearningsolutions.com/"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is workforce resilience training?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Workforce resilience training helps organizations prepare for disruptions by equipping teams with skills in communication, decision-making, and coordinated response."
          }
        },
        {
          "@type": "Question",
          "name": "Why is business continuity planning important?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Business continuity planning ensures that critical operations can continue during disruptions, minimizing downtime and maintaining organizational stability."
          }
        },
        {
          "@type": "Question",
          "name": "Who should take workforce resilience training?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "This training is designed for leaders, HR professionals, operations teams, and employees responsible for safety, compliance, and business continuity."
          }
        },
        {
          "@type": "Question",
          "name": "How does simulation-based training support workforce resilience?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Simulation-based training uses real-world scenarios to help teams practice communication, coordination, and decision-making during high-pressure situations."
          }
        }
      ]
    }
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL('https://gccbcp.maplelearningsolutions.com/'),
  title: 'Business Continuity Management in UAE | Training & Solutions',
description:
  "Build resilient organizations with business continuity management training in UAE. Prepare teams for crisis situations with structured programs.",
keywords:
  'workforce resilience, resilience assessment, employee resilience, organizational resilience, business continuity, resilience training, eLearning',
  authors: [{ name: 'Maple Learning Solutions' }],

  alternates: {
    canonical: 'https://gccbcp.maplelearningsolutions.com/',
  },

  openGraph: {
    title: 'Workforce Resilience Assessment | Maple Learning Solutions',
description:
  "Assess your organization's workforce resilience and preparedness with a personalized resilience readiness report.",
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
        alt: 'Workforce Resilience Assessment Thumbnail',
        type: 'image/webp',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Workforce Resilience Assessment | Maple Learning Solutions',
description:
  "Assess your organization's workforce resilience and preparedness with a personalized resilience readiness report.",
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
        {/* ✅ JSON-LD Schema */}
        <Script
          id="schema-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
          strategy="afterInteractive"
        />
        <AssessmentProvider>
          {children}
        </AssessmentProvider>
      </body>
    </html>
  );
}
