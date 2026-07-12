import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { cn } from '../../utils/cn';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  status?: 'ok' | 'warn' | 'critical';
  children?: React.ReactNode;
}

export function MetricCard({
  title,
  value,
  unit,
  trend,
  trendDirection = 'neutral',
  status = 'ok',
  children
}: MetricCardProps) {
  const statusColors = {
    ok: '',
    warn: 'border-amber-500/50 bg-amber-950/10',
    critical: 'border-red-500/50 bg-red-950/10'
  };

  const trendColors = {
    up: 'text-emerald-400',
    down: 'text-red-400',
    neutral: 'text-slate-400'
  };

  return (
    <Card className={cn("transition-colors", statusColors[status])}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{title}</span>
          {trend && (
            <span className={cn("text-[10px] font-mono flex items-center gap-1 font-medium", trendColors[trendDirection])}>
              {trendDirection === 'up' && '▲'}
              {trendDirection === 'down' && '▼'}
              {trendDirection === 'neutral' && '—'}
              {trend}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-1.5 font-mono">
          <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
          <span className="text-xs font-medium text-slate-500 uppercase">{unit}</span>
        </div>

        {children && <div className="mt-3 border-t border-slate-800/50 pt-3">{children}</div>}
      </CardContent>
    </Card>
  );
}
