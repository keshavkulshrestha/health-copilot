import React from 'react';

interface EcgWaveProps {
  color?: string;
  height?: number;
  width?: number;
  className?: string;
}

export const EcgWave: React.FC<EcgWaveProps> = ({
  color = '#10b981',
  height = 36,
  width = 240,
  className = '',
}) => {
  return (
    <div className={`relative overflow-hidden inline-flex items-center ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 300 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-90"
      >
        {/* Faded Background Trace */}
        <path
          d="M0 25 L40 25 L48 10 L56 40 L64 5 L72 35 L80 25 L120 25 L128 10 L136 40 L144 5 L152 35 L160 25 L200 25 L208 10 L216 40 L224 5 L232 35 L240 25 L300 25"
          stroke={color}
          strokeWidth="1.5"
          strokeOpacity="0.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Animated Glow Line */}
        <path
          d="M0 25 L40 25 L48 10 L56 40 L64 5 L72 35 L80 25 L120 25 L128 10 L136 40 L144 5 L152 35 L160 25 L200 25 L208 10 L216 40 L224 5 L232 35 L240 25 L300 25"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="60 240"
          className="animate-pulse-glow"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="300"
            to="0"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  );
};
