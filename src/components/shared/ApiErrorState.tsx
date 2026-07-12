import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface ApiErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ApiErrorState({ message = 'Failed to fetch data from API', onRetry }: ApiErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-slate-800 bg-slate-900/50 rounded-sm">
      <AlertTriangle className="h-8 w-8 text-red-500 mb-3" />
      <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-widest mb-1">Connection Error</h3>
      <p className="text-xs font-mono text-slate-400 mb-4 max-w-md">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5 mr-2" /> Retry Connection
        </Button>
      )}
    </div>
  );
}
