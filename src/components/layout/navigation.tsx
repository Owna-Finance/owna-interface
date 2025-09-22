'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  TrendingUp, 
  Droplets, 
  DollarSign, 
  Vote 
} from 'lucide-react';

interface NavigationProps {
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

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className={cn('dashboard-sidebar w-64 h-full px-4 py-6', className)}>
      <div className="flex items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
            <span className="text-white dark:text-black font-bold text-sm">O</span>
          </div>
          <span className="text-xl font-bold text-black dark:text-white">Owna</span>
        </div>
      </div>

      <div className="space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
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
      </div>

      <div className="mt-auto pt-8">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>© 2025 Owna Finance</p>
          <p>Real World Assets</p>
        </div>
      </div>
    </nav>
  );
}