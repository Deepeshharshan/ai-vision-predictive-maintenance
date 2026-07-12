'use client';

import React, { useState, useEffect } from 'react';
import { useMachines } from '../../../hooks/queries/useMachines';
import { ApiErrorState } from '../../../components/shared/ApiErrorState';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { Machine } from '../../../types/api';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { 
  X, 
  FileText,
  CalendarDays,
  Activity,
  Zap,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  Power,
  Settings,
  Search,
  Filter
} from 'lucide-react';


export default function MachinesPage() {
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

  // Live metric jitter for selected machine
  const [liveMetrics, setLiveMetrics] = useState<Machine['metrics'] | null>(null);
  useEffect(() => {
    if (!selectedMachine) { setLiveMetrics(null); return; }
    setLiveMetrics(selectedMachine.metrics);
    const timer = setInterval(() => {
      setLiveMetrics(prev => prev ? {
        temperature: parseFloat((prev.temperature + (Math.random() * 2 - 1)).toFixed(1)),
        vibration:   parseFloat((prev.vibration   + (Math.random() * 0.4 - 0.2)).toFixed(2)),
        voltage:     parseFloat((prev.voltage     + (Math.random() * 1 - 0.5)).toFixed(1)),
        pressure:    parseFloat((prev.pressure    + (Math.random() * 2 - 1)).toFixed(0)),
      } : null);
    }, 1800);
    return () => clearInterval(timer);
  }, [selectedMachine?.id]);

  const { data: machines, isLoading, isError, refetch } = useMachines();

  const filtered = (machines || []).filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || m.status === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  if (isError) {
    return <ApiErrorState message="Failed to load machine inventory" onRetry={refetch} />;
  }

  if (isLoading || !machines) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <LoadingSkeleton className="h-[400px] xl:col-span-2" />
          <LoadingSkeleton className="h-[400px] xl:col-span-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white uppercase">Machine Inventory</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">Total nodes: {machines.length}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">3 ONLINE</Badge>
          <Badge variant="destructive">1 OFFLINE</Badge>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search ID or Name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-sm border border-slate-800 bg-slate-900/50 pl-9 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-500 transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="rounded-sm border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-slate-500"
        >
          <option value="All">ALL STATUS</option>
          <option value="Running">RUNNING</option>
          <option value="Warning">WARNING</option>
          <option value="Offline">OFFLINE</option>
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Table Column */}
        <div className="xl:col-span-2">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID / Node</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Health</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(m => (
                  <TableRow 
                    key={m.id} 
                    onClick={() => { setSelectedMachine(m); setActiveTab('overview'); }}
                    className={`cursor-pointer ${selectedMachine?.id === m.id ? 'bg-slate-800' : ''}`}
                  >
                    <TableCell>
                      <div className="font-semibold text-slate-200 font-mono text-xs">{m.id}</div>
                      <div className="text-[10px] text-slate-400 uppercase truncate max-w-[120px]">{m.name}</div>
                    </TableCell>
                    <TableCell className="text-[10px] uppercase">{m.location}</TableCell>
                    <TableCell>
                      <StatusBadge status={m.status} />
                    </TableCell>
                    <TableCell>
                       <div className="w-16 h-1.5 bg-slate-800 overflow-hidden">
                         <div className={`h-full ${m.status === 'running' ? 'bg-emerald-500' : m.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: m.status === 'offline' ? '0%' : m.status === 'warning' ? '70%' : '100%' }} />
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Inspector Column */}
        <div className="xl:col-span-1">
          {selectedMachine ? (
            <Card className="h-full flex flex-col">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>{selectedMachine.name}</CardTitle>
                  <div className="text-[10px] font-mono text-slate-400 mt-1">{selectedMachine.id}</div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedMachine(null)} className="h-6 w-6 -mr-2 -mt-2">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              
              <div className="flex border-b border-slate-800">
                {(['overview', 'history'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-3 text-[10px] font-mono uppercase tracking-widest border-b-2 transition -mb-px flex-1 ${activeTab === tab ? 'border-emerald-500 text-emerald-400 bg-emerald-950/10' : 'border-transparent text-slate-400 hover:bg-slate-800'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <CardContent className="flex-1 space-y-4 pt-4">
                {activeTab === 'overview' ? (
                  <>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="border border-slate-800 bg-slate-900/50 p-2">
                        <div className="text-[9px] uppercase tracking-wider text-slate-500">Op Hours</div>
                        <div className="text-xs font-bold text-slate-200 mt-0.5 font-mono">{selectedMachine.operatingHours}h</div>
                      </div>
                      <div className="border border-slate-800 bg-slate-900/50 p-2">
                        <div className="text-[9px] uppercase tracking-wider text-slate-500">Next PM</div>
                        <div className="text-xs font-bold text-slate-200 mt-0.5 font-mono">{selectedMachine.nextMaintenanceDate}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-1">Live Telemetry</h4>
                      
                      <div className="space-y-3 font-mono text-[11px] mt-2">
                        <div className="bg-slate-900/50 p-2 border border-slate-800">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-slate-400">TEMP</span>
                            <span className={liveMetrics && liveMetrics.temperature > 80 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{liveMetrics?.temperature.toFixed(1)} °C</span>
                          </div>
                          <div className="h-1 w-full bg-slate-950 overflow-hidden">
                            <div className={`h-full ${liveMetrics && liveMetrics.temperature > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, ((liveMetrics?.temperature || 0) / 100) * 100)}%` }} />
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-2 border border-slate-800">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-slate-400">VIBE</span>
                            <span className={liveMetrics && liveMetrics.vibration > 6 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>{liveMetrics?.vibration.toFixed(2)} mm/s</span>
                          </div>
                          <div className="h-1 w-full bg-slate-950 overflow-hidden">
                            <div className={`h-full ${liveMetrics && liveMetrics.vibration > 6 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, ((liveMetrics?.vibration || 0) / 10) * 100)}%` }} />
                          </div>
                        </div>
                        <div className="flex justify-between items-center bg-slate-900/50 p-2 border border-slate-800">
                          <span className="text-slate-400">VOLT</span>
                          <span className="text-emerald-400 font-bold">{liveMetrics?.voltage.toFixed(1)} V</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <Button variant="secondary" className="flex-1 text-xs"><Settings className="h-3 w-3 mr-1" /> CFG</Button>
                      <Button variant="destructive" className="flex-1 text-xs font-bold"><Power className="h-3 w-3 mr-1" /> ESTOP</Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4 font-mono text-xs pt-2">
                    {selectedMachine.maintenance.map((log, idx) => (
                      <div key={idx} className="relative pl-4 border-l-2 border-slate-800 pb-2 last:pb-0">
                        <div className={`absolute -left-1.5 top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-slate-950 ${log.resolved ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                        <div className="flex justify-between items-start text-[10px] mb-1">
                          <Badge variant={log.type === 'Emergency' ? 'destructive' : log.type === 'Corrective' ? 'warning' : 'default'} className="px-1 py-0 h-4">{log.type}</Badge>
                          <span className="text-slate-500">{log.date}</span>
                        </div>
                        <div className="text-slate-300 mt-1.5 text-[11px] font-sans">{log.notes}</div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[9px] text-slate-500 bg-slate-900 px-1.5 py-0.5">ENG: {log.engineer}</span>
                          <span className="text-[9px] text-slate-500 bg-slate-900 px-1.5 py-0.5">DUR: {log.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center border-dashed border-slate-700 bg-transparent text-slate-500">
              <div className="text-center font-mono text-[10px] uppercase">
                Select node<br/>to inspect
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
