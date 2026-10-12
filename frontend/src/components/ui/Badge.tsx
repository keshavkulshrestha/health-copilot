import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface BadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const { t } = useLanguage();
  const normalized = status.toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  let label = t(`status_${normalized}`) || status;

  if (normalized === 'completed') {
    styles = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
  } else if (normalized === 'processing') {
    styles = 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800 animate-pulse';
  } else if (normalized === 'failed') {
    styles = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800';
  } else if (normalized === 'uploaded') {
    styles = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles} ${className}`}>
      {label}
    </span>
  );
};

export const BiomarkerBadge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const { t } = useLanguage();
  const normalized = status.toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  let label = t(`status_${normalized}`) || status;

  if (normalized === 'normal') {
    styles = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  } else if (normalized === 'low') {
    styles = 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  } else if (normalized === 'high') {
    styles = 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800';
  } else if (normalized === 'critical') {
    styles = 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800 font-bold';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${styles} ${className}`}>
      {label}
    </span>
  );
};
