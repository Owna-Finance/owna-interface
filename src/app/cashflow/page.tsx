'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { PageHeader } from '@/components/layout/page-header';
import { DollarSign } from 'lucide-react';

export default function CashflowPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Cashflow Tracking"
        subtitle="Monitor your RWA investment returns and cashflow history"
      />

      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Cashflow Tracking Coming Soon
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            The RWA cashflow tracking functionality is being implemented.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}