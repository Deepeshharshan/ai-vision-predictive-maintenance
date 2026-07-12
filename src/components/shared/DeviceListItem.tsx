import React from 'react';
import { Device } from '../../types';
import { StatusBadge } from './StatusBadge';

interface DeviceListItemProps {
  device: Device;
  onAction?: (deviceId: string, actionType: string) => void;
}

export function DeviceListItem({ device, onAction }: DeviceListItemProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition-all duration-200 hover:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 text-slate-300 ring-1 ring-slate-700/50">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-100">{device.name}</span>
            <span className="text-xs text-slate-500">ID: {device.id}</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{device.type} • {device.location}</p>
        </div>
      </div>

      {/* High density metric telemetry snapshot */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs sm:flex sm:items-center sm:gap-8">
        <div>
          <span className="text-slate-500 block">Temperature</span>
          <span className="font-medium text-slate-300">{device.metrics.temperature.toFixed(1)}°C</span>
        </div>
        <div>
          <span className="text-slate-500 block">Vibration</span>
          <span className="font-medium text-slate-300">{device.metrics.vibration.toFixed(2)} mm/s</span>
        </div>
        <div>
          <span className="text-slate-500 block">Pressure</span>
          <span className="font-medium text-slate-300">{device.metrics.pressure.toFixed(0)} kPa</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 sm:border-t-0 sm:pt-0 gap-4">
        <StatusBadge status={device.status} />
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onAction?.(device.id, 'calibrate')}
            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-300 transition duration-150 hover:bg-slate-900 hover:text-white"
          >
            Calibrate
          </button>
          <button 
            onClick={() => onAction?.(device.id, 'shutdown')}
            className="rounded-lg border border-red-500/20 bg-red-950/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition duration-150 hover:bg-red-950/30"
          >
            Shutdown
          </button>
        </div>
      </div>
    </div>
  );
}
