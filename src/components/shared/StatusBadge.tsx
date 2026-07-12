import React from 'react';
import { DeviceStatus } from '../../types';
import { Badge } from '../ui/Badge';

interface StatusBadgeProps {
  status: DeviceStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const configs: Record<string, { variant: "success" | "warning" | "destructive" | "slate", label: string }> = {
    running: { variant: 'success', label: 'RUNNING' },
    warning: { variant: 'warning', label: 'WARNING' },
    critical: { variant: 'destructive', label: 'CRITICAL' },
    offline: { variant: 'slate', label: 'OFFLINE' }
  };

  const current = configs[status] || configs.offline;

  return (
    <Badge variant={current.variant} className="uppercase font-mono text-[10px] tracking-widest px-1.5 rounded-none">
      <span className={`h-1.5 w-1.5 rounded-none mr-1.5 ${
        current.variant === 'success' ? 'bg-emerald-500' :
        current.variant === 'warning' ? 'bg-amber-500' :
        current.variant === 'destructive' ? 'bg-red-500' : 'bg-slate-500'
      }`}></span>
      {current.label}
    </Badge>
  );
}
