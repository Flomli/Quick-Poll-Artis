import React from 'react';
import { ThemeType } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ThemeWrapperProps {
  theme: ThemeType;
  children: React.ReactNode;
  className?: string;
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ theme, children, className }) => {
  return (
    <div className={cn(
      'min-h-screen transition-colors duration-500 ease-in-out font-sans',
      theme === 'neon' && 'theme-neon bg-app text-app',
      theme === 'pastel' && 'theme-pastel bg-app text-app',
      theme === 'minimal' && 'theme-minimal bg-app text-app',
      theme === 'bold' && 'theme-bold-typography bg-app text-app',
      className
    )}>
      {children}
    </div>
  );
};
