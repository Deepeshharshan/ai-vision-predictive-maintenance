export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Title Skeleton */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-5">
        <div className="space-y-2">
          <div className="h-7 w-64 rounded-lg bg-slate-800" />
          <div className="h-3.5 w-96 rounded bg-slate-900" />
        </div>
        <div className="h-8 w-40 rounded-full bg-slate-800" />
      </div>

      {/* KPI Card Skeletons */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 rounded bg-slate-800" />
              <div className="h-3 w-12 rounded bg-slate-800" />
            </div>
            <div className="h-8 w-20 rounded-lg bg-slate-800" />
            <div className="h-1.5 w-full rounded-full bg-slate-800" />
          </div>
        ))}
      </div>

      {/* Main Content Skeletons */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Card Skeleton */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
            <div className="flex justify-between">
              <div className="space-y-1.5">
                <div className="h-4 w-48 rounded bg-slate-800" />
                <div className="h-3 w-64 rounded bg-slate-900" />
              </div>
              <div className="h-4 w-20 rounded bg-slate-800" />
            </div>
            <div className="h-44 w-full rounded-lg bg-slate-800/40 mt-3">
              {/* Fake chart bars */}
              <div className="h-full flex items-end justify-around px-4 pb-4 gap-2">
                {[60, 80, 45, 90, 70, 85, 55, 75, 65].map((h, i) => (
                  <div key={i} className="flex-1 bg-slate-700/40 rounded-t" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>

          {/* Second chart skeleton */}
          <div className="grid grid-cols-2 gap-6">
            {[0, 1].map(i => (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
                <div className="h-4 w-36 rounded bg-slate-800" />
                <div className="h-32 w-full rounded-lg bg-slate-800/40" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Machine health skeleton */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
            <div className="h-4 w-36 rounded bg-slate-800" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                  <div className="h-3 w-36 rounded bg-slate-800" />
                  <div className="h-3 w-10 rounded bg-slate-800" />
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800" />
              </div>
            ))}
          </div>

          {/* Alerts skeleton */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
            <div className="h-4 w-36 rounded bg-slate-800" />
            {[0, 1].map(i => (
              <div key={i} className="rounded-lg border border-slate-800 p-3 space-y-1.5">
                <div className="h-3 w-32 rounded bg-slate-800" />
                <div className="h-3 w-full rounded bg-slate-900" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity log skeleton */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
        <div className="h-4 w-52 rounded bg-slate-800" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between border-b border-slate-900 pb-2 last:border-b-0">
            <div className="flex items-center gap-3">
              <div className="h-3 w-16 rounded bg-slate-800" />
              <div className="h-3 w-24 rounded bg-slate-800" />
              <div className="h-3 w-64 rounded bg-slate-900" />
            </div>
            <div className="h-4 w-16 rounded-full bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  );
}
