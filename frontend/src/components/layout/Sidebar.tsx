import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UploadCloud, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { t } = useLanguage();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: t('nav_dashboard'), icon: LayoutDashboard },
    { to: '/upload', label: t('nav_upload'), icon: UploadCloud },
    { to: '/documents', label: t('nav_documents'), icon: FileText },
    { to: '/chat', label: t('nav_chat'), icon: MessageSquare },
    { to: '/settings', label: t('nav_settings'), icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-semibold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </NavLink>
            );
          })}
        </div>

        {/* Bottom user card & logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          {/* Clinical safety badge */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span>Medical Shield</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
              AI provides guidance only. Consult your doctor for treatment.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('nav_logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
