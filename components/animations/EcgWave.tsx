'use client';

import React from 'react';

interface EcgWaveProps {
  color?: string;
  width?: number | string;
  height?: number;
  className?: string;
}

export const EcgWave: React.FC<EcgWaveProps> = ({
  color = '#10b981',
  width = '100%',
  height = 36,
  className = '',
}) => {
  return (
    <div
      className={`relative overflow-hidden select-none flex items-center ${className}`}
      style={{ width, height: `${height}px` }}
    >
      <svg
        viewBox="0 0 500 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <filter id="ecgGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background baseline */}
        <line
          x1="0"
          y1="50"
          x2="500"
          y2="50"
          stroke={color}
          strokeWidth="0.5"
          strokeOpacity="0.2"
        />

        {/* Realistic ECG cardiac pulse waveform */}
        <path
          d="M 0 50 L 50 50 L 65 42 L 75 50 L 95 50 L 105 15 L 115 85 L 125 35 L 135 55 L 145 50 L 170 50 L 190 38 L 210 50 L 250 50 L 265 42 L 275 50 L 295 50 L 305 15 L 315 85 L 325 35 L 335 55 L 345 50 L 370 50 L 390 38 L 410 50 L 500 50"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#ecgGlow)"
          className="transition-all"
        />
      </svg>
    </div>
  );
};
