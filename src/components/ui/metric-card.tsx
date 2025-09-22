import { cn, getChangeColorClass, getChangeIcon } from '@/lib/utils';
import { ReactNode } from 'react';
import { LoadingSpinner } from './loading-spinner';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'positive' | 'negative' | 'neutral';
  };
  icon?: ReactNode;
  isLoading?: boolean;
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  icon, 
  isLoading = false,
  className 
}: MetricCardProps) {
  if (isLoading) {
    return (
      <div className={cn('dashboard-card p-6', className)}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          {icon && <div className="text-gray-400">{icon}</div>}
        </div>
        <div className="flex items-center justify-center py-4">
          <LoadingSpinner size="sm" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('dashboard-card p-6', className)}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-black dark:text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        
        {change && (
          <div className={cn('flex items-center text-sm font-medium', getChangeColorClass(change.value))}>
            <span className="mr-1">{getChangeIcon(change.value)}</span>
            <span>{Math.abs(change.value).toFixed(2)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}