import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../services/analyticsService';

export const useAnalytics = (timeRange: '24h' | '7d' | '30d') => {
  return useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: () => analyticsService.getAnalytics(timeRange),
  });
};
