'use client';

import React from 'react';

interface LiquidProgressBarProps {
  progress: number; // 0 to 100
  color?: 'emerald' | 'ruby' | 'honey' | 'tonic' | 'violet';
  height?: number;
  showPercent?: boolean;
}

export const LiquidProgressBar: React.FC<LiquidProgressBarProps> = ({
  progress,
  color = 'emerald',
  height = 14,
  showPercent = false,
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  const colors = {
    emerald: {
      bar: 'from-emerald-500 to-teal-500',
      wave: '#10b981',
      glow: 'shadow-emerald-500/20',
    },
    ruby: {
      bar: 'from-rose-500 to-red-500',
      wave: '#f43f5e',
      glow: 'shadow-rose-500/20',
    },
    honey: {
      bar: 'from-amber-400 to-orange-500',
      wave: '#f59e0b',
      glow: 'shadow-amber-500/20',
    },
    tonic: {
      bar: 'from-cyan-400 to-blue-500',
      wave: '#06b6d4',
      glow: 'shadow-cyan-500/20',
    },
    violet: {
      bar: 'from-purple-500 to-indigo-500',
      wave: '#8b5cf6',
      glow: 'shadow-purple-500/20',
    },
  }[color];

  return (
    <div className="w-full flex items-center gap-3">
      <div
        className={`flex-1 rounded-full bg-slate-200/80 dark:bg-slate-700/80 overflow-hidden relative shadow-inner ${colors.glow}`}
        style={{ height: `${height}px` }}
      >
        <div
          className={`h-full bg-gradient-to-r ${colors.bar} rounded-full transition-all duration-700 ease-out relative overflow-hidden`}
          style={{ width: `${clamped}%` }}
        >
          {/* Surface Wave SVG */}
          <div className="absolute right-0 top-0 bottom-0 w-8 overflow-hidden opacity-70">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-full animate-liquid-wave"
            >
              <path
                d="M0,0 C30,40 70,60 100,100 L0,100 Z"
                fill="#ffffff"
                opacity="0.3"
              />
            </svg>
          </div>

          {/* Micro Bubbles */}
          <div className="absolute top-1/4 left-1/3 w-1 h-1 rounded-full bg-white/70 animate-bubble-fast" />
          <div
            className="absolute top-1/2 left-2/3 w-1 h-1 rounded-full bg-white/70 animate-bubble-fast"
            style={{ animationDelay: '0.8s' }}
          />
        </div>
      </div>
      {showPercent && (
        <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
          {clamped}%
        </span>
      )}
    </div>
  );
};
