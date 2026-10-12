import React from 'react';
import { Sun, Moon, Globe, Menu, ShieldCheck, HeartPulse, Sparkles, Droplet } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useAnimations } from '../../context/AnimationContext';

interface NavbarProps {
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  const { triggerTabletShower, isShowerBurstActive, setIsFxModalOpen, syrupFlavor } = useAnimations();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <HeartPulse className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-brand-700 via-teal-600 to-indigoBrand-600 dark:from-brand-400 dark:via-teal-300 dark:to-indigo-400 bg-clip-text text-transparent">
                {t('brand_name')}
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                AI Health Copilot
              </span>
            </div>
          </div>
        </div>

        {/* Right: Controls & User Chip */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Trigger: Rain Medicine Tablets */}
          <button
            onClick={triggerTabletShower}
            className={`hidden xs:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
              isShowerBurstActive
                ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30'
                : 'bg-gradient-to-r from-brand-50 to-teal-50 dark:from-slate-800 dark:to-slate-800 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/80 hover:bg-brand-100 dark:hover:bg-slate-700'
            }`}
            title="Rain Falling Medicines & Tablets"
          >
            <span className="text-sm">💊</span>
            <span className="hidden md:inline">Rain Pills</span>
          </button>

          {/* Interactive Medical FX & Syrup Studio Button */}
          <button
            onClick={() => setIsFxModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-teal-500/10 to-indigo-500/10 hover:from-teal-500/20 hover:to-indigo-500/20 text-teal-700 dark:text-teal-300 border border-teal-300/60 dark:border-teal-700/60 transition-all shadow-xs"
            title="Open Medical FX, Syrup Waves & Animation Studio"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">Animations & FX</span>
            <span className="sm:hidden">FX</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200/80 dark:border-slate-700/80"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/80 dark:border-slate-700/80"
            title="Toggle Theme"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-600" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* User Profile Info */}
          {user && (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigoBrand-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
              <div className="text-left text-xs leading-tight">
                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[120px]">
                  {user.full_name || user.email.split('@')[0]}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[10px]">
                  {user.blood_group ? `Blood: ${user.blood_group}` : 'Patient'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
