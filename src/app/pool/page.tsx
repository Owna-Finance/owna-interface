'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { PageHeader } from '@/components/layout/page-header';
import { Droplets } from 'lucide-react';

export default function PoolPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Pool"
        subtitle="Provide liquidity and earn rewards from trading fees"
      />

      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Droplets className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Liquidity Pools Coming Soon
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            The liquidity pool functionality is being implemented.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}