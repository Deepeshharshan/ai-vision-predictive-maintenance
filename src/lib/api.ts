import axios from 'axios';
import Cookies from 'js-cookie';
import { env } from '../config/env';

export const api = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // We assume the token is stored in cookies for better security across tabs
    // Or it can be stored in localStorage. We use cookies here.
    const token = Cookies.get('kronos_jwt');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token or simply log out
        // In this architecture, we will clear the token and redirect to login if refresh fails
        // Example: const { data } = await axios.post(`${env.API_URL}/auth/refresh`);
        
        // For now, simple clear and redirect
        Cookies.remove('kronos_jwt');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden: Insufficient permissions');
    }
    
    return Promise.reject(error);
  }
);
