'use client';

import React from 'react';

interface SyrupFillingLoaderProps {
  percentage?: number; // 0 to 100
  flavor?: 'ruby' | 'emerald' | 'honey' | 'tonic' | 'violet';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SyrupFillingLoader: React.FC<SyrupFillingLoaderProps> = ({
  percentage = 65,
  flavor = 'emerald',
  label = 'Filling Elixir...',
  size = 'md',
}) => {
  const clampPercent = Math.min(100, Math.max(0, percentage));

  // Syrup Color Schemes
  const colorMap = {
    ruby: {
      liquid: 'from-rose-500 to-red-600',
      wave: '#f43f5e',
      glow: 'rgba(244, 63, 94, 0.4)',
      cap: 'bg-rose-700',
    },
    emerald: {
      liquid: 'from-emerald-500 to-teal-600',
      wave: '#10b981',
      glow: 'rgba(16, 185, 129, 0.4)',
      cap: 'bg-emerald-700',
    },
    honey: {
      liquid: 'from-amber-400 to-orange-500',
      wave: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.4)',
      cap: 'bg-amber-700',
    },
    tonic: {
      liquid: 'from-cyan-400 to-blue-600',
      wave: '#06b6d4',
      glow: 'rgba(6, 182, 212, 0.4)',
      cap: 'bg-cyan-700',
    },
    violet: {
      liquid: 'from-purple-500 to-indigo-600',
      wave: '#8b5cf6',
      glow: 'rgba(139, 92, 246, 0.4)',
      cap: 'bg-purple-700',
    },
  }[flavor];

  const dimensions = {
    sm: { width: 64, height: 100 },
    md: { width: 90, height: 140 },
    lg: { width: 120, height: 180 },
  }[size];

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      {/* Medicine Bottle Container */}
      <div
        className="relative flex flex-col items-center select-none"
        style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
      >
        {/* Bottle Cap */}
        <div
          className={`w-1/3 h-4 rounded-t-md shadow-md ${colorMap.cap} border-t border-white/30 z-20 relative`}
        >
          {/* Ribs on cap */}
          <div className="flex justify-around items-center h-full px-1">
            <div className="w-0.5 h-2 bg-white/30" />
            <div className="w-0.5 h-2 bg-white/30" />
            <div className="w-0.5 h-2 bg-white/30" />
          </div>
        </div>

        {/* Bottle Neck */}
        <div className="w-1/4 h-3 bg-slate-200/90 dark:bg-slate-700/80 border-x border-slate-300 dark:border-slate-600 z-10" />

        {/* Main Glass Bottle Body */}
        <div
          className="relative flex-1 w-full rounded-2xl rounded-t-lg bg-slate-100/70 dark:bg-slate-800/60 border-2 border-slate-300/80 dark:border-slate-600/80 shadow-xl overflow-hidden backdrop-blur-md"
          style={{
            boxShadow: `0 8px 30px ${colorMap.glow}`,
          }}
        >
          {/* Glass Specular Reflection Highlight */}
          <div className="absolute top-0 left-1 w-2.5 h-full bg-gradient-to-r from-white/50 to-transparent z-20 pointer-events-none rounded-l-md" />
          <div className="absolute top-2 right-1.5 w-1.5 h-2/3 bg-white/30 z-20 pointer-events-none rounded-full" />

          {/* Measurement Markings (Graduations) */}
          <div className="absolute left-2 inset-y-2 flex flex-col justify-between z-20 pointer-events-none opacity-40">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-0.5 bg-slate-500" />
              <span className="text-[7px] font-mono text-slate-500">100</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-0.5 bg-slate-500" />
              <span className="text-[7px] font-mono text-slate-500">75</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-0.5 bg-slate-500" />
              <span className="text-[7px] font-mono text-slate-500">50</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-0.5 bg-slate-500" />
              <span className="text-[7px] font-mono text-slate-500">25</span>
            </div>
          </div>

          {/* Filling Liquid Level */}
          <div
            className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out z-10 overflow-hidden"
            style={{ height: `${clampPercent}%` }}
          >
            {/* Wavy Surface Layer */}
            <div className="absolute -top-3 left-0 right-0 h-6 overflow-hidden">
              <svg
                viewBox="0 0 500 150"
                preserveAspectRatio="none"
                className="w-[200%] h-full animate-liquid-wave"
              >
                <path
                  d="M0,75 C150,150 350,0 500,75 L500,150 L0,150 Z"
                  fill={colorMap.wave}
                />
              </svg>
            </div>

            {/* Liquid Body with Gradient */}
            <div className={`w-full h-full bg-gradient-to-t ${colorMap.liquid} opacity-90 relative overflow-hidden`}>
              {/* Effervescent Rising Bubbles */}
              <div className="absolute bottom-1 left-1/4 w-1.5 h-1.5 rounded-full bg-white/70 animate-bubble-rise" />
              <div
                className="absolute bottom-2 left-2/3 w-2 h-2 rounded-full bg-white/70 animate-bubble-rise"
                style={{ animationDelay: '1.2s' }}
              />
              <div
                className="absolute bottom-1 left-1/2 w-1 h-1 rounded-full bg-white/70 animate-bubble-rise"
                style={{ animationDelay: '2.3s' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Label with percentage */}
      <div className="text-center">
        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
          {label}
        </p>
        <span className="text-[11px] font-mono text-slate-400">
          {clampPercent}% Volume
        </span>
      </div>
    </div>
  );
};
