'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { MetricCard } from '../../../components/shared/MetricCard';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Clock, 
  Flame, 
  Download,
  RefreshCw,
  Activity,
  Zap,
  Target
} from 'lucide-react';

type TimeRange = '24h' | '7d' | '30d';

const weeklyOEE = [
  { day: 'Mon', active: 85, idle: 10, down: 5,  oee: 85 },
  { day: 'Tue', active: 90, idle: 5,  down: 5,  oee: 90 },
  { day: 'Wed', active: 75, idle: 15, down: 10, oee: 75 },
  { day: 'Thu', active: 88, idle: 8,  down: 4,  oee: 88 },
  { day: 'Fri', active: 92, idle: 4,  down: 4,  oee: 92 },
  { day: 'Sat', active: 95, idle: 3,  down: 2,  oee: 95 },
  { day: 'Sun', active: 80, idle: 10, down: 10, oee: 80 },
];

const mtbfData = [
  { machine: 'DEV-001 Rotary Fan',   mtbf: 720,  lastFailure: '2026-06-15', trend: 'up'   },
  { machine: 'DEV-002 Hydraulic',    mtbf: 480,  lastFailure: '2026-07-05', trend: 'down' },
  { machine: 'DEV-003 Power Feed',   mtbf: 2160, lastFailure: '2026-05-30', trend: 'up'   },
  { machine: 'DEV-004 Lubricator',   mtbf: 360,  lastFailure: '2026-07-08', trend: 'down' },
];

const defectCategories = [
  { label: 'Surface Cracks',     count: 14, pct: 38, color: 'bg-red-500' },
  { label: 'Misalignment',       count: 9,  pct: 24, color: 'bg-amber-500' },
  { label: 'Seal Defects',       count: 7,  pct: 19, color: 'bg-orange-500' },
  { label: 'Thermal Anomalies',  count: 5,  pct: 14, color: 'bg-yellow-500' },
  { label: 'False Positives',    count: 2,  pct: 5,  color: 'bg-slate-500' },
];

const downtimeEvents = [
  { date: '2026-07-08', machine: 'DEV-004', duration: 'ONGOING', type: 'Emergency', cost: 'High' },
  { date: '2026-07-05', machine: 'DEV-002', duration: '3h 00m',  type: 'Corrective', cost: 'Medium' },
  { date: '2026-07-01', machine: 'DEV-001', duration: '2h 15m',  type: 'Preventative', cost: 'Low' },
  { date: '2026-06-20', machine: 'DEV-002', duration: '1h 00m',  type: 'Inspection', cost: 'Low' },
  { date: '2026-06-15', machine: 'DEV-001', duration: '4h 30m',  type: 'Emergency', cost: 'High' },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [exporting, setExporting] = useState(false);

  const handleExport = (type: 'pdf' | 'excel') => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      alert(`${type.toUpperCase()} analytics report compiled successfully.`);
    }, 2000);
  };

  const avgOEE = Math.round(weeklyOEE.reduce((s, d) => s + d.oee, 0) / weeklyOEE.length);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white uppercase">Diagnostic Analytics</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">OEE, MTBF, defect analysis</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex border border-slate-800">
            {(['24h', '7d', '30d'] as TimeRange[]).map(r => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 text-[10px] font-mono uppercase transition ${timeRange === r ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                {r}
              </button>
            ))}
          </div>
          <Button variant="secondary" size="sm" onClick={() => handleExport('pdf')} disabled={exporting}>
            {exporting ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <Download className="h-3 w-3 mr-1" />}
            Export
          </Button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Avg OEE (7d)" value={`${avgOEE}%`} unit="ratio" trend="+2.1% vs prior" trendDirection="up" status="ok" />
        <MetricCard title="Total Downtime" value="10h 45m" unit="hours" trend="3 unplanned" trendDirection="neutral" status="warn" />
        <MetricCard title="AI Defect Events" value="37" unit="events" trend="2 false positives" trendDirection="neutral" status="ok" />
        <MetricCard title="Energy Index" value="12.4" unit="kWh" trend="Nominal" trendDirection="neutral" status="ok" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* OEE Stacked Bar Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Line OEE Utilization</CardTitle>
            <BarChart3 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="h-40 flex items-end justify-between gap-2 px-1 mt-2">
              {weeklyOEE.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] font-mono text-slate-400">{d.oee}%</span>
                  <div className="w-full flex flex-col-reverse h-32 overflow-hidden bg-slate-800">
                    <div className="bg-emerald-500 transition-all duration-700" style={{ height: `${d.active}%` }} />
                    <div className="bg-amber-500 transition-all duration-700" style={{ height: `${d.idle}%` }} />
                    <div className="bg-red-500 transition-all duration-700" style={{ height: `${d.down}%` }} />
                  </div>
                  <span className="text-[9px] text-slate-500 font-medium">{d.day}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 text-[10px] text-slate-400 mt-3 border-t border-slate-800 pt-2">
              <span className="flex items-center gap-1"><span className="h-2 w-2 bg-emerald-500" />Active</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 bg-amber-500" />Idle</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 bg-red-500" />Down</span>
            </div>
          </CardContent>
        </Card>

        {/* Defect Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>AI Defect Distribution</CardTitle>
            <Flame className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5 mt-2">
              {defectCategories.map((cat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">{cat.label}</span>
                    <span className="font-mono text-slate-400">{cat.count} ({cat.pct}%)</span>
                  </div>
                  <div className="h-1 w-full bg-slate-800 overflow-hidden">
                    <div className={`h-full ${cat.color} transition-all duration-700`} style={{ width: `${cat.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Defect SVG Trend */}
            <div className="mt-4 h-32 w-full border-l border-b border-slate-800 relative">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 500 100" preserveAspectRatio="none" aria-label="Defect Rate Trend Chart">
                {/* Y-Axis Labels */}
                <text x="5" y="24" fill="#64748b" fontSize="10" fontFamily="monospace">Limit (3.5%)</text>
                
                {/* Gridlines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                
                {/* Defect Trend line */}
                <path d="M 0 90 Q 100 60 200 75 T 350 30 T 500 50" fill="none" stroke="#f59e0b" strokeWidth="2" />
                <path d="M 0 90 Q 100 60 200 75 T 350 30 T 500 50 L 500 100 L 0 100 Z" fill="url(#defectGradient)" opacity="0.2" />
                
                {/* Data Points */}
                <circle cx="350" cy="30" r="4" fill="#f59e0b" className="glow-yellow" />
                <circle cx="350" cy="30" r="2" fill="#fff" />
                
                <defs>
                  <linearGradient id="defectGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-3 font-mono">
              <span>Day 1</span>
              <span>Day 3</span>
              <span>Day 5</span>
              <span>Day 7</span>
            </div>
          </CardContent>
        </Card>

        {/* MTBF Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>MTBF Analysis</CardTitle>
            <Activity className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Machine</TableHead>
                  <TableHead>Last Failure</TableHead>
                  <TableHead className="text-right">MTBF</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mtbfData.map((m, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-semibold text-slate-200 text-[11px] truncate">{m.machine}</TableCell>
                    <TableCell className="font-mono text-[10px] text-slate-500">{m.lastFailure}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="text-[11px] font-bold text-white font-mono">{m.mtbf}h</span>
                        {m.trend === 'up'
                          ? <TrendingUp className="h-3 w-3 text-emerald-400" />
                          : <TrendingDown className="h-3 w-3 text-red-400" />}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Downtime Events Log */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Downtime Events Register</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Machine</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {downtimeEvents.map((e, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-[10px]">{e.date.slice(5)}</TableCell>
                    <TableCell className="font-mono text-[10px]">{e.machine}</TableCell>
                    <TableCell className={`font-mono text-[10px] font-bold ${e.duration === 'ONGOING' ? 'text-red-400' : ''}`}>{e.duration}</TableCell>
                    <TableCell>
                      <Badge variant={e.cost === 'High' ? 'destructive' : e.cost === 'Medium' ? 'warning' : 'success'}>{e.cost}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
