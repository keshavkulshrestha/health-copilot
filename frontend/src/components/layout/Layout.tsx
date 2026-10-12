import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MedicalFloatingBackground } from '../animations/MedicalFloatingBackground';
import { AnimationControlsModal } from '../animations/AnimationControlsModal';

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200 relative">
      {/* Ambient Medical Floating Background & Syrup Reservoir */}
      <MedicalFloatingBackground density="normal" />

      {/* Interactive FX Studio Modal */}
      <AnimationControlsModal />

      <Navbar onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      
      <div className="flex flex-1 relative z-10">
        <Sidebar 
          isMobileOpen={isMobileMenuOpen} 
          onCloseMobile={() => setIsMobileMenuOpen(false)} 
        />
        
        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-all">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
