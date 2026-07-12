export interface User {
  id: string;
  email: string;
  name: string;
  role: 'operator' | 'engineer' | 'admin';
}

export interface UserSession {
  token: string;
  user: User;
}

export interface TelemetryMetrics {
  temperature: number; // in Celsius
  vibration: number;   // in mm/s
  voltage: number;     // in V
  pressure: number;    // in kPa
}

export type DeviceStatus = 'running' | 'warning' | 'critical' | 'offline';

export interface Device {
  id: string;
  name: string;
  type: string;
  location: string;
  status: DeviceStatus;
  lastUpdated: string;
  metrics: TelemetryMetrics;
}

export interface TelemetryPayload {
  deviceId: string;
  timestamp: string;
  metrics: TelemetryMetrics;
  status: DeviceStatus;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  source: string;
}

export interface CameraStream {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  fps: number;
  resolution: string;
  bitrate: string; // e.g. "4.2 Mbps"
  health: number; // 0-100
  uptime: string; // e.g. "99.8%"
  assignedMachine: { id: string; name: string } | null;
  detections: { label: string; confidence: number; box: [number, number, number, number] }[];
}

export type SettingsTab = 'users' | 'roles' | 'notifications' | 'cameras' | 'company';

export interface UserEntry {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'engineer' | 'operator';
  status: 'active' | 'suspended';
  lastLogin: string;
}
