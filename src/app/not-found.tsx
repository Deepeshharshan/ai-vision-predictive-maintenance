import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-8 font-sans">
      {/* Decorative grid background */}
      <div className="fixed inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-30 pointer-events-none" />

      <div className="relative z-10 text-center space-y-8 max-w-lg">
        {/* Signal Lost Icon */}
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center ring-1 ring-slate-700 shadow-2xl">
            <svg className="h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M18.364 5.636a9 9 0 010 12.728M15.536 8.464a5 5 0 010 7.072M12 11a1 1 0 100 2 1 1 0 000-2zM6.343 17.657A9 9 0 015.636 5.636M8.464 15.536a5 5 0 010-7.072" />
            </svg>
          </div>
        </div>

        {/* Error Code */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2 font-mono">
            KRONOS SYSTEM — NODE SIGNAL LOST
          </div>
          <div className="text-8xl font-black text-slate-800 tracking-tighter leading-none select-none">
            404
          </div>
          <h1 className="text-xl font-bold text-white mt-3">Hardware Node Not Found</h1>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            The requested system module or hardware endpoint is not responding. 
            The signal has been lost or the route does not exist in this deployment.
          </p>
        </div>

        {/* Status Details */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-left space-y-2 font-mono text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-500">ERROR_CODE:</span>
            <span className="text-red-400 font-bold">404_NODE_NOT_FOUND</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">SUBSYSTEM:</span>
            <span className="text-slate-300">KRONOS SCADA GATEWAY</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">TIMESTAMP:</span>
            <span className="text-slate-300">{new Date().toISOString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">RESOLUTION:</span>
            <span className="text-amber-400">NAVIGATE_TO_DASHBOARD</span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-500 transition shadow-lg"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Return to Dashboard
          </Link>
          <Link
            href="/dashboard/alerts"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-6 py-3 text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            Alert Desk
          </Link>
        </div>

        <p className="text-[10px] text-slate-600 font-mono">
          KRONOS v1.2.0-prod · Industrial Monitoring Platform
        </p>
      </div>
    </div>
  );
}
