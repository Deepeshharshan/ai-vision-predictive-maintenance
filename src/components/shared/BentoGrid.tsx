import React from 'react';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
      {children}
    </div>
  );
}

interface BentoGridItemProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: 'col-span-1' | 'col-span-2' | 'col-span-3' | 'col-span-4';
  rowSpan?: 'row-span-1' | 'row-span-2' | 'row-span-3';
}

export function BentoGridItem({
  children,
  className = '',
  colSpan = 'col-span-1',
  rowSpan = 'row-span-1'
}: BentoGridItemProps) {
  return (
    <div className={`flex flex-col justify-between ${colSpan} ${rowSpan} ${className}`}>
      {children}
    </div>
  );
}
