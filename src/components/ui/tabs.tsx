import React, { useState, createContext, useContext, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Context for tabs state
interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: ReactNode;
}

interface TabsListProps {
  className?: string;
  children: ReactNode;
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: ReactNode;
  disabled?: boolean;
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: ReactNode;
}

export function Tabs({ defaultValue, value, onValueChange, className, children }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const currentValue = value !== undefined ? value : internalValue;

  const handleValueChange = (newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={cn("w-full", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a Tabs component');
  }
  return context;
}

export function TabsList({ className, children }: TabsListProps) {
  return (
    <div className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-[#111111] border border-[#2A2A2A] p-1 text-gray-400",
      className
    )}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children, disabled = false }: TabsTriggerProps) {
  const { value: selectedValue, onValueChange } = useTabs();
  const isActive = selectedValue === value;

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
        isActive
          ? "bg-[#0A0A0A] text-white border border-[#333333]"
          : "text-gray-400 hover:text-white hover:bg-[#1A1A1A]",
        className
      )}
      onClick={() => onValueChange(value)}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children }: TabsContentProps) {
  const { value: selectedValue } = useTabs();
  const isActive = selectedValue === value;

  if (!isActive) {
    return null;
  }

  return (
    <div
      className={cn(
        "mt-6",
        className
      )}
    >
      {children}
    </div>
  );
}