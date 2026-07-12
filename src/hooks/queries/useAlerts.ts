import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertService } from '../../services/alertService';

export const useAlerts = (filters?: { level?: string, status?: string, search?: string }) => {
  return useQuery({
    queryKey: ['alerts', filters],
    queryFn: () => alertService.getAlerts(filters),
  });
};

export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: alertService.acknowledgeAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};

export const useResolveAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) => alertService.resolveAlert(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};
