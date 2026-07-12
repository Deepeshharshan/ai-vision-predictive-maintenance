import { useState, useEffect } from 'react';
import { User, UserSession } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored credentials
    const sessionStr = localStorage.getItem('monitoring_session');
    if (sessionStr) {
      try {
        const session: UserSession = JSON.parse(sessionStr);
        setUser(session.user);
      } catch (e) {
        localStorage.removeItem('monitoring_session');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // Simulation of secure API authentication flow
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (email === 'admin@company.com' && password === 'admin123') {
        const dummySession: UserSession = {
          token: 'jwt_mock_token_xyz_123',
          user: {
            id: 'u-1',
            email: 'admin@company.com',
            name: 'Operator Admin',
            role: 'admin',
          },
        };
        localStorage.setItem('monitoring_session', JSON.stringify(dummySession));
        setUser(dummySession.user);
        setLoading(false);
        return true;
      } else {
        throw new Error('Invalid email or password. Hint: admin@company.com / admin123');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('monitoring_session');
    setUser(null);
  };

  return { user, loading, error, login, logout };
}
