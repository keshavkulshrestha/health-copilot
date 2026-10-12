'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  abhaId: string;
  bloodGroup: string;
  dob: string;
  gender: string;
  phone: string;
  isAbdmLinked: boolean;
}

interface AuthContextType {
  user: UserProfile;
  isLoggedIn: boolean;
  login: (data: Partial<UserProfile> & { password?: string }) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Aarav Sharma',
  email: 'aarav.sharma@healthmail.in',
  abhaId: '91-2345-6789-0123',
  bloodGroup: 'O+',
  dob: '1989-04-12',
  gender: 'M',
  phone: '+91 98765 43210',
  isAbdmLinked: true,
};

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_PROFILE,
  isLoggedIn: true,
  login: () => {},
  logout: () => {},
  updateProfile: () => {},
  isLoginModalOpen: false,
  setIsLoginModalOpen: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kashigha_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        setIsLoggedIn(true);
      }
    } catch {
      // fallback to default
    }
  }, []);

  const login = (data: Partial<UserProfile> & { password?: string }) => {
    const abhaFormatted = data.abhaId
      ? data.abhaId.replace(/[^0-9]/g, '').replace(/(\d{2})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4') || data.abhaId
      : '91-8841-2940-1092';

    const updated: UserProfile = {
      name: data.name?.trim() || user.name || 'Keshav Kulshrestha',
      email: data.email?.trim() || user.email || 'patient@kashigha.ai',
      abhaId: abhaFormatted || '91-2345-6789-0123',
      bloodGroup: data.bloodGroup || user.bloodGroup || 'O+',
      dob: data.dob || user.dob || '1995-06-20',
      gender: data.gender || user.gender || 'M',
      phone: data.phone || user.phone || '+91 98765 43210',
      isAbdmLinked: true,
    };

    setUser(updated);
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);

    try {
      localStorage.setItem('kashigha_user_profile', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem('kashigha_user_profile');
    } catch {}
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    const updated = { ...user, ...data };
    setUser(updated);
    try {
      localStorage.setItem('kashigha_user_profile', JSON.stringify(updated));
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        logout,
        updateProfile,
        isLoginModalOpen,
        setIsLoginModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
