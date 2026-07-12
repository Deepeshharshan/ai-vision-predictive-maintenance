import React from 'react';
import './globals.css';
import { QueryProvider } from '../providers/QueryProvider';

export const metadata = {
  title: 'Kronos Industrial Monitor',
  description: 'Industrial maintenance dashboard client',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-950 text-slate-100">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
