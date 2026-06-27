import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { UserDTO } from '@/types/auth';
import { authService } from '@/services/auth.service';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: UserDTO | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: UserDTO) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function parseToken(token: string): { sub: string; email: string; isAdmin: boolean; exp: number } | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    if (decoded.exp * 1000 < Date.now()) return null;
    return { sub: decoded.sub, email: decoded.email, isAdmin: decoded.isAdmin, exp: decoded.exp };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(() => {
    const saved = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (saved && savedToken && parseToken(savedToken)) {
      return JSON.parse(saved);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  });
  const [token, setToken] = useState<string | null>(() => {
    const saved = localStorage.getItem('token');
    return saved && parseToken(saved) ? saved : null;
  });

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.isAdmin ?? false;

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login({ email, password });
    const { token: newToken, user: userData } = res.data.data;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  }, []);

  const register = useCallback(async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    await authService.register(data);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore logout errors
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser: UserDTO) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
