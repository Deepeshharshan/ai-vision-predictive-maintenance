import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboardService';

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: dashboardService.getMetricsSummary,
  });
};

export const useDashboardActivities = () => {
  return useQuery({
    queryKey: ['dashboard', 'activities'],
    queryFn: dashboardService.getRecentActivities,
  });
};
