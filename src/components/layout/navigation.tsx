'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { WalletComponents } from '@/components/wallet/connect-wallet';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  TrendingUp, 
  DollarSign
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
    name: 'Cashflow',
    href: '/cashflow',
    icon: DollarSign
  }
];

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className={cn('bg-white border-r border-gray-200 w-64 h-full px-4 py-6', className)}>
      <div className="flex items-center mb-8">
        <div className="flex items-center space-x-3">
          <Image
            src="/Images/Logo/owna-logo.png"
            alt="Owna Logo"
            width={32}
            height={32}
            className="rounded-lg bg-black"
          />
          <span className="text-xl font-bold text-gray-900">Owna</span>
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
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>


      <div className="absolute bottom-6">
        <div className="text-xs text-gray-400">
          <p>© 2025 Owna Finance</p>
          <p>Real World Assets</p>
        </div>
      </div>
    </nav>
  );
}