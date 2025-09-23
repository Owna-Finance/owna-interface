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
      <header className={cn('lg:hidden bg-[#0A0A0A] border-b border-[#2A2A2A] px-4 py-3', className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src="/Images/Logo/owna-logo.png"
              alt="Owna Logo"
              width={32}
              height={32}
              className="rounded-lg bg-gradient-to-br from-blue-600 to-cyan-400 p-1 shadow-[0_0_8px_rgba(59,130,246,0.3)]"
            />
            <span className="text-xl font-bold text-white">Owna</span>
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
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={closeMenu}>
          <div 
            className="fixed top-0 left-0 h-full w-64 bg-[#0A0A0A] border-r border-[#2A2A2A] px-6 py-8 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center space-x-3">
                <Image
                  src="/Images/Logo/owna-logo.png"
                  alt="Owna Logo"
                  width={32}
                  height={32}
                  className="rounded-lg bg-white p-1 shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                />
                <span className="text-xl font-bold text-white">Owna</span>
              </div>
              <Button variant="ghost" size="sm" onClick={closeMenu} className="text-gray-400 hover:text-white hover:bg-[#1A1A1A]">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={cn(
                      'flex items-center space-x-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group',
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/20 to-cyan-400/20 text-white border border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                        : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]/70 hover:border hover:border-[#2A2A2A] hover:shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                    )}
                  >
                    <Icon className={cn(
                      "w-5 h-5 transition-all duration-300",
                      isActive 
                        ? "text-blue-400 drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]"
                        : "group-hover:text-white"
                    )} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-8 left-6 right-6 text-xs text-gray-500 space-y-1">
              <p className="font-medium">© 2025 Owna Finance</p>
              <p className="text-gray-600">Real World Assets</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}