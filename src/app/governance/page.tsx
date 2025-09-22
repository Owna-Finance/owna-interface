'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { PageHeader } from '@/components/layout/page-header';
import { Vote } from 'lucide-react';

export default function GovernancePage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Governance"
        subtitle="Participate in protocol governance and vote on proposals"
      />

      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Vote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Governance Coming Soon
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            The governance and voting functionality is being implemented.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}