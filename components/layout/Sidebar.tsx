'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  UploadCloud, 
  FileText, 
  MessageSquare, 
  ShieldCheck, 
  Heart,
  X 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { KashighaLogo } from '@/components/ui/KashighaLogo';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { name: t('nav_dashboard'), path: '/', icon: LayoutDashboard },
    { name: t('nav_upload'), path: '/upload', icon: UploadCloud },
    { name: t('nav_documents'), path: '/records', icon: FileText },
    { name: t('nav_chat'), path: '/chat', icon: MessageSquare },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200 dark:border-slate-800 p-4 transition-colors">
      {/* Mobile Header */}
      <div className="flex items-center justify-between pb-4 mb-2 lg:hidden border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <KashighaLogo size="sm" />
          <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
            kashigha <span className="text-brand-600 dark:text-brand-400">Health AI</span>
          </span>
        </div>
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-brand-600 to-teal-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Patient ABDM Security Badge */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <div className="p-3 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200/80 dark:border-brand-800/80">
          <div className="flex items-center gap-2 text-brand-800 dark:text-brand-300 font-bold text-xs mb-1">
            <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>ABDM / FHIR Compliant</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Encrypted private health records with Gemini 1.5 Clinical AI assistance.
          </p>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
          <span>Crafted with</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
          <span>for Patient Care</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="fixed left-0 top-0 bottom-0 w-72 z-50 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
