export type AlertLevel = 'error' | 'warn' | 'info';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface Alert {
  id: string;
  timestamp: string;
  level: AlertLevel;
  message: string;
  source: string;
  sourceType: 'machine' | 'camera' | 'network' | 'system';
  status: AlertStatus;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  notes?: string;
  timeline: { time: string; action: string; actor: string }[];
}

export interface MachineMetrics {
  temperature: number;
  vibration: number;
  voltage: number;
  pressure: number;
}

export interface MaintenanceLog {
  date: string;
  type: 'Preventative' | 'Emergency' | 'Inspection' | 'Corrective';
  engineer: string;
  duration: string;
  notes: string;
  resolved: boolean;
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'running' | 'warning' | 'critical' | 'offline';
  lastUpdated: string;
  assignedCamera: string | null;
  nextMaintenanceDate: string;
  operatingHours: number;
  mtbf: string;
  metrics: MachineMetrics;
  maintenance: MaintenanceLog[];
}

export interface Detection {
  label: string;
  confidence: number;
  box: [number, number, number, number];
}

export interface CameraStream {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  fps: number;
  resolution: string;
  bitrate: string;
  health: number;
  uptime: string;
  assignedMachine: { id: string; name: string } | null;
  detections: Detection[];
}

export interface DashboardMetricsSummary {
  productionRate: number;
  productionTarget: number;
  efficiency: number;
  downtime: number;
  defects: number;
  shiftDefectLimit: number;
}

export interface RecentActivity {
  id: string;
  timestamp: string;
  user: string;
  event: string;
  status: 'success' | 'warning' | 'default';
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
}
