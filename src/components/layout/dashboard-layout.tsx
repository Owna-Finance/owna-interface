'use client';

import { cn } from '@/lib/utils';
import { Navigation } from './navigation';
import { MobileNav } from './mobile-nav';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <MobileNav />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:fixed lg:inset-y-0">
          <Navigation />
        </div>
        
        {/* Main Content */}
        <main className={cn(
          'flex-1 lg:ml-64',
          'min-h-screen',
          className
        )}>
          <div className="px-4 py-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}