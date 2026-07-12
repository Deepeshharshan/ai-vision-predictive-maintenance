'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Video, 
  Cpu, 
  AlertTriangle, 
  BarChart3, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ onCollapseChange, mobileOpen = false, onCloseMobile }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    if (onCollapseChange) {
      onCollapseChange(nextState);
    }
  };

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Live Cameras', href: '/dashboard/cameras', icon: Video },
    { name: 'Machines', href: '/dashboard/machines', icon: Cpu },
    { name: 'Alert Desk', href: '/dashboard/alerts', icon: AlertTriangle },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Reports', href: '/dashboard/reports', icon: FileText },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside 
        className={`fixed top-0 left-0 z-50 flex h-screen flex-col border-r border-slate-900 bg-slate-950/80 backdrop-blur-xl transition-all duration-300 
          ${isCollapsed ? 'md:w-16' : 'md:w-64'} 
          ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-900/60">
          {(!isCollapsed || mobileOpen) && (
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 glow-green"></span>
              <span className="font-bold tracking-wider text-white">KRONOS v1.2</span>
            </div>
          )}
          {isCollapsed && !mobileOpen && (
            <div className="mx-auto h-2.5 w-2.5 rounded-full bg-emerald-500 glow-green"></div>
          )}
          
          <div className="flex items-center gap-1">
            {/* Close button for mobile menu */}
            {mobileOpen && (
              <button 
                onClick={onCloseMobile}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white md:hidden"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            
            {/* Collapse toggle for desktop menu */}
            <button 
              onClick={toggleSidebar}
              className="hidden md:block rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Nav Menu */}
        <nav className="flex-1 space-y-1.5 px-3 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
                    : 'text-slate-400 border border-transparent hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {(!isCollapsed || mobileOpen) && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="border-t border-slate-900/60 p-3">
          <button
            onClick={() => {
              localStorage.removeItem('monitoring_session');
              window.location.href = '/login';
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-400 hover:bg-red-950/20 hover:text-red-400 transition"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {(!isCollapsed || mobileOpen) && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
