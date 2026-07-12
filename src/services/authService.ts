import { api } from '../lib/api';
import { AuthResponse } from '../types/api';
import Cookies from 'js-cookie';

export const authService = {
  login: async (credentials: Record<string, string>): Promise<AuthResponse> => {
    // During transition to real API, this handles the POST request
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    if (data.token) {
      Cookies.set('kronos_jwt', data.token, { secure: true, sameSite: 'strict' });
    }
    return data;
  },
  
  logout: () => {
    Cookies.remove('kronos_jwt');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  verifyToken: async (): Promise<boolean> => {
    try {
      await api.get('/auth/verify');
      return true;
    } catch {
      return false;
    }
  }
};
