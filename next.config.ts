import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com;
      frame-src 'self' https://www.google.com/recaptcha/;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com;
      font-src 'self' data:;
      connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com;
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
