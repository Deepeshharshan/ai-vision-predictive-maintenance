'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { 
  ShieldAlert, 
  Search, 
  SlidersHorizontal, 
  Check, 
  X,
  Clock,
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';

import { Alert, AlertLevel, AlertStatus } from '../../../types/api';
import { useAlerts, useAcknowledgeAlert, useResolveAlert } from '../../../hooks/queries/useAlerts';
import { ApiErrorState } from '../../../components/shared/ApiErrorState';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';

const levelConfig: Record<AlertLevel, { icon: React.ElementType; variant: "destructive" | "warning" | "default"; label: string }> = {
  error: { icon: AlertCircle,   variant: 'destructive', label: 'CRITICAL' },
  warn:  { icon: AlertTriangle, variant: 'warning',     label: 'WARNING'  },
  info:  { icon: Info,          variant: 'default',     label: 'INFO'     },
};

const statusConfig: Record<AlertStatus, { label: string; variant: "destructive" | "warning" | "slate" }> = {
  active:       { label: 'ACTIVE',       variant: 'destructive' },
  acknowledged: { label: 'ACK\'D',       variant: 'warning'     },
  resolved:     { label: 'RESOLVED',     variant: 'slate'       },
};

export default function AlertsPage() {
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState<'All' | AlertLevel>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | AlertStatus>('All');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [resolveComment, setResolveComment] = useState('');
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [expandedTimelines, setExpandedTimelines] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(a => a.id)));
    }
  };

  const toggleTimeline = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTimelines(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const { data: alerts, isLoading, isError, refetch } = useAlerts({ 
    level: filterLevel === 'All' ? undefined : filterLevel, 
    status: filterStatus === 'All' ? undefined : filterStatus 
  });
  
  const { mutate: acknowledgeAlert } = useAcknowledgeAlert();
  const { mutate: resolveAlert } = useResolveAlert();

  const handleBulkAck = () => {
    selectedIds.forEach(id => acknowledgeAlert(id));
    setSelectedIds(new Set());
  };

  const handleAcknowledge = (alertId: string) => {
    acknowledgeAlert(alertId);
    if (selectedAlert?.id === alertId) {
      setSelectedAlert(prev => prev ? { ...prev, status: 'acknowledged', acknowledgedBy: 'Operator Core User' } : null);
    }
  };

  const handleResolve = () => {
    if (!selectedAlert) return;
    resolveAlert({ id: selectedAlert.id, notes: resolveComment || 'Manual resolution dispatched.' });
    setSelectedAlert({ ...selectedAlert, status: 'resolved' });
    setResolveComment('');
    setShowResolveDialog(false);
  };

  const filtered = (alerts || []).filter(a => {
    const q = search.toLowerCase();
    const matchSearch = a.message.toLowerCase().includes(q) || a.source.toLowerCase().includes(q) || a.id.toLowerCase().includes(q);
    return matchSearch;
  });

  const filteredAlerts = filtered;

  const countByLevel = (lvl: AlertLevel) => (alerts || []).filter(a => a.level === lvl && a.status === 'active').length;

  if (isError) {
    return <ApiErrorState message="Failed to load system alerts." onRetry={refetch} />;
  }

  if (isLoading || !alerts) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <LoadingSkeleton className="h-[500px] xl:col-span-2" />
          <LoadingSkeleton className="h-[500px] xl:col-span-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Page Title */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white uppercase">System Alert Desk</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">Audit log of system events</p>
        </div>

        {/* Active Alert Counters */}
        <div className="flex items-center gap-2">
          <Badge variant="destructive">{countByLevel('error')} CRITICAL</Badge>
          <Badge variant="warning">{countByLevel('warn')} WARNING</Badge>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-sm border border-slate-800 bg-slate-900/50 pl-9 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterLevel}
            onChange={e => setFilterLevel(e.target.value as 'All' | AlertLevel)}
            className="rounded-sm border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-slate-500"
          >
            <option value="All">ALL SEVERITIES</option>
            <option value="error">CRITICAL</option>
            <option value="warn">WARNING</option>
            <option value="info">INFO</option>
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as 'All' | AlertStatus)}
            className="rounded-sm border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-slate-500"
          >
            <option value="All">ALL STATUSES</option>
            <option value="active">ACTIVE</option>
            <option value="acknowledged">ACKNOWLEDGED</option>
            <option value="resolved">RESOLVED</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between border border-slate-800 bg-slate-900 px-4 py-2 text-xs">
          <span className="text-slate-300 font-medium font-mono">{selectedIds.size} alert(s) selected</span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleBulkAck}>Acknowledge Selected</Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Table + Detail Split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Alert Table */}
        <div className="xl:col-span-2">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 text-center">
                    <input 
                      type="checkbox" 
                      checked={filteredAlerts.length > 0 && selectedIds.size === filteredAlerts.length}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-700 bg-slate-900/50 accent-emerald-500"
                    />
                  </TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Alert ID / Message</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map(a => {
                  const cfg = levelConfig[a.level];
                  const sCfg = statusConfig[a.status];
                  const Icon = cfg.icon;
                  const expanded = expandedTimelines.has(a.id);

                  return (
                    <React.Fragment key={a.id}>
                      <TableRow 
                        onClick={() => setSelectedAlert(a)}
                        className={`cursor-pointer ${selectedAlert?.id === a.id ? 'bg-slate-800' : ''}`}
                      >
                        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            checked={selectedIds.has(a.id)}
                            onChange={() => toggleSelection(a.id)}
                            className="rounded border-slate-700 bg-slate-900/50 accent-emerald-500"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant={cfg.variant}>{cfg.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-slate-200 font-mono text-xs">{a.id}</div>
                          <div className="text-[10px] text-slate-400 max-w-sm truncate">{a.message}</div>
                        </TableCell>
                        <TableCell className="text-[10px] font-mono">{a.source}</TableCell>
                        <TableCell>
                          <Badge variant={sCfg.variant}>{sCfg.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => toggleTimeline(a.id, e)}>
                            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expanded && (
                        <TableRow>
                          <TableCell colSpan={6} className="bg-slate-950/50 p-0 border-b-0">
                            <div className="px-10 py-3 space-y-3 font-mono text-xs">
                              {a.timeline.map((t, i) => (
                                <div key={i} className="relative pl-4 border-l-2 border-slate-800 pb-2 last:pb-0">
                                  <div className="absolute -left-1.5 top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-slate-950 bg-slate-500" />
                                  <div className="flex items-start gap-2.5 text-[10px] font-mono">
                                    <span className="text-slate-500 shrink-0">{t.time}</span>
                                    <div className="flex-1">
                                      <span className="text-slate-300">{t.action}</span>
                                      <span className="text-slate-500"> — {t.actor}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Alert Detail Drawer */}
        <div className="xl:col-span-1">
          {selectedAlert ? (
            <Card className="h-full flex flex-col">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant={levelConfig[selectedAlert.level].variant}>{levelConfig[selectedAlert.level].label}</Badge>
                    <span>{selectedAlert.id}</span>
                  </CardTitle>
                  <div className="text-[10px] font-mono text-slate-400 mt-1">Source: {selectedAlert.source}</div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedAlert(null)} className="h-6 w-6 -mr-2 -mt-2">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                {/* Message */}
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Trigger Event</span>
                  <p className="mt-1 text-xs text-slate-200 bg-slate-900/50 p-2 border border-slate-800 font-mono">
                    {selectedAlert.message}
                  </p>
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="border border-slate-800 bg-slate-900/50 p-2 text-center">
                    <span className="text-slate-500 block uppercase tracking-wider mb-0.5">Timestamp</span>
                    <span className="font-semibold text-slate-200 font-mono">{new Date(selectedAlert.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="border border-slate-800 bg-slate-900/50 p-2 text-center flex flex-col items-center justify-center">
                    <span className="text-slate-500 block uppercase tracking-wider mb-1">Status</span>
                    <Badge variant={statusConfig[selectedAlert.status].variant}>{statusConfig[selectedAlert.status].label}</Badge>
                  </div>
                </div>

                {/* Resolution Notes */}
                {selectedAlert.notes && (
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Resolution Notes</span>
                    <p className="mt-1 text-[11px] text-slate-400 bg-slate-900/50 p-2 border border-slate-800">
                      {selectedAlert.notes}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                {selectedAlert.status !== 'resolved' && (
                  <div className="pt-2 flex gap-2">
                    {selectedAlert.status === 'active' && (
                      <Button
                        variant="secondary"
                        className="flex-1 text-xs text-amber-400"
                        onClick={() => handleAcknowledge(selectedAlert.id)}
                      >
                        <ShieldAlert className="h-3 w-3 mr-1" /> ACK
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      className="flex-1 text-xs"
                      onClick={() => setShowResolveDialog(true)}
                    >
                      <Check className="h-3 w-3 mr-1" /> Resolve
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center border-dashed border-slate-700 bg-transparent text-slate-500">
              <div className="text-center font-mono text-[10px] uppercase">
                Select alert<br/>to inspect
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Resolve Confirmation Modal */}
      {showResolveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Resolve {selectedAlert?.id}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowResolveDialog(false)} className="h-6 w-6 -mr-2">
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[11px] text-slate-400 bg-slate-900/50 border border-slate-800 p-2 font-mono">
                {selectedAlert?.message}
              </p>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Resolution Notes</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Cleared sensor blockage..."
                  value={resolveComment}
                  onChange={e => setResolveComment(e.target.value)}
                  className="w-full rounded-sm border border-slate-800 bg-slate-900/50 p-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-500 resize-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <Button variant="secondary" onClick={() => setShowResolveDialog(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleResolve}>
                  Submit Resolution
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
