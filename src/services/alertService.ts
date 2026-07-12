import { api } from '../lib/api';
import { Alert } from '../types/api';

export const alertService = {
  getAlerts: async (filters?: { level?: string, status?: string, search?: string }): Promise<Alert[]> => {
    const { data } = await api.get<Alert[]>('/alerts', { params: filters });
    return data;
  },
  
  acknowledgeAlert: async (id: string): Promise<Alert> => {
    const { data } = await api.post<Alert>(`/alerts/${id}/acknowledge`);
    return data;
  },

  resolveAlert: async (id: string, notes: string): Promise<Alert> => {
    const { data } = await api.post<Alert>(`/alerts/${id}/resolve`, { notes });
    return data;
  }
};
