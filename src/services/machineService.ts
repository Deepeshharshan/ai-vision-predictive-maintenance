import { api } from '../lib/api';
import { Machine } from '../types/api';

export const machineService = {
  getMachines: async (filters?: { status?: string, search?: string }): Promise<Machine[]> => {
    const { data } = await api.get<Machine[]>('/machines', { params: filters });
    return data;
  },
  
  getMachineById: async (id: string): Promise<Machine> => {
    const { data } = await api.get<Machine>(`/machines/${id}`);
    return data;
  }
};
