import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '../types';
import { ApiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  quickSwitchRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => { throw new Error('Not implemented'); },
  logout: () => {},
  quickSwitchRole: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('care_queue_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const u = await ApiService.getMe();
      setUser(u);
    } catch (err) {
      console.error('Failed to restore session', err);
      localStorage.removeItem('care_queue_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await ApiService.login(email, password);
    localStorage.setItem('care_queue_token', res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('care_queue_token');
    setUser(null);
  };

  const quickSwitchRole = async (role: UserRole) => {
    let email = 'patient@hospital.com';
    if (role === UserRole.RECEPTIONIST) email = 'receptionist@hospital.com';
    else if (role === UserRole.DOCTOR) email = 'doctor@hospital.com';
    else if (role === UserRole.ADMIN) email = 'admin@hospital.com';

    await login(email, 'password123');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, quickSwitchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
