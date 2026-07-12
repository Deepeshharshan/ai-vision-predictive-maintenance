import { api } from '../lib/api';
import { DashboardMetricsSummary, RecentActivity } from '../types/api';

export const dashboardService = {
  getMetricsSummary: async (): Promise<DashboardMetricsSummary> => {
    const { data } = await api.get<DashboardMetricsSummary>('/dashboard/metrics');
    return data;
  },
  
  getRecentActivities: async (): Promise<RecentActivity[]> => {
    const { data } = await api.get<RecentActivity[]>('/dashboard/activities');
    return data;
  }
};
