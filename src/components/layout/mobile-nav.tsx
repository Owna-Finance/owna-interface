'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X,
  LayoutDashboard, 
  ArrowRightLeft, 
  TrendingUp, 
  Droplets, 
  DollarSign, 
  Vote 
} from 'lucide-react';

interface MobileNavProps {
  className?: string;
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Swap',
    href: '/swap',
    icon: ArrowRightLeft
  },
  {
    name: 'Market',
    href: '/market',
    icon: TrendingUp
  },
  {
    name: 'Pool',
    href: '/pool',
    icon: Droplets
  },
  {
    name: 'Cashflow',
    href: '/cashflow',
    icon: DollarSign
  },
  {
    name: 'Governance',
    href: '/governance',
    icon: Vote
  }
];

export function MobileNav({ className }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Header */}
      <header className={cn('lg:hidden bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-4 py-3', className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
              <span className="text-white dark:text-black font-bold text-sm">O</span>
            </div>
            <span className="text-xl font-bold text-black dark:text-white">Owna</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMenu}
            className="text-black dark:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={closeMenu}>
          <div 
            className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 px-4 py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                  <span className="text-white dark:text-black font-bold text-sm">O</span>
                </div>
                <span className="text-xl font-bold text-black dark:text-white">Owna</span>
              </div>
              <Button variant="ghost" size="sm" onClick={closeMenu}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-black dark:bg-white text-white dark:text-black'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-6 left-4 text-xs text-gray-500 dark:text-gray-400">
              <p>© 2025 Owna Finance</p>
              <p>Real World Assets</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}