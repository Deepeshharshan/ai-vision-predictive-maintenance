import { api } from '../lib/api';

export interface OEEData {
  day: string;
  active: number;
  idle: number;
  down: number;
  oee: number;
}

export interface DefectCategory {
  label: string;
  count: number;
  pct: number;
  color: string;
}

export interface AnalyticsData {
  weeklyOEE: OEEData[];
  defectCategories: DefectCategory[];
  avgOEE: number;
}

export const analyticsService = {
  getAnalytics: async (timeRange: '24h' | '7d' | '30d'): Promise<AnalyticsData> => {
    const { data } = await api.get<AnalyticsData>('/analytics', { params: { range: timeRange } });
    return data;
  },
  
  exportReport: async (type: 'pdf' | 'excel', timeRange: string): Promise<Blob> => {
    const { data } = await api.get(`/analytics/export`, {
      params: { type, range: timeRange },
      responseType: 'blob'
    });
    return data;
  }
};
