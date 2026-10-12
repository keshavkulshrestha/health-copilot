import React from 'react';

interface KashighaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export const KashighaLogo: React.FC<KashighaLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const iconSize = {
    sm: 18,
    md: 22,
    lg: 28,
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* High-tech medical cross + neural pulse hexagon icon */}
      <div
        className={`${sizeMap[size]} rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 relative overflow-hidden group shrink-0`}
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <svg
          width={iconSize[size]}
          height={iconSize[size]}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative z-10"
        >
          {/* Medical cross with dynamic pulse line through it */}
          <path d="M12 3v18" stroke="currentColor" strokeWidth="2.4" />
          <path d="M3 12h18" stroke="currentColor" strokeWidth="2.4" />
          <path
            d="M5 12h3l2-4 4 8 2-4h3"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-90"
          />
          <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">
            kashigha
            <span className="text-slate-900 dark:text-white font-black ml-1">Health AI</span>
          </span>
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
            Personal Health Copilot
          </span>
        </div>
      )}
    </div>
  );
};
