'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { WalletComponents } from '@/components/wallet/connect-wallet';
import { 
  Menu, 
  X,
  LayoutDashboard, 
  ArrowRightLeft, 
  TrendingUp, 
  DollarSign
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
    name: 'Cashflow',
    href: '/cashflow',
    icon: DollarSign
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
      <header className={cn('lg:hidden bg-white border-b border-gray-200 px-4 py-3', className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src="/Images/Logo/owna-logo.png"
              alt="Owna Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-xl font-bold text-gray-900">Owna</span>
          </div>
          
          {/* <div className="flex items-center space-x-3">
            <WalletComponents />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="text-gray-900"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div> */}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={closeMenu}>
          <div 
            className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 px-4 py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <Image
                  src="/Images/Logo/owna-logo.png"
                  alt="Owna Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold text-gray-900">Owna</span>
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
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-6 left-4 text-xs text-gray-400">
              <p>© 2025 Owna Finance</p>
              <p>Real World Assets</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}