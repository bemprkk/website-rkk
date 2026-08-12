import React, { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AUTH_KEY = 'bemprkk_admin_auth';
const PASSWORD_KEY = 'bemprkk_admin_password';
const DEFAULT_PASSWORD = 'AdminBemprkk.123';

interface AdminContextType {
  isLoggedIn: boolean;
  login: (email: string, password: string, captchaToken: string | null) => Promise<boolean>;
  logout: () => void;
  changePassword: (oldPass: string, newPass: string) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  });

  const getPassword = () => localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;

  const login = async (email: string, password: string, captchaToken: string | null) => {
    try {
      const response = await api.post('/auth/login', { email, password, recaptchaToken: captchaToken });
      if (response.data && response.data.token) {
        sessionStorage.setItem('bemprkk_admin_token', response.data.token);
        sessionStorage.setItem(AUTH_KEY, 'true');
        setIsLoggedIn(true);
        return true;
      }
      return false;
    } catch (e: any) {
      console.error('Backend API login failed:', e.response?.data?.msg || e.message);
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem('bemprkk_admin_token');
    setIsLoggedIn(false);
  };

  const changePassword = async (oldPass: string, newPass: string) => {
    try {
      await api.put('/auth/password', { oldPassword: oldPass, newPassword: newPass });
      return true;
    } catch (e: any) {
      console.error('Backend API password update failed:', e.response?.data?.msg || e.message);
      return false;
    }
  };

  return (
    <AdminContext.Provider value={{ isLoggedIn, login, logout, changePassword }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
};
