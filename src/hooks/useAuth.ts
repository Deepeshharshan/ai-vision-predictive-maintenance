import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { api } from '../lib/api';
import { authService } from '../services/authService';
import { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // On mount: verify the stored JWT with the backend to rehydrate user state
  useEffect(() => {
    const token = Cookies.get('kronos_jwt');
    if (!token) {
      setLoading(false);
      return;
    }
    api.get<{ id: string; email: string; name: string; role: string }>('/auth/verify')
      .then((res) => {
        setUser({
          id: res.data.id,
          email: res.data.email,
          name: res.data.name,
          role: res.data.role as User['role'],
        });
      })
      .catch(() => {
        // Token is invalid or expired — clear it
        Cookies.remove('kronos_jwt');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login({ username: email, password });
      setUser({
        id: data.user.id,
        email: data.user.email ?? email,
        name: data.user.name,
        role: data.user.role as User['role'],
      });
      return true;
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        'Authentication failed. Please check your credentials.';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return { user, loading, error, login, logout };
}
