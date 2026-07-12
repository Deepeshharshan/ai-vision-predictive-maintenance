'use client';

import React from 'react';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-8 font-sans">
      {/* Decorative background */}
      <div className="fixed inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-30 pointer-events-none" />

      <div className="relative z-10 text-center space-y-8 max-w-xl">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-center ring-1 ring-red-500/20 shadow-2xl">
            <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2 font-mono">
            KRONOS SYSTEM — RUNTIME EXCEPTION
          </div>
          <h1 className="text-xl font-bold text-white mt-3">Critical Fault Detected</h1>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            An unhandled exception caused the monitoring console to fault. 
            The error has been captured. You can attempt a hot-restart of this module.
          </p>
        </div>

        {/* Error Details */}
        <div className="bg-slate-900/60 border border-red-500/20 rounded-xl p-4 text-left space-y-2 font-mono text-[11px]">
          <div className="flex justify-between items-start gap-4">
            <span className="text-slate-500 shrink-0">EXCEPTION:</span>
            <span className="text-red-400 font-bold text-right break-all">{error.message || 'Unknown runtime error'}</span>
          </div>
          {error.digest && (
            <div className="flex justify-between">
              <span className="text-slate-500">DIGEST:</span>
              <span className="text-slate-400 font-mono text-[10px]">{error.digest}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-500">TIMESTAMP:</span>
            <span className="text-slate-300">{new Date().toISOString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">SUBSYSTEM:</span>
            <span className="text-amber-400">FRONTEND_RUNTIME</span>
          </div>
        </div>

        {/* Stack Trace (collapsed) */}
        {process.env.NODE_ENV === 'development' && error.stack && (
          <details className="text-left">
            <summary className="text-[10px] text-slate-500 cursor-pointer hover:text-slate-300 font-mono uppercase tracking-wider">
              Developer Stack Trace
            </summary>
            <pre className="mt-2 max-h-48 overflow-auto text-[9px] text-slate-400 bg-slate-900 border border-slate-800 rounded-lg p-3 whitespace-pre-wrap break-all">
              {error.stack}
            </pre>
          </details>
        )}

        {/* Recovery Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-500 transition shadow-lg"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Restart Module
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-6 py-3 text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            Return to Dashboard
          </button>
        </div>

        <p className="text-[10px] text-slate-600 font-mono">
          KRONOS v1.2.0-prod · Error boundary intercepted · No data loss occurred
        </p>
      </div>
    </div>
  );
}
