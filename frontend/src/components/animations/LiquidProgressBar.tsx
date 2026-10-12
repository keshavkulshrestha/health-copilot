import React from 'react';

interface LiquidProgressBarProps {
  progress: number; // 0 to 100
  color?: 'emerald' | 'ruby' | 'honey' | 'tonic';
  height?: string;
  showLabel?: boolean;
}

export const LiquidProgressBar: React.FC<LiquidProgressBarProps> = ({
  progress,
  color = 'emerald',
  height = 'h-4',
  showLabel = false,
}) => {
  const clamp = Math.min(100, Math.max(0, progress));

  const styles = {
    emerald: {
      bg: 'bg-emerald-500',
      gradient: 'from-emerald-400 via-teal-500 to-emerald-600',
      glow: 'shadow-emerald-500/30',
    },
    ruby: {
      bg: 'bg-rose-500',
      gradient: 'from-pink-500 via-rose-500 to-red-600',
      glow: 'shadow-rose-500/30',
    },
    honey: {
      bg: 'bg-amber-500',
      gradient: 'from-amber-400 via-yellow-500 to-orange-500',
      glow: 'shadow-amber-500/30',
    },
    tonic: {
      bg: 'bg-cyan-500',
      gradient: 'from-cyan-400 via-sky-500 to-blue-600',
      glow: 'shadow-cyan-500/30',
    },
  }[color];

  return (
    <div className="w-full space-y-1.5">
      <div className={`relative w-full ${height} rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-inner`}>
        {/* Animated Fluid Fill */}
        <div
          className={`h-full rounded-full bg-gradient-to-r ${styles.gradient} transition-all duration-500 ease-out relative overflow-hidden shadow-md ${styles.glow}`}
          style={{ width: `${clamp}%` }}
        >
          {/* Shimmer light bar */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse" />
          
          {/* Micro Bubbles */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/80 animate-ping" />
        </div>
      </div>

      {showLabel && (
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
          <span>Processing fluid</span>
          <span className="font-bold">{clamp}%</span>
        </div>
      )}
    </div>
  );
};
