'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { PageHeader } from '@/components/layout/page-header';
import { TrendingUp } from 'lucide-react';

export default function MarketPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Market"
        subtitle="Lend and borrow tokens with competitive rates"
      />

      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Lending Market Coming Soon
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            The lending and borrowing functionality is being implemented.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}