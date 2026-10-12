import React from 'react';
import { Activity, Sparkles, HeartPulse } from 'lucide-react';
import { SyrupFillingLoader } from './SyrupFillingLoader';
import { EcgWave } from './EcgWave';

/**
 * 1. PillDissolveLoader: Effervescent tablet dissolving with effervescent fizz bubbles
 */
export interface PillDissolveLoaderProps {
  label?: string;
  sublabel?: string;
  flavor?: 'emerald' | 'ruby' | 'honey' | 'tonic';
}

export const PillDissolveLoader: React.FC<PillDissolveLoaderProps> = ({
  label = 'Synthesizing Clinical Insights...',
  sublabel = 'Analyzing biomarker parameters and diagnostic trends',
  flavor = 'emerald',
}) => {
  const flavorStyles = {
    emerald: {
      water: 'from-emerald-400/20 to-teal-600/30',
      pill: 'from-emerald-100 to-teal-200 border-emerald-400 text-emerald-800',
      bubble: 'bg-emerald-300',
      glow: 'shadow-emerald-500/20',
      accent: 'text-emerald-600 dark:text-emerald-400',
    },
    ruby: {
      water: 'from-rose-400/20 to-red-600/30',
      pill: 'from-rose-100 to-red-200 border-rose-400 text-rose-800',
      bubble: 'bg-rose-300',
      glow: 'shadow-rose-500/20',
      accent: 'text-rose-600 dark:text-rose-400',
    },
    honey: {
      water: 'from-amber-400/20 to-orange-500/30',
      pill: 'from-amber-100 to-orange-200 border-amber-400 text-amber-800',
      bubble: 'bg-amber-300',
      glow: 'shadow-amber-500/20',
      accent: 'text-amber-600 dark:text-amber-400',
    },
    tonic: {
      water: 'from-cyan-400/20 to-blue-600/30',
      pill: 'from-cyan-100 to-blue-200 border-cyan-400 text-cyan-800',
      bubble: 'bg-cyan-300',
      glow: 'shadow-cyan-500/20',
      accent: 'text-cyan-600 dark:text-cyan-400',
    },
  }[flavor];

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Beaker / Glass Container */}
      <div className={`relative w-28 h-32 rounded-b-3xl rounded-t-lg border-2 border-slate-300/80 dark:border-slate-600/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md overflow-hidden shadow-xl ${flavorStyles.glow} flex flex-col justify-end items-center mb-4`}>
        {/* Glass reflection */}
        <div className="absolute top-0 left-1 w-2 h-full bg-gradient-to-r from-white/40 to-transparent pointer-events-none z-20" />
        <div className="absolute top-2 right-1.5 w-1 h-2/3 bg-white/20 pointer-events-none rounded-full z-20" />

        {/* Graduated markings */}
        <div className="absolute left-2 inset-y-2 flex flex-col justify-between z-10 opacity-30 text-[8px] font-mono">
          <div className="w-2 h-0.5 bg-slate-500" />
          <div className="w-3 h-0.5 bg-slate-500" />
          <div className="w-2 h-0.5 bg-slate-500" />
        </div>

        {/* Liquid level */}
        <div className={`w-full h-3/4 bg-gradient-to-t ${flavorStyles.water} relative flex items-center justify-center overflow-hidden`}>
          {/* Surface wave */}
          <div className="absolute -top-2 inset-x-0 h-4 overflow-hidden">
            <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-[200%] h-full animate-liquid-wave">
              <path d="M0,75 C150,150 350,0 500,75 L500,150 L0,150 Z" fill="rgba(255,255,255,0.4)" />
            </svg>
          </div>

          {/* Effervescing Dissolving Tablet */}
          <div className="relative z-10 animate-fizz">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${flavorStyles.pill} border shadow-lg flex items-center justify-center relative font-bold text-[9px]`}>
              <div className="w-full h-0.5 bg-slate-400/40 transform rotate-45 absolute" />
              <Sparkles className="w-4 h-4 animate-spin-slow opacity-80" />
            </div>
          </div>

          {/* Rising Effervescent Fizz Micro-Bubbles */}
          <div className={`absolute bottom-3 left-4 w-1.5 h-1.5 rounded-full ${flavorStyles.bubble} animate-bubble-fast`} />
          <div className={`absolute bottom-4 left-8 w-2 h-2 rounded-full ${flavorStyles.bubble} animate-bubble-rise`} style={{ animationDelay: '0.4s' }} />
          <div className={`absolute bottom-2 right-5 w-1.5 h-1.5 rounded-full ${flavorStyles.bubble} animate-bubble-fast`} style={{ animationDelay: '0.9s' }} />
          <div className={`absolute bottom-5 right-8 w-1 h-1 rounded-full ${flavorStyles.bubble} animate-bubble-rise`} style={{ animationDelay: '1.4s' }} />
          <div className={`absolute bottom-1 left-12 w-2 h-2 rounded-full ${flavorStyles.bubble} animate-bubble-fast`} style={{ animationDelay: '1.8s' }} />
        </div>
      </div>

      {/* Status Readout */}
      <div className="max-w-xs space-y-1">
        <div className="flex items-center justify-center gap-2">
          <Activity className={`w-4 h-4 ${flavorStyles.accent} animate-pulse`} />
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {label}
          </h4>
        </div>
        {sublabel && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * 2. CapsuleFlipLoader: 3D tumbling two-tone pill with specular shine
 */
export interface CapsuleFlipLoaderProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'emerald-white' | 'ruby-white' | 'amber-teal' | 'indigo-white';
}

export const CapsuleFlipLoader: React.FC<CapsuleFlipLoaderProps> = ({
  label = 'Processing...',
  size = 'md',
  tone = 'emerald-white',
}) => {
  const sizeMap = {
    sm: { w: 40, h: 20 },
    md: { w: 60, h: 28 },
    lg: { w: 84, h: 38 },
  }[size];

  const toneMap = {
    'emerald-white': { c1: 'bg-emerald-500', c2: 'bg-white dark:bg-slate-200' },
    'ruby-white': { c1: 'bg-rose-500', c2: 'bg-white dark:bg-slate-200' },
    'amber-teal': { c1: 'bg-amber-500', c2: 'bg-teal-400' },
    'indigo-white': { c1: 'bg-indigo-600', c2: 'bg-white dark:bg-slate-200' },
  }[tone];

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-3">
      {/* 3D Tumbling Capsule */}
      <div className="relative py-4" style={{ perspective: '800px' }}>
        <div
          className="rounded-full flex overflow-hidden border-2 border-slate-300 dark:border-slate-600 shadow-xl animate-tumble-3d relative"
          style={{ width: `${sizeMap.w}px`, height: `${sizeMap.h}px` }}
        >
          {/* Shiny reflection */}
          <div className="absolute inset-x-2 top-0.5 h-1/3 bg-white/40 rounded-full blur-[0.5px] z-10" />
          <div className={`w-1/2 h-full ${toneMap.c1}`} />
          <div className={`w-1/2 h-full ${toneMap.c2}`} />
        </div>
        {/* Ground shadow */}
        <div className="w-12 h-2 rounded-full bg-slate-400/20 dark:bg-slate-700/30 blur-xs mx-auto mt-3 transform scale-x-125 animate-pulse" />
      </div>

      {label && (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300 tracking-wide">
          {label}
        </span>
      )}
    </div>
  );
};

/**
 * 3. EcgHeartbeatLoader: Pulsing medical electrocardiogram with heart monitor
 */
export interface EcgHeartbeatLoaderProps {
  label?: string;
  bpm?: number;
}

export const EcgHeartbeatLoader: React.FC<EcgHeartbeatLoaderProps> = ({
  label = 'Synchronizing Vital Metrics...',
  bpm = 72,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-3 bg-slate-900/90 text-white rounded-2xl border border-emerald-500/30 shadow-2xl backdrop-blur-md max-w-sm w-full mx-auto">
      <div className="flex items-center justify-between w-full px-2 text-xs font-mono text-emerald-400">
        <div className="flex items-center gap-1.5">
          <HeartPulse className="w-4 h-4 text-rose-500 animate-pulse" />
          <span className="font-semibold">VITAL MONITOR</span>
        </div>
        <span className="bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
          {bpm} BPM NORMAL
        </span>
      </div>

      {/* Animated ECG Waveform */}
      <div className="w-full bg-slate-950/80 rounded-xl p-2 border border-slate-800">
        <EcgWave height={44} color="#10b981" />
      </div>

      <p className="text-xs text-slate-300 font-medium tracking-wide flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        {label}
      </p>
    </div>
  );
};

/**
 * 4. MedicalSkeletonCard: Card loading skeleton with fluid wave shimmer
 */
export const MedicalSkeletonCard: React.FC<{ rows?: number }> = ({ rows = 3 }) => {
  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-sm space-y-4 animate-pulse relative overflow-hidden">
      {/* Subtle sweeping light shimmer */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent animate-[shimmer_2s_infinite]" />

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-1.5 flex-1">
          <div className="w-1/3 h-4 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="w-1/4 h-3 rounded bg-slate-100 dark:bg-slate-800/60" />
        </div>
      </div>

      <div className="space-y-2 pt-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-3 rounded bg-slate-200/80 dark:bg-slate-800/80"
            style={{ width: `${85 - (i % 3) * 15}%` }}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * 5. PageTransitionWrapper: Entrance transition for pages & cards
 */
export const PageTransitionWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`animate-fade-in ${className}`}>
      {children}
    </div>
  );
};
