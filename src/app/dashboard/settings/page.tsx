'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import {
  Users,
  Shield,
  Bell,
  Video,
  Building2,
  Save,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Mail,
  MessageSquare,
  Smartphone,
  AlertTriangle
} from 'lucide-react';
import { UserEntry, SettingsTab } from '../../../types';

const TABS: { key: SettingsTab; label: string; icon: React.ElementType }[] = [
  { key: 'users',         label: 'Users',         icon: Users     },
  { key: 'roles',         label: 'Roles',         icon: Shield    },
  { key: 'notifications', label: 'Notifications', icon: Bell      },
  { key: 'cameras',       label: 'Cameras',       icon: Video     },
  { key: 'company',       label: 'Company',       icon: Building2 },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${checked ? 'bg-emerald-600' : 'bg-slate-700'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : 'translate-x-1'}`} />
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-slate-500 transition-colors placeholder-slate-600";
const selectCls = "w-full border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-slate-500";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('users');
  const [saved, setSaved] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<UserEntry['role']>('operator');

  const [users, setUsers] = useState<UserEntry[]>([
    { id: 'u-1', name: 'Admin User',     email: 'admin@company.com',   role: 'admin',    status: 'active',    lastLogin: '2026-07-09 20:15' },
    { id: 'u-2', name: 'Sarah Miller',   email: 'sarah@company.com',   role: 'engineer', status: 'active',    lastLogin: '2026-07-09 18:44' },
    { id: 'u-3', name: 'John Doe',       email: 'john@company.com',    role: 'operator', status: 'active',    lastLogin: '2026-07-09 20:01' },
    { id: 'u-4', name: 'Mike Chen',      email: 'mike@company.com',    role: 'engineer', status: 'active',    lastLogin: '2026-07-08 14:20' },
    { id: 'u-5', name: 'Legacy Account', email: 'legacy@company.com',  role: 'operator', status: 'suspended', lastLogin: '2026-06-01 09:00' },
  ]);

  const [notifications, setNotifications] = useState({
    emailEnabled: true,  emailAddress:  'alerts@company.com',
    smsEnabled:   false, smsNumber:     '+1 555 000 1234',
    slackEnabled: true,  slackWebhook:  'https://hooks.slack.com/services/xxx/yyy/zzz',
    criticalOnly: false, alertThrottleMin: '5',
  });

  const [cameraSettings, setCameraSettings] = useState({
    defaultFps: '30', defaultResolution: '1920x1080',
    aiConfidenceThreshold: '85', retentionDays: '30',
    recordingEnabled: true, motionDetection: true,
  });

  const [company, setCompany] = useState({
    name: 'Acme Industrial Corp.', site: 'Plant Alpha – Sector 7',
    address: '142 Industrial Park Drive, Houston, TX 77001',
    contact: 'ops-lead@acmeindustrial.com', systemVersion: '1.2.0',
    licenseKey: 'KRON-ENT-2026-XXXX-YYYY', timezone: 'America/Chicago',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleUserRoleSave = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: editRole } : u));
    setEditingUserId(null);
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId
      ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
      : u
    ));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white uppercase">Console Settings</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">Users, roles, alerts, camera config, company profile</p>
        </div>
        <Button variant={saved ? 'secondary' : 'primary'} size="sm" onClick={handleSave}>
          {saved ? <><Check className="h-3 w-3 mr-1" /> Saved!</> : <><Save className="h-3 w-3 mr-1" /> Save Changes</>}
        </Button>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

        {/* Tab Sidebar */}
        <div className="lg:col-span-1">
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3 py-2 text-[10px] font-mono uppercase tracking-widest transition text-left whitespace-nowrap border ${
                  activeTab === tab.key
                    ? 'border-emerald-500/40 bg-emerald-950/10 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <tab.icon className="h-3.5 w-3.5 shrink-0" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3">
          <Card className="min-h-[480px]">
            <CardContent className="p-0">

              {/* ── USERS ── */}
              {activeTab === 'users' && (
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold text-white uppercase tracking-wider">User Management</h2>
                    <Button variant="primary" size="sm">
                      <Plus className="h-3 w-3 mr-1" /> Invite User
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map(u => (
                        <TableRow key={u.id}>
                          <TableCell>
                            <div className="font-semibold text-slate-100 text-xs">{u.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{u.email}</div>
                          </TableCell>
                          <TableCell>
                            {editingUserId === u.id ? (
                              <div className="flex items-center gap-1">
                                <select
                                  value={editRole}
                                  onChange={e => setEditRole(e.target.value as UserEntry['role'])}
                                  className="border border-slate-700 bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-200 focus:outline-none font-mono"
                                >
                                  <option value="admin">Admin</option>
                                  <option value="engineer">Engineer</option>
                                  <option value="operator">Operator</option>
                                </select>
                                <button onClick={() => handleUserRoleSave(u.id)} className="text-emerald-400 hover:text-emerald-300 p-0.5"><Check className="h-3 w-3" /></button>
                                <button onClick={() => setEditingUserId(null)} className="text-slate-400 hover:text-white p-0.5"><X className="h-3 w-3" /></button>
                              </div>
                            ) : (
                              <Badge variant={u.role === 'admin' ? 'success' : u.role === 'engineer' ? 'default' : 'slate'}>
                                {u.role}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={u.status === 'active' ? 'success' : 'destructive'}>{u.status}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-[10px] text-slate-500">{u.lastLogin}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0"
                                onClick={() => { setEditingUserId(u.id); setEditRole(u.role); }}
                                title="Edit Role"
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost" size="sm" className={`h-6 w-6 p-0 ${u.status === 'active' ? 'text-red-400' : 'text-emerald-400'}`}
                                onClick={() => handleToggleStatus(u.id)}
                                title={u.status === 'active' ? 'Suspend' : 'Reactivate'}
                              >
                                {u.status === 'active' ? <Trash2 className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* ── ROLES ── */}
              {activeTab === 'roles' && (
                <div className="p-4 space-y-3">
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">Roles & Permissions Matrix</h2>
                  {[
                    {
                      role: 'Admin', variant: 'success' as const,
                      desc: 'Full system access. Can manage users, settings, and all configurations.',
                      perms: ['Dashboard R/W', 'Cameras R/W/Config', 'Machines R/W/Control', 'Alerts R/W/Resolve', 'Analytics Export', 'Reports Export', 'Settings Full'],
                    },
                    {
                      role: 'Engineer', variant: 'default' as const,
                      desc: 'Technical access for diagnostics, calibration, and maintenance tasks.',
                      perms: ['Dashboard R', 'Cameras R/Config', 'Machines R/W/Calibrate', 'Alerts R/Ack/Resolve', 'Analytics Export', 'Reports R', 'Settings R'],
                    },
                    {
                      role: 'Operator', variant: 'slate' as const,
                      desc: 'View-only dashboard and alert acknowledgement capabilities.',
                      perms: ['Dashboard R', 'Cameras R', 'Machines R', 'Alerts R/Ack', 'Analytics R', 'Reports View', 'Settings None'],
                    },
                  ].map(r => (
                    <div key={r.role} className="border border-slate-800 bg-slate-900/50 p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Shield className="h-3.5 w-3.5 text-slate-400" />
                        <Badge variant={r.variant}>{r.role}</Badge>
                      </div>
                      <p className="text-[10px] text-slate-400 mb-2">{r.desc}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                        {r.perms.map((p, i) => (
                          <div key={i} className="flex items-center gap-1 text-[10px] font-mono text-slate-300">
                            <Check className="h-2.5 w-2.5 text-emerald-500 shrink-0" />
                            {p}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── NOTIFICATIONS ── */}
              {activeTab === 'notifications' && (
                <div className="p-4 space-y-3">
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">Notification Channels</h2>

                  {[
                    { key: 'emailEnabled' as const, label: 'Email Notifications', icon: Mail, color: 'text-emerald-400',
                      child: notifications.emailEnabled && (
                        <input type="email" value={notifications.emailAddress}
                          onChange={e => setNotifications(n => ({ ...n, emailAddress: e.target.value }))}
                          className={inputCls} placeholder="alerts@company.com" />
                      )
                    },
                    { key: 'smsEnabled' as const, label: 'SMS Alerts', icon: Smartphone, color: 'text-amber-400',
                      child: notifications.smsEnabled && (
                        <input type="tel" value={notifications.smsNumber}
                          onChange={e => setNotifications(n => ({ ...n, smsNumber: e.target.value }))}
                          className={inputCls} />
                      )
                    },
                    { key: 'slackEnabled' as const, label: 'Slack Webhook', icon: MessageSquare, color: 'text-sky-400',
                      child: notifications.slackEnabled && (
                        <input type="url" value={notifications.slackWebhook}
                          onChange={e => setNotifications(n => ({ ...n, slackWebhook: e.target.value }))}
                          className={inputCls} />
                      )
                    },
                  ].map(ch => (
                    <div key={ch.key} className="border border-slate-800 bg-slate-900/50 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ch.icon className={`h-3.5 w-3.5 ${ch.color}`} />
                          <span className="text-xs font-bold text-slate-200">{ch.label}</span>
                        </div>
                        <Toggle checked={notifications[ch.key]} onChange={() => setNotifications(n => ({ ...n, [ch.key]: !n[ch.key] }))} />
                      </div>
                      {ch.child}
                    </div>
                  ))}

                  {/* Alert Rules */}
                  <div className="border border-slate-800 bg-slate-900/50 p-3 space-y-2">
                    <div className="flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                      <span className="text-xs font-bold text-slate-200">Alert Rules</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Critical alerts only (suppress Info/Warn)</span>
                      <Toggle checked={notifications.criticalOnly} onChange={() => setNotifications(n => ({ ...n, criticalOnly: !n.criticalOnly }))} />
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Throttle interval (min between repeated)</span>
                      <select
                        value={notifications.alertThrottleMin}
                        onChange={e => setNotifications(n => ({ ...n, alertThrottleMin: e.target.value }))}
                        className="border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-200 focus:outline-none font-mono"
                      >
                        {['1', '2', '5', '10', '15', '30'].map(v => <option key={v} value={v}>{v} min</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ── CAMERAS ── */}
              {activeTab === 'cameras' && (
                <div className="p-4 space-y-4">
                  <div>
                    <h2 className="text-xs font-bold text-white uppercase tracking-wider">Global Camera Configuration</h2>
                    <p className="text-[10px] text-slate-500 mt-0.5">Defaults applied to all nodes. Override per-camera in the CV Feed view.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Default Frame Rate">
                      <select value={cameraSettings.defaultFps}
                        onChange={e => setCameraSettings(c => ({ ...c, defaultFps: e.target.value }))}
                        className={selectCls}>
                        {['15', '24', '30', '60'].map(o => <option key={o} value={o}>{o} fps</option>)}
                      </select>
                    </Field>
                    <Field label="Default Resolution">
                      <select value={cameraSettings.defaultResolution}
                        onChange={e => setCameraSettings(c => ({ ...c, defaultResolution: e.target.value }))}
                        className={selectCls}>
                        {['640x480', '1280x720', '1920x1080', '3840x2160'].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </Field>
                    <Field label="AI Confidence Threshold (%)">
                      <input type="number" value={cameraSettings.aiConfidenceThreshold}
                        onChange={e => setCameraSettings(c => ({ ...c, aiConfidenceThreshold: e.target.value }))}
                        className={inputCls} min="0" max="100" />
                    </Field>
                    <Field label="Footage Retention (days)">
                      <input type="number" value={cameraSettings.retentionDays}
                        onChange={e => setCameraSettings(c => ({ ...c, retentionDays: e.target.value }))}
                        className={inputCls} min="1" />
                    </Field>
                  </div>

                  <div className="space-y-2">
                    {[
                      { label: 'Enable Continuous Recording', key: 'recordingEnabled' as const },
                      { label: 'Enable Motion Detection Trigger', key: 'motionDetection' as const },
                    ].map(toggle => (
                      <div key={toggle.key} className="flex items-center justify-between border border-slate-800 bg-slate-900/50 px-3 py-2">
                        <span className="text-xs text-slate-300">{toggle.label}</span>
                        <Toggle
                          checked={cameraSettings[toggle.key] as boolean}
                          onChange={() => setCameraSettings(c => ({ ...c, [toggle.key]: !c[toggle.key] }))}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── COMPANY ── */}
              {activeTab === 'company' && (
                <div className="p-4 space-y-4">
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">Company Profile</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: 'Company Name',    field: 'name',    type: 'text'  },
                      { label: 'Plant / Site',    field: 'site',    type: 'text'  },
                      { label: 'Address',         field: 'address', type: 'text'  },
                      { label: 'Ops Contact',     field: 'contact', type: 'email' },
                      { label: 'System Timezone', field: 'timezone',type: 'text'  },
                    ].map(f => (
                      <Field key={f.field} label={f.label}>
                        <input
                          type={f.type}
                          value={company[f.field as keyof typeof company]}
                          onChange={e => setCompany(c => ({ ...c, [f.field]: e.target.value }))}
                          className={inputCls}
                        />
                      </Field>
                    ))}
                  </div>

                  {/* Read-only system info */}
                  <div className="border-t border-slate-800 pt-3 space-y-2">
                    <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">System Information (Read-only)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { label: 'Platform Version', value: company.systemVersion },
                        { label: 'License Key',      value: company.licenseKey    },
                        { label: 'Build',            value: 'Next.js 15 + Tailwind v4' },
                        { label: 'Environment',      value: 'Production' },
                      ].map((s, i) => (
                        <div key={i} className="border border-slate-800 bg-slate-900/50 p-2">
                          <div className="text-[9px] text-slate-500 uppercase tracking-widest">{s.label}</div>
                          <div className="text-[11px] font-mono text-slate-300 mt-0.5">{s.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
