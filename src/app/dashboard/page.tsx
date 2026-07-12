'use client';

import React from 'react';
import { useSocket } from '../../hooks/useSocket';
import { useDashboardMetrics, useDashboardActivities } from '../../hooks/queries/useDashboard';
import { useMachines } from '../../hooks/queries/useMachines';
import { useAlerts } from '../../hooks/queries/useAlerts';
import { ApiErrorState } from '../../components/shared/ApiErrorState';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { MetricCard } from '../../components/shared/MetricCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { 
  TrendingUp, 
  Activity, 
  Clock, 
  ShieldAlert, 
  Zap, 
  ArrowUpRight,
  CheckCircle,
  History
} from 'lucide-react';

export default function ProfessionalDashboard() {
  const { telemetry, status } = useSocket('DEV-001');

  const { data: metricsSummary, isLoading: isMetricsLoading, isError: isMetricsError, refetch: refetchMetrics } = useDashboardMetrics();
  const { data: recentActivities, isLoading: isActivitiesLoading, isError: isActivitiesError, refetch: refetchActivities } = useDashboardActivities();
  const { data: machineHealthData, isLoading: isMachinesLoading, isError: isMachinesError, refetch: refetchMachines } = useMachines();
  const { data: alerts, isLoading: isAlertsLoading, isError: isAlertsError, refetch: refetchAlerts } = useAlerts({ status: 'active' });

  if (isMetricsError || isActivitiesError || isMachinesError || isAlertsError) {
    return (
      <ApiErrorState 
        message="Unable to load dashboard telemetry. Please verify backend connection."
        onRetry={() => {
          refetchMetrics();
          refetchActivities();
          refetchMachines();
          refetchAlerts();
        }}
      />
    );
  }

  if (isMetricsLoading || isActivitiesLoading || isMachinesLoading || isAlertsLoading || !metricsSummary || !machineHealthData || !recentActivities || !alerts) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <LoadingSkeleton className="h-28 w-full" />
          <LoadingSkeleton className="h-28 w-full" />
          <LoadingSkeleton className="h-28 w-full" />
          <LoadingSkeleton className="h-28 w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <LoadingSkeleton className="h-48 w-full" />
            <LoadingSkeleton className="h-48 w-full" />
          </div>
          <div className="space-y-4">
            <LoadingSkeleton className="h-64 w-full" />
            <LoadingSkeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Banner: Live Status Overview */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white uppercase">System Operations Cockpit</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">ID: DASH-PRIMARY // LOC: ROOT</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Live system state badge */}
          <Badge variant={status === 'connected' ? 'success' : 'warning'} className="uppercase">
            <span className="relative flex h-1.5 w-1.5 mr-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${status === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${status === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            SCADA LINK {status === 'connected' ? 'ACTIVE' : 'SYNCING'}
          </Badge>

          <Badge variant="slate" className="font-mono text-xs uppercase tracking-wider">
            LCL: 20:33:25
          </Badge>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Line Throughput" 
          value={metricsSummary.productionRate} 
          unit="u/hr"
          trend="+4.2% shift avg"
          trendDirection="up"
          status="ok"
        />
        <MetricCard 
          title="OEE Efficiency" 
          value={`${metricsSummary.efficiency}%`} 
          unit="ratio"
          trend="Limit nominal"
          trendDirection="neutral"
          status="ok"
        />
        <MetricCard 
          title="Active Downtime" 
          value={metricsSummary.downtime} 
          unit="min"
          trend="12m warning limit"
          trendDirection="neutral"
          status="warn"
        />
        <MetricCard 
          title="Defect Index" 
          value={`${metricsSummary.defects}%`} 
          unit="QMS"
          trend={`CRIT AT ${metricsSummary.shiftDefectLimit}%`}
          trendDirection="neutral"
          status={metricsSummary.defects > 2.5 ? 'critical' : 'ok'}
        />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left Column: Charts and Production Summary */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Downtime & Utilization SVG Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Downtime & Utilization Trend</CardTitle>
              <Badge variant="outline" className="text-[10px]">
                <ArrowUpRight className="h-3 w-3 mr-1" /> Live
              </Badge>
            </CardHeader>
            <CardContent>
              {/* Custom Responsive SVG Chart */}
              <div className="h-40 w-full mt-2 border-l border-b border-slate-800 relative">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 500 150" preserveAspectRatio="none" aria-label="Downtime & Utilization Trend Chart">
                  {/* Gridlines & Y-Axis Labels */}
                  <text x="-25" y="34" fill="#64748b" fontSize="10" fontFamily="monospace">100%</text>
                  <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeDasharray="4 4" />
                  
                  <text x="-25" y="79" fill="#64748b" fontSize="10" fontFamily="monospace">50%</text>
                  <line x1="0" y1="75" x2="500" y2="75" stroke="#1e293b" strokeDasharray="4 4" />
                  
                  <text x="-25" y="124" fill="#64748b" fontSize="10" fontFamily="monospace">0%</text>
                  <line x1="0" y1="120" x2="500" y2="120" stroke="#1e293b" strokeDasharray="4 4" />
                  
                  {/* Utilization Trend line */}
                  <path d="M 0 120 C 50 110, 80 40, 180 90 S 280 30, 360 30 S 450 60, 500 10" fill="none" stroke="#10b981" strokeWidth="2.5" />
                  <path d="M 0 120 C 50 110, 80 40, 180 90 S 280 30, 360 30 S 450 60, 500 10 L 500 150 L 0 150 Z" fill="url(#utilizationGradient)" opacity="0.3" />
                  
                  {/* Defect Trend line overlay */}
                  <path d="M 0 140 L 100 130 L 200 135 L 300 125 L 400 140 L 500 130" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
                  
                  {/* Dynamic Data Point Glow */}
                  <circle cx="360" cy="30" r="4" fill="#10b981" className="glow-green" />
                  <circle cx="360" cy="30" r="2" fill="#fff" />
                  
                  <defs>
                    <linearGradient id="utilizationGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-3 font-mono">
                <span>08:00</span>
                <span>12:00</span>
                <span>16:00</span>
                <span>20:00</span>
                <span>00:00</span>
              </div>
            </CardContent>
          </Card>

          {/* Quality Defect Trend & Production Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Defect Analysis Trend Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Quality Defect Index</CardTitle>
                <Badge variant="destructive" className="text-[10px]">Max 3.5%</Badge>
              </CardHeader>
              <CardContent>
                <div className="h-28 w-full border-l border-b border-slate-800 relative mt-2">
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 500 120" preserveAspectRatio="none" aria-label="Quality Defect Index Chart">
                    <line x1="0" y1="20" x2="500" y2="20" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" />
                    <text x="5" y="16" fill="#ef4444" fontSize="9" fontFamily="monospace">Limit (3.5%)</text>
                    
                    <path d="M 0 100 Q 50 60 100 80 T 200 95 T 350 45 T 500 65" fill="none" stroke="#f59e0b" strokeWidth="2" />
                    <circle cx="350" cy="45" r="3" fill="#f59e0b" className="glow-yellow" />
                  </svg>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-3 font-mono">
                  <span>08:00</span>
                  <span>12:00</span>
                  <span>16:00</span>
                  <span>20:00</span>
                  <span>00:00</span>
                </div>
              </CardContent>
            </Card>

            {/* Production Summary Checklist */}
            <Card>
              <CardHeader>
                <CardTitle>Shift Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase text-slate-400">
                    <span>QMS Approval</span>
                    <span className="text-emerald-400">98.9%</span>
                  </div>
                  <div className="h-1 w-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '98.9%' }}></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase text-slate-400">
                    <span>Maintenance Comp</span>
                    <span className="text-amber-400">82%</span>
                  </div>
                  <div className="h-1 w-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: '82%' }}></div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono uppercase text-slate-400 pt-2 border-t border-slate-800">
                  <span>Energy Index</span>
                  <span className="text-slate-200">12.4 kWh</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Machine Health & Active Alerts */}
        <div className="space-y-4">
          
          {/* Machine Health Widget */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-emerald-500">
                <Activity className="h-4 w-4" /> Machine Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {machineHealthData.map((m, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-tight">
                      <span className="text-slate-200 truncate pr-2">{m.name.split(' ')[0]} {m.name.split(' ')[1]}</span>
                      <span className="text-slate-500">{m.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1 flex-1 bg-slate-800 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            m.status === 'running' ? 'bg-emerald-500' :
                            m.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${m.metrics?.temperature || 0}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-mono font-bold w-6 text-right ${
                        m.status === 'running' ? 'text-emerald-400' :
                        m.status === 'warning' ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {m.metrics?.temperature || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Alerts Panel */}
          <Card className="border-red-900/50">
            <CardHeader className="bg-red-950/10 border-b-red-900/20 pb-3">
              <CardTitle className="flex items-center gap-2 text-red-500">
                <ShieldAlert className="h-4 w-4" /> Active Warnings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-3 h-[250px] overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="text-center text-xs text-slate-500 mt-8">No active alerts</div>
              ) : (
                alerts.slice(0, 5).map(alert => (
                  <div key={alert.id} className={`flex items-start gap-2 border-l-2 p-2 bg-slate-900 ${alert.level === 'error' ? 'border-red-500' : alert.level === 'warn' ? 'border-amber-500' : 'border-slate-500'}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className={`text-[10px] font-mono uppercase font-semibold ${alert.level === 'error' ? 'text-red-400' : alert.level === 'warn' ? 'text-amber-400' : 'text-slate-300'}`}>{alert.source} {alert.level}</h4>
                        <span className="text-[9px] text-slate-500 font-mono">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{alert.message}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activities Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <History className="h-4 w-4" /> Operator Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 font-mono text-[11px]">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-slate-800 last:border-0 hover:bg-slate-900/50">
                <div className="flex items-start gap-3 truncate">
                  <span className="text-slate-500 shrink-0">[{act.timestamp}]</span>
                  <span className="text-slate-300 font-semibold shrink-0">{act.user}</span>
                  <span className="text-slate-400 truncate">{act.event}</span>
                </div>
                <Badge variant={act.status} className="text-[9px] px-1 py-0 h-4 mt-1 sm:mt-0 ml-auto shrink-0 uppercase">
                  {act.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

