'use client';

import React from 'react';

export interface StatusBadgeProps {
  status: 'completed' | 'processing' | 'uploaded' | 'failed' | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = {
    completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    uploaded: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    failed: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800',
  }[status] || 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';

  return (
    <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${styles} capitalize inline-flex items-center gap-1.5`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};

export interface BiomarkerBadgeProps {
  status: 'low' | 'high' | 'normal';
}

export const BiomarkerBadge: React.FC<BiomarkerBadgeProps> = ({ status }) => {
  const styles = {
    low: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    high: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    normal: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  }[status];

  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${styles} uppercase tracking-wider`}>
      {status}
    </span>
  );
};
