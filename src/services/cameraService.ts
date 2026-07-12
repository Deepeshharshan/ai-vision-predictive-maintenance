import { api } from '../lib/api';
import { CameraStream } from '../types/api';

export const cameraService = {
  getCameras: async (filters?: { location?: string }): Promise<CameraStream[]> => {
    const { data } = await api.get<CameraStream[]>('/cameras', { params: filters });
    return data;
  },
  
  restartStream: async (id: string): Promise<{ success: boolean }> => {
    const { data } = await api.post<{ success: boolean }>(`/cameras/${id}/restart`);
    return data;
  }
};
