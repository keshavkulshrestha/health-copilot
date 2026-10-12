'use client';

import React from 'react';
import Link from 'next/link';
import { Sun, Moon, Globe, Menu, ShieldCheck, User } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { KashighaLogo } from '../ui/KashighaLogo';

interface NavbarProps {
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, isLoggedIn, setIsLoginModalOpen } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link href="/" className="flex items-center gap-3 group">
            <KashighaLogo size="md" />
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                kashigha Health AI
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase hidden sm:inline">
                Personal Health Copilot
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Controls & ABHA Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200/80 dark:border-slate-700/80"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/80 dark:border-slate-700/80"
            title="Toggle Theme"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-600" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Interactive ABHA Patient Login Profile Button */}
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center gap-2.5 pl-3 py-1 pr-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800 border border-emerald-200/80 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-teal-500 transition-all shadow-xs group text-left"
            title="Click to Switch Account or Edit ABHA ID"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
              {user.name.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="flex items-center gap-1">
                <p className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate max-w-[110px]">
                  {user.name}
                </p>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              </div>
              <p className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold truncate max-w-[130px]">
                ABHA: {user.abhaId}
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
