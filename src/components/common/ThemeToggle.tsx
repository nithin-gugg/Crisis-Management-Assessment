'use client';

import React from 'react';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = React.useState(true);

  const toggle = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative w-12 h-6 rounded-full border border-brand-gold/30 bg-brand-navy-light flex items-center transition-all duration-300 hover:border-brand-gold/60"
    >
      <span
        className={`absolute left-1 w-4 h-4 rounded-full transition-all duration-300 ${isDark ? 'bg-brand-gold translate-x-0' : 'bg-blue-400 translate-x-6'}`}
      />
    </button>
  );
};
