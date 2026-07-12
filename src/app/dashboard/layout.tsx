'use client';

import React, { useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar Nav */}
      <Sidebar 
        onCollapseChange={setCollapsed} 
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main viewport area */}
      <div 
        className={`flex flex-col min-h-screen transition-all duration-300 
          ${collapsed ? 'md:pl-16' : 'md:pl-64'} 
          pl-0
        `}
      >
        {/* Top Header */}
        <Header onMenuToggle={() => setMobileOpen(!mobileOpen)} />

        {/* Content Frame */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
