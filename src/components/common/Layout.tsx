'use client';

import React from 'react';
import { Header } from './Header';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-navy text-brand-text-primary">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};
