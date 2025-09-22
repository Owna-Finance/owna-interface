'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { PageHeader } from '@/components/layout/page-header';
import { ArrowRightLeft } from 'lucide-react';

export default function SwapPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Swap"
        subtitle="Exchange tokens instantly with the best rates"
      />

      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <ArrowRightLeft className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Swap Interface Coming Soon
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            The swap functionality is being implemented and will be available shortly.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}