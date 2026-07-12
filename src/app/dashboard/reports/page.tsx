'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import {
  FileText,
  RefreshCw,
  CheckCircle2,
  Printer,
  FileSpreadsheet,
  X
} from 'lucide-react';

type ReportPeriod = 'daily' | 'weekly' | 'monthly';

interface ReportEntry {
  id: string;
  title: string;
  period: ReportPeriod;
  date: string;
  generatedAt: string;
  status: 'ready' | 'generating' | 'scheduled';
  kpis: { label: string; value: string; change: string; direction: 'up' | 'down' | 'neutral' }[];
  size: string;
}

const REPORTS: ReportEntry[] = [
  {
    id: 'RPT-2026-07-09', title: 'Daily Operations Report', period: 'daily', date: '2026-07-09', generatedAt: '23:59:00', status: 'ready', size: '1.2 MB',
    kpis: [
      { label: 'Line Throughput', value: '485 units/hr', change: '+4.2%', direction: 'up' },
      { label: 'OEE Efficiency',  value: '94.2%',        change: '+0.8%', direction: 'up' },
      { label: 'Downtime',        value: '12 min',       change: '-3 min', direction: 'up' },
      { label: 'Defect Rate',     value: '2.1%',         change: '-0.2%', direction: 'up' },
    ]
  },
  {
    id: 'RPT-2026-07-08', title: 'Daily Operations Report', period: 'daily', date: '2026-07-08', generatedAt: '23:59:00', status: 'ready', size: '1.1 MB',
    kpis: [
      { label: 'Line Throughput', value: '465 units/hr', change: '-1.2%', direction: 'down' },
      { label: 'OEE Efficiency',  value: '89.5%',        change: '-2.1%', direction: 'down' },
      { label: 'Downtime',        value: '45 min',       change: '+30 min', direction: 'down' },
      { label: 'Defect Rate',     value: '2.3%',         change: '+0.1%', direction: 'down' },
    ]
  },
  {
    id: 'RPT-W27-2026', title: 'Weekly Performance Summary', period: 'weekly', date: '2026-W27 (Jun 30 – Jul 6)', generatedAt: '00:05:00', status: 'ready', size: '3.8 MB',
    kpis: [
      { label: 'Avg OEE',         value: '87.4%',        change: '+1.2%', direction: 'up' },
      { label: 'Total Downtime',  value: '3h 20m',       change: '-45m',  direction: 'up' },
      { label: 'Defect Events',   value: '37 detected',  change: '-5',    direction: 'up' },
      { label: 'PM Compliance',   value: '82%',          change: '+6%',   direction: 'up' },
    ]
  },
  {
    id: 'RPT-2026-06', title: 'Monthly Compliance & QMS Report', period: 'monthly', date: 'June 2026', generatedAt: '00:10:00', status: 'ready', size: '8.4 MB',
    kpis: [
      { label: 'Overall OEE',     value: '88.2%',        change: '+2.4%', direction: 'up' },
      { label: 'Total Downtime',  value: '14h 10m',      change: '-2h',   direction: 'up' },
      { label: 'AI Inspections',  value: '1,204',        change: '+104',  direction: 'up' },
      { label: 'MTBF Avg',        value: '930 hrs',      change: '+40h',  direction: 'up' },
    ]
  },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>('daily');
  const [previewReport, setPreviewReport] = useState<ReportEntry | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [exportType, setExportType] = useState<'pdf' | 'excel' | null>(null);

  const filtered = REPORTS.filter(r => r.period === period);

  const handleExport = (report: ReportEntry, type: 'pdf' | 'excel') => {
    setExportingId(report.id);
    setExportType(type);
    setTimeout(() => {
      setExportingId(null);
      setExportType(null);
      alert(`${type.toUpperCase()} export complete: ${report.title} (${report.date})\nFile size: ${report.size}`);
    }, 2200);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white uppercase">Compliance Reports</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">{REPORTS.filter(r => r.status === 'ready').length} documents ready</p>
        </div>
        <Badge variant="success">
          <CheckCircle2 className="h-3 w-3 mr-1" /> {REPORTS.filter(r => r.status === 'ready').length} READY
        </Badge>
      </div>

      {/* Period Tabs */}
      <div className="flex border-b border-slate-800">
        {[
          { key: 'daily' as ReportPeriod,   label: 'DAILY' },
          { key: 'weekly' as ReportPeriod,  label: 'WEEKLY' },
          { key: 'monthly' as ReportPeriod, label: 'MONTHLY' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => { setPeriod(tab.key); setPreviewReport(null); }}
            className={`py-2 px-4 text-[10px] font-mono uppercase tracking-widest border-b-2 transition -mb-px ${period === tab.key ? 'border-emerald-500 text-emerald-400 bg-emerald-950/10' : 'border-transparent text-slate-400 hover:bg-slate-800'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Report List */}
        <div className="xl:col-span-1">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report / Date</TableHead>
                  <TableHead className="text-right">Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(report => (
                  <TableRow
                    key={report.id}
                    onClick={() => setPreviewReport(report)}
                    className={`cursor-pointer ${previewReport?.id === report.id ? 'bg-slate-800' : ''}`}
                  >
                    <TableCell>
                      <div className="font-semibold text-slate-200 font-mono text-xs">{report.id}</div>
                      <div className="text-[10px] text-slate-400 truncate">{report.title}</div>
                      <div className="text-[9px] text-slate-500 font-mono mt-0.5">{report.date}</div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-[10px]">
                      {report.size}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Report Preview Pane */}
        <div className="xl:col-span-2">
          {previewReport ? (
            <Card className="h-full flex flex-col">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>{previewReport.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-slate-400">
                    <span>{previewReport.id}</span>
                    <span>·</span>
                    <span>{previewReport.date}</span>
                    <Badge variant="success" className="text-[9px] px-1">READY</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => handleExport(previewReport, 'pdf')} disabled={exportingId === previewReport.id}>
                    {exportingId === previewReport.id && exportType === 'pdf'
                      ? <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                      : <Printer className="h-3 w-3 mr-1" />
                    }
                    PDF
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => handleExport(previewReport, 'excel')} disabled={exportingId === previewReport.id}>
                    {exportingId === previewReport.id && exportType === 'excel'
                      ? <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                      : <FileSpreadsheet className="h-3 w-3 mr-1" />
                    }
                    Excel
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setPreviewReport(null)} className="h-6 w-6">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {exportingId === previewReport.id && (
                <div className="mx-4 mb-2 border border-emerald-500/20 bg-emerald-950/10 p-2 flex items-center gap-2 text-xs text-emerald-400 font-mono">
                  <RefreshCw className="h-3 w-3 animate-spin shrink-0" />
                  Compiling {exportType?.toUpperCase()} document...
                </div>
              )}

              <CardContent className="flex-1 space-y-4">
                <div>
                  <h3 className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2">Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {previewReport.kpis.map((k, i) => (
                      <div key={i} className="border border-slate-800 bg-slate-900/50 p-2">
                        <div className="text-[9px] uppercase tracking-wider text-slate-500">{k.label}</div>
                        <div className="text-sm font-bold text-white font-mono mt-0.5">{k.value}</div>
                        <div className={`text-[10px] font-mono mt-0.5 ${k.direction === 'up' ? 'text-emerald-400' : k.direction === 'down' ? 'text-red-400' : 'text-slate-400'}`}>
                          {k.direction === 'up' ? '▲' : k.direction === 'down' ? '▼' : '—'} {k.change}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2">Document Preview</h3>
                  <div className="bg-slate-950 border border-slate-800 p-4 space-y-3 font-mono text-[10px] text-slate-400">
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <div>
                        <div className="text-white font-bold text-xs font-sans uppercase tracking-wider">KRONOS INDUSTRIAL MONITORING</div>
                        <div className="text-slate-500">{previewReport.title} – {previewReport.date}</div>
                      </div>
                      <div className="text-right text-slate-500">
                        <div>{previewReport.id}</div>
                        <div>Generated: {previewReport.generatedAt}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-slate-500 uppercase text-[9px] mb-1">SECTION 1 – PRODUCTION</div>
                        <div className="space-y-0.5">
                          {previewReport.kpis.map((k, i) => (
                            <div key={i} className="flex justify-between">
                              <span>{k.label}:</span>
                              <span className="text-slate-200">{k.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500 uppercase text-[9px] mb-1">SECTION 2 – MAINTENANCE</div>
                        <div className="space-y-0.5">
                          <div className="flex justify-between"><span>PM Events:</span><span className="text-slate-200">3 scheduled</span></div>
                          <div className="flex justify-between"><span>Emergency:</span><span className="text-slate-200">1 event</span></div>
                          <div className="flex justify-between"><span>Compliance:</span><span className="text-emerald-400">82%</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-slate-800 pt-2 text-[9px] text-slate-600 uppercase">
                      CONFIDENTIAL — INDUSTRIAL MONITORING SYSTEM — KRONOS v1.2 — AUTO-GENERATED COMPLIANCE DOCUMENT
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center border-dashed border-slate-700 bg-transparent text-slate-500">
              <div className="text-center font-mono text-[10px] uppercase">
                Select report<br/>to preview
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
