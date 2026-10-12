'use client';

import React, { useState } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { AnimationProvider } from '@/context/AnimationContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MedicalFloatingBackground } from '../animations/MedicalFloatingBackground';
import { AnimationControlsModal } from '../animations/AnimationControlsModal';
import { AbhaLoginModal } from '../auth/AbhaLoginModal';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AnimationProvider>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200 relative selection:bg-brand-500 selection:text-white">
              {/* Ambient Medical Floating Background & Multi-layer Syrup Reservoir */}
              <MedicalFloatingBackground density="normal" />

              {/* Interactive FX Studio Modal */}
              <AnimationControlsModal />

              {/* ABDM Ayushman Bharat Login & Profile Modal */}
              <AbhaLoginModal />

              {/* Global Navbar */}
              <Navbar onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

              <div className="flex flex-1 relative z-10">
                <Sidebar
                  isMobileOpen={isMobileMenuOpen}
                  onCloseMobile={() => setIsMobileMenuOpen(false)}
                />

                {/* Main Content Area */}
                <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-all">
                  {children}
                </main>
              </div>
            </div>
          </AnimationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};
