'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { CameraStream } from '../../../types/api';
import { useCameras, useRestartStream } from '../../../hooks/queries/useCameras';
import { ApiErrorState } from '../../../components/shared/ApiErrorState';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { 
  Video, 
  Maximize2, 
  Minimize2, 
  Activity, 
  AlertCircle,
  Eye,
  RefreshCw,
  X,
  Cpu,
  Tv,
  Settings,
  SlidersHorizontal
} from 'lucide-react';

export default function CamerasPage() {
  const [filterLocation, setFilterLocation] = useState('All');
  const [fullscreenCamera, setFullscreenCamera] = useState<string | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<CameraStream | null>(null);
  const [showAIOverlay, setShowAIOverlay] = useState(true);

  const { data: streams, isLoading, isError, refetch } = useCameras({ location: filterLocation === 'All' ? undefined : filterLocation });
  const { mutate: restartStream } = useRestartStream();

  const handleRestartStream = (camId: string) => {
    restartStream(camId);
  };

  const safeStreams = streams || [];
  
  const filteredCameras = filterLocation === 'All'
    ? safeStreams
    : safeStreams.filter(c => c.location === filterLocation);

  const activeFullscreen = safeStreams.find(s => s.id === fullscreenCamera);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white uppercase">Live CV Feeds</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            {streams?.filter(s => s.status === 'online').length || 0} online · {streams?.filter(s => s.status === 'offline').length || 0} offline
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAIOverlay(!showAIOverlay)}
            className={`px-2.5 py-1.5 border text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 transition ${
              showAIOverlay
                ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="h-3 w-3" />
            AI {showAIOverlay ? 'ON' : 'OFF'}
          </button>
          <select
            value={filterLocation}
            onChange={e => setFilterLocation(e.target.value)}
            className="rounded-sm border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-[10px] font-mono text-slate-300 focus:outline-none focus:border-slate-500"
          >
            <option value="All">ALL LOCATIONS</option>
            <option value="Section A - Assembly Line">SEC A</option>
            <option value="Section B - Packaging">SEC B</option>
            <option value="Section C - Welding">SEC C</option>
            <option value="Main Substation">SUBSTATION</option>
          </select>
        </div>
      </div>

      {isError && (
        <ApiErrorState message="Failed to load camera feeds" onRetry={refetch} />
      )}

      {(isLoading || !streams) && !isError && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <LoadingSkeleton className="h-64 w-full" />
            <LoadingSkeleton className="h-64 w-full" />
          </div>
          <div className="xl:col-span-1">
            <LoadingSkeleton className="h-96 w-full" />
          </div>
        </div>
      )}

      {/* Main Layout: Camera Grid + Inspector */}
      {streams && !isError && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">

        {/* Camera Grid */}
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCameras.map(cam => (
            <Card key={cam.id} className="flex flex-col">
              {/* Camera Header */}
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <Video className={`h-4 w-4 shrink-0 ${cam.status === 'online' ? 'text-emerald-500' : 'text-slate-500'}`} />
                  <div>
                    <CardTitle className="text-xs">{cam.name}</CardTitle>
                    <span className="text-[10px] text-slate-500 font-mono">{cam.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {cam.status === 'online' ? (
                    <div className="flex gap-1 items-center">
                      <Badge variant="destructive" className="text-[9px] px-1.5 animate-none bg-red-950/40 text-red-400 border-red-900/50">
                        <span className="h-1 w-1 rounded-full bg-red-500 animate-pulse mr-1" />REC
                      </Badge>
                      <Badge variant="success" className="text-[9px] px-1.5 bg-emerald-950/40 text-emerald-400 border-emerald-900/50">LIVE</Badge>
                    </div>
                  ) : (
                    <Badge variant="slate" className="text-[9px] px-1.5">OFFLINE</Badge>
                  )}
                  <button
                    onClick={() => setFullscreenCamera(cam.id)}
                    className="text-slate-500 hover:text-white transition"
                    title="Fullscreen"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                {/* Viewport */}
                <div className="relative aspect-video w-full bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden group">
                  {cam.status === 'online' ? (
                    <>
                      {/* Grid noise overlay */}
                      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

                      {/* AI detection bounding boxes */}
                      {showAIOverlay && cam.detections.map((det, idx) => {
                        const [x, y, w, h] = det.box;
                        return (
                          <div
                            key={idx}
                            className="absolute border border-red-500 bg-red-500/5"
                            style={{
                              left: `${(x / 600) * 100}%`,
                              top: `${(y / 400) * 100}%`,
                              width: `${(w / 600) * 100}%`,
                              height: `${(h / 400) * 100}%`
                            }}
                          >
                            <span className="absolute -top-4 left-0 bg-red-500 px-1 text-[8px] font-bold text-white uppercase whitespace-nowrap">
                              {det.label} ({(det.confidence * 100).toFixed(0)}%)
                            </span>
                          </div>
                        );
                      })}

                      {/* Telemetry strip */}
                      <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1.5 bg-slate-950/80 px-1.5 py-0.5 text-[8px] font-mono text-slate-400">
                        <span>{cam.resolution}</span>
                        <span className="text-slate-600">|</span>
                        <span>{cam.fps} FPS</span>
                        <span className="text-slate-600">|</span>
                        <span>{cam.bitrate}</span>
                      </div>

                      {/* Hover inspect */}
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setSelectedCamera(cam)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> Inspect
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-2">
                      <AlertCircle className="h-7 w-7 text-red-500 mx-auto animate-pulse" />
                      <div className="text-[10px] font-mono text-slate-400 uppercase">No Signal</div>
                      <button
                        onClick={() => handleRestartStream(cam.id)}
                        className="inline-flex items-center gap-1 border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] text-slate-300 hover:text-white"
                      >
                        <RefreshCw className="h-3 w-3" /> Reconnect
                      </button>
                    </div>
                  )}
                </div>

                {/* Status Footer */}
                <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Activity className="h-3 w-3 text-emerald-500" />
                    Health:
                    <strong className={cam.health > 80 ? 'text-emerald-400' : cam.health > 50 ? 'text-amber-400' : 'text-red-400'}>
                      {cam.health}%
                    </strong>
                  </span>
                  <span className="text-slate-500">{cam.id}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Inspector Panel */}
        <div className="xl:col-span-1">
          {selectedCamera ? (
            <Card className="h-full flex flex-col">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-xs">{selectedCamera.id}</CardTitle>
                  <div className="text-[10px] font-mono text-slate-400 mt-1 truncate">{selectedCamera.name}</div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedCamera(null)} className="h-6 w-6 -mr-2 -mt-2">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                {/* Telemetry */}
                <div>
                  <h4 className="text-[9px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-1 mb-2">Telemetry</h4>
                  <div className="space-y-1 font-mono text-[11px]">
                    {[
                      { label: 'FPS', value: `${selectedCamera.fps}` },
                      { label: 'BITRATE', value: selectedCamera.bitrate },
                      { label: 'RES', value: selectedCamera.resolution },
                      { label: 'HEALTH', value: `${selectedCamera.health}%` },
                      { label: 'UPTIME', value: selectedCamera.uptime },
                      { label: 'RECORDING', value: 'ACTIVE (NVR-1)' },
                      { label: 'HEARTBEAT', value: '2s ago' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-center bg-slate-900/50 p-1.5 border border-slate-800/50">
                        <span className="text-slate-400">{label}</span>
                        <span className="text-emerald-400 font-bold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hardware Link */}
                <div>
                  <h4 className="text-[9px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-1 mb-2">Hardware Node</h4>
                  <div className="flex items-center justify-between bg-slate-900/50 p-2 text-[11px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <Cpu className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-slate-200">
                        {selectedCamera.assignedMachine ? selectedCamera.assignedMachine.id : 'UNASSIGNED'}
                      </span>
                    </div>
                    {selectedCamera.assignedMachine && (
                      <button
                        onClick={() => window.location.href = '/dashboard/machines'}
                        className="text-emerald-400 hover:underline text-[10px]"
                      >
                        Inspect →
                      </button>
                    )}
                  </div>
                </div>

                {/* AI Model */}
                <div>
                  <h4 className="text-[9px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-1 mb-2">AI Model</h4>
                  <div className="space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between bg-slate-900/50 p-1.5">
                      <span className="text-slate-400">Status</span>
                      <span className="text-emerald-400">Running</span>
                    </div>
                    <div className="flex justify-between bg-slate-900/50 p-1.5">
                      <span className="text-slate-400">Model</span>
                      <span className="text-slate-300">yolov8-qms</span>
                    </div>
                    <div className="flex justify-between bg-slate-900/50 p-1.5 border border-slate-800/50">
                      <span className="text-slate-400">Latency</span>
                      <span className="text-slate-300">12 ms</span>
                    </div>
                    <div className="flex justify-between bg-slate-900/50 p-1.5 border border-slate-800/50">
                      <span className="text-slate-400">Inference FPS</span>
                      <span className="text-emerald-400">30.2</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex gap-2">
                  <Button variant="secondary" className="flex-1 text-xs" onClick={() => handleRestartStream(selectedCamera.id)}>
                    <RefreshCw className="h-3 w-3 mr-1" /> Restart
                  </Button>
                  <Button variant="primary" className="flex-1 text-xs">
                    <Settings className="h-3 w-3 mr-1" /> Config
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-64 flex items-center justify-center border-dashed border-slate-700 bg-transparent text-slate-500">
              <div className="text-center font-mono text-[10px] uppercase">
                <Tv className="h-6 w-6 mx-auto mb-2 stroke-[1.5]" />
                Select camera<br/>to inspect
              </div>
            </Card>
          )}
        </div>
      </div>
      )}

      {/* Fullscreen Modal */}
      {fullscreenCamera && activeFullscreen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 shrink-0">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-emerald-500" />
              <div>
                <h2 className="text-sm font-bold text-white">{activeFullscreen.name}</h2>
                <span className="text-xs text-slate-500 font-mono">{activeFullscreen.location} · {activeFullscreen.id}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-1">
                {activeFullscreen.fps} FPS · {activeFullscreen.resolution} · {activeFullscreen.bitrate}
              </span>
              <button
                onClick={() => setFullscreenCamera(null)}
                className="border border-slate-700 bg-slate-900 p-2 text-slate-400 hover:text-white"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative w-full bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

            {showAIOverlay && activeFullscreen.detections.map((det, idx) => {
              const [x, y, w, h] = det.box;
              return (
                <div
                  key={idx}
                  className="absolute border-2 border-red-500 bg-red-500/10"
                  style={{
                    left: `${(x / 600) * 100}%`,
                    top: `${(y / 400) * 100}%`,
                    width: `${(w / 600) * 100}%`,
                    height: `${(h / 400) * 100}%`
                  }}
                >
                  <span className="absolute -top-6 left-0 bg-red-500 px-2 py-0.5 text-xs font-bold text-white uppercase whitespace-nowrap">
                    {det.label} ({(det.confidence * 100).toFixed(0)}%)
                  </span>
                </div>
              );
            })}

            {activeFullscreen.status === 'offline' && (
              <div className="text-center space-y-2">
                <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
                <div className="text-sm font-mono text-slate-400 uppercase">Stream Disconnected</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
