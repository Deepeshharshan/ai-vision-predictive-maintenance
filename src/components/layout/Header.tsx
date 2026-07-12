'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  User, 
  Wifi, 
  Settings,
  ShieldAlert,
  Menu
} from 'lucide-react';

interface HeaderProps {
  status?: 'connected' | 'reconnecting' | 'disconnected';
  onMenuToggle?: () => void;
}

export function Header({ status = 'connected', onMenuToggle }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifications = [
    { id: '1', type: 'error', text: 'Critical Vibration on Shaft Fan DEV-001', time: '2m ago' },
    { id: '2', type: 'warning', text: 'Calibration deviation warning on DEV-002', time: '15m ago' },
    { id: '3', type: 'info', text: 'System diagnostics complete. All modules healthy.', time: '1h ago' },
  ];

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-900 bg-slate-950/80 px-4 md:px-6 backdrop-blur-xl">
      {/* Search & Hamburger Menu */}
      <div className="flex items-center gap-2 flex-1 max-w-xs md:max-w-md">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white md:hidden"
          title="Toggle Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Search className="h-4 w-4" />
          </span>
          <input 
            type="text" 
            placeholder="Search devices, alerts, parameters..."
            className="w-full rounded-lg border border-slate-800 bg-slate-900/40 py-1.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
          />
        </div>
      </div>

      {/* Operations Controls */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Network Status indicator */}
        <div className="hidden items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/40 px-2.5 py-1 text-xs text-slate-400 sm:flex">
          <Wifi className={`h-3.5 w-3.5 ${status === 'connected' ? 'text-emerald-500 glow-green' : 'text-amber-500'}`} />
          <span className="font-semibold">{status === 'connected' ? 'SCADA LINK LIVE' : 'SYNCING'}</span>
        </div>

        {/* Notifications Panel */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-emerald-500 glow-green"></span>
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-2xl ring-1 ring-black/5 z-45">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Live Feed Alerts</h3>
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div key={n.id} className="flex items-start gap-2.5 border-b border-slate-900/60 pb-2.5 last:border-b-0 last:pb-0">
                      <ShieldAlert className={`h-4 w-4 shrink-0 ${n.type === 'error' ? 'text-red-400' : n.type === 'warning' ? 'text-amber-400' : 'text-emerald-400'}`} />
                      <div className="flex-1 text-xs">
                        <p className="text-slate-200">{n.text}</p>
                        <span className="text-[10px] text-slate-500 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Account Menu */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 p-1.5 pr-2.5 text-xs text-slate-200 hover:bg-slate-900 hover:text-white transition"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-white font-bold">
              OP
            </div>
            <span className="hidden font-medium md:inline-block">Operator Core</span>
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-2xl z-45">
                <button 
                  onClick={() => {
                    setShowUserMenu(false);
                    window.location.href = '/dashboard/settings';
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-slate-900 transition"
                >
                  <Settings className="h-4 w-4" />
                  Console Settings
                </button>
                <button 
                  onClick={() => {
                    localStorage.removeItem('monitoring_session');
                    window.location.href = '/login';
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-950/20 transition"
                >
                  <User className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
