import React from 'react';
import { cn } from '../../utils/cn';

interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoadingSkeleton({ className, ...props }: LoadingSkeletonProps) {
  return (
    <div
      className={cn("animate-pulse bg-slate-800 rounded-sm", className)}
      {...props}
    />
  );
}
