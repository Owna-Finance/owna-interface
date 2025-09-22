import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}