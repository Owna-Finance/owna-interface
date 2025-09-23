'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { WalletComponents } from '@/components/wallet/connect-wallet';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  Layers, 
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
    icon: Layers
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
    <nav className={cn('bg-[#0A0A0A] border-r border-[#2A2A2A] w-64 h-full px-6 py-8 shadow-[0_0_30px_rgba(0,0,0,0.5)]', className)}>
      <div className="flex items-center mb-12">
        <div className="flex items-center space-x-3">
          <Image
            src="/Images/Logo/owna-logo.png"
            alt="Owna Logo"
            width={36}
            height={36}
            className="rounded-xl bg-white p-1 shadow-[0_0_12px_rgba(59,130,246,0.3)]"
          />
          <span className="text-2xl font-medium text-white tracking-tight">Owna</span>
        </div>
      </div>

      <div className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group',
                isActive
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]/70'
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-all duration-300",
                isActive 
                  ? "text-white"
                  : "group-hover:text-white"
              )} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>


      <div className="absolute bottom-8 left-6 right-6">
        <div className="text-xs text-gray-500 space-y-1">
          <p className="font-medium">© 2025 Owna Finance</p>
          <p className="text-gray-600">Real World Assets</p>
        </div>
      </div>
    </nav>
  );
}