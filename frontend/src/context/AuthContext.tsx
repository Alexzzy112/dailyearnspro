'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { authAPI } from '@/lib/api';

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  accountStatus: string;
  walletBalance: number;
  totalEarnings: number;
  tasksCompleted: number;
  todayTasksCompleted: number;
  referralCount: number;
  referralEarnings: number;
  referralCode: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (data: { name: string; username: string; email: string; password: string; referredBy?: string }) => Promise<any>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  showLoginPopup: boolean;
  dismissLoginPopup: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginPopup, setShowLoginPopup] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('showLoginPopup') === 'true';
    }
    return false;
  });

  const fetchUser = async () => {
    try {
      const token = Cookies.get('token');
      if (token) {
        const res = await authAPI.getMe();
        setUser(res.data);
      }
    } catch {
      Cookies.remove('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUser(); }, []);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login({ email, password });
    const { token, ...userData } = res.data;
    const secure = typeof window !== 'undefined' && window.location.protocol === 'https:';
    Cookies.set('token', token, { expires: 7, secure, sameSite: 'Lax' });
    setUser(userData);
    sessionStorage.setItem('showLoginPopup', 'true');
    setShowLoginPopup(true);
    return res.data;
  };

  const register = async (data: { name: string; username: string; email: string; password: string; referredBy?: string }) => {
    const res = await authAPI.register(data);
    if (res.data.token) {
      const { token, ...userData } = res.data;
      const secure = typeof window !== 'undefined' && window.location.protocol === 'https:';
      Cookies.set('token', token, { expires: 7, secure, sameSite: 'Lax' });
      setUser(userData);
      sessionStorage.setItem('showLoginPopup', 'true');
      setShowLoginPopup(true);
    }
    return res.data;
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    sessionStorage.removeItem('showLoginPopup');
    setShowLoginPopup(false);
    window.location.href = '/';
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  const dismissLoginPopup = () => {
    sessionStorage.removeItem('showLoginPopup');
    setShowLoginPopup(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, showLoginPopup, dismissLoginPopup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
