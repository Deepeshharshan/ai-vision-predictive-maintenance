import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cameraService } from '../../services/cameraService';

export const useCameras = (filters?: { location?: string }) => {
  return useQuery({
    queryKey: ['cameras', filters],
    queryFn: () => cameraService.getCameras(filters),
  });
};

export const useRestartStream = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cameraService.restartStream,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
    },
  });
};
