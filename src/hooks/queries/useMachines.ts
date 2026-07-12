import { useQuery } from '@tanstack/react-query';
import { machineService } from '../../services/machineService';

export const useMachines = (filters?: { status?: string, search?: string }) => {
  return useQuery({
    queryKey: ['machines', filters],
    queryFn: () => machineService.getMachines(filters),
  });
};

export const useMachine = (id: string) => {
  return useQuery({
    queryKey: ['machines', id],
    queryFn: () => machineService.getMachineById(id),
    enabled: !!id,
  });
};
