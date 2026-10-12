import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserPreference } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: any) => Promise<void>;
  updatePreferences: (pref: Partial<UserPreference>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('medimind_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('medimind_token');
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const freshUser = await api.getMe();
          setUser(freshUser);
          localStorage.setItem('medimind_user', JSON.stringify(freshUser));
        } catch {
          // Token invalid
          setUser(null);
          setToken(null);
          localStorage.removeItem('medimind_token');
          localStorage.removeItem('medimind_user');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (credentials: any) => {
    const data = await api.login(credentials);
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('medimind_token', data.access_token);
    localStorage.setItem('medimind_user', JSON.stringify(data.user));
  };

  const register = async (regData: any) => {
    const data = await api.register(regData);
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('medimind_token', data.access_token);
    localStorage.setItem('medimind_user', JSON.stringify(data.user));
  };

  const logout = async () => {
    await api.logout();
    setToken(null);
    setUser(null);
  };

  const updateUser = async (profileData: any) => {
    const updated = await api.updateProfile(profileData);
    setUser(updated);
    localStorage.setItem('medimind_user', JSON.stringify(updated));
  };

  const updatePreferences = async (prefData: Partial<UserPreference>) => {
    const updatedPref = await api.updatePreferences(prefData);
    if (user) {
      const updatedUser = { ...user, preference: updatedPref };
      setUser(updatedUser);
      localStorage.setItem('medimind_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
