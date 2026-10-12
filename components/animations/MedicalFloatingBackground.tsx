'use client';

import React, { useMemo } from 'react';
import { useAnimations, SYRUP_FLAVORS } from '@/context/AnimationContext';

interface MedicalFloatingBackgroundProps {
  density?: 'low' | 'normal' | 'high';
}

export const MedicalFloatingBackground: React.FC<MedicalFloatingBackgroundProps> = ({
  density = 'normal',
}) => {
  const {
    fallingTabletsActive,
    syrupBackgroundActive,
    syrupLevel,
    syrupFlavor,
    isShowerBurstActive,
    burstCount,
  } = useAnimations();

  const flavorConfig = SYRUP_FLAVORS[syrupFlavor];

  // Ambient floating medical elements
  const floatingElements = useMemo(() => {
    const count = density === 'low' ? 8 : density === 'high' ? 18 : 12;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      type: (['capsule', 'round-tablet', 'oval-pill', 'cross', 'dna'] as const)[i % 5],
      left: `${(i * 97) % 94 + 3}%`,
      top: `${(i * 73) % 86 + 6}%`,
      size: i % 3 === 0 ? 38 : i % 3 === 1 ? 28 : 22,
      delay: `${(i * 0.8) % 5}s`,
      duration: `${6 + (i % 4) * 2}s`,
      rotation: (i * 47) % 360,
      colorTheme: (['emerald', 'rose', 'amber', 'teal', 'indigo'] as const)[i % 5],
    }));
  }, [density]);

  // Ambient gently falling tablets
  const ambientFalling = useMemo(() => {
    if (!fallingTabletsActive) return [];
    return Array.from({ length: 9 }, (_, i) => ({
      id: `ambient-${i}`,
      left: `${(i * 11) + 4}%`,
      delay: `${i * 1.4}s`,
      duration: `${7.5 + (i % 3) * 2}s`,
      size: 18 + (i % 3) * 6,
      type: (['capsule-red', 'capsule-blue', 'tablet-round', 'gel-cap'] as const)[i % 4],
    }));
  }, [fallingTabletsActive]);

  // Burst shower tablets: 32 high-energy cascading tablets triggered by user
  const burstTablets = useMemo(() => {
    if (!isShowerBurstActive) return [];
    return Array.from({ length: 32 }, (_, i) => ({
      id: `burst-${burstCount}-${i}`,
      left: `${(i * 3.1) + ((i % 5) * 1.5) + 1}%`,
      delay: `${(i * 0.08).toFixed(2)}s`,
      duration: `${2.8 + (i % 5) * 0.4}s`,
      size: 18 + (i % 4) * 7,
      type: (['capsule-ruby', 'capsule-mint', 'capsule-honey', 'tablet-aspirin', 'tablet-vitamin', 'gel-omega', 'lozenge'] as const)[i % 7],
      rotationOffset: (i * 53) % 360,
    }));
  }, [isShowerBurstActive, burstCount]);

  // Bubbles inside the syrup reservoir
  const bubbles = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      left: `${(i * 7.1) + 2}%`,
      delay: `${(i * 0.4) % 3.2}s`,
      duration: `${2.5 + (i % 3) * 1}s`,
      size: 3 + (i % 4) * 3,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none" aria-hidden="true">
      {/* Subtle ambient light glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-400/10 dark:bg-emerald-600/10 blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-teal-400/10 dark:bg-teal-500/10 blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-indigo-400/10 dark:bg-indigo-600/10 blur-3xl" />

      {/* 1. AMBIENT FALLING TABLETS */}
      {ambientFalling.map((item) => (
        <div
          key={item.id}
          className="absolute opacity-25 dark:opacity-20 animate-fall-tablet will-change-transform"
          style={{
            left: item.left,
            animationDelay: item.delay,
            animationDuration: item.duration,
            top: '-50px',
          }}
        >
          {item.type === 'capsule-red' ? (
            <div
              className="rounded-full shadow-sm flex overflow-hidden border border-slate-300/60 dark:border-slate-700"
              style={{
                width: `${item.size * 1.8}px`,
                height: `${item.size}px`,
                transform: 'rotate(32deg)',
              }}
            >
              <div className="w-1/2 h-full bg-rose-500" />
              <div className="w-1/2 h-full bg-white dark:bg-slate-200" />
            </div>
          ) : item.type === 'capsule-blue' ? (
            <div
              className="rounded-full shadow-sm flex overflow-hidden border border-slate-300/60 dark:border-slate-700"
              style={{
                width: `${item.size * 1.8}px`,
                height: `${item.size}px`,
                transform: 'rotate(-40deg)',
              }}
            >
              <div className="w-1/2 h-full bg-sky-500" />
              <div className="w-1/2 h-full bg-amber-400" />
            </div>
          ) : item.type === 'gel-cap' ? (
            <div
              className="rounded-full shadow-inner bg-amber-400/80 border border-amber-300/90 backdrop-blur-xs flex items-center justify-center"
              style={{
                width: `${item.size * 1.5}px`,
                height: `${item.size * 0.9}px`,
                transform: 'rotate(25deg)',
              }}
            >
              <div className="w-1/2 h-1/2 rounded-full bg-white/40" />
            </div>
          ) : (
            <div
              className="rounded-full shadow-sm bg-gradient-to-br from-white to-slate-200 dark:from-slate-600 dark:to-slate-800 border border-slate-300/80 dark:border-slate-600 relative flex items-center justify-center"
              style={{
                width: `${item.size}px`,
                height: `${item.size}px`,
              }}
            >
              <div className="w-full h-0.5 bg-slate-300 dark:bg-slate-500 transform rotate-45" />
            </div>
          )}
        </div>
      ))}

      {/* 2. DYNAMIC SHOWER BURST TABLETS (User Triggered) */}
      {burstTablets.map((item) => (
        <div
          key={item.id}
          className="absolute z-20 animate-fall-burst will-change-transform filter drop-shadow-md"
          style={{
            left: item.left,
            animationDelay: item.delay,
            animationDuration: item.duration,
            top: '-60px',
          }}
        >
          {item.type === 'capsule-ruby' ? (
            <div
              className="rounded-full flex overflow-hidden border border-rose-300 shadow-md transform"
              style={{
                width: `${item.size * 2}px`,
                height: `${item.size}px`,
                transform: `rotate(${item.rotationOffset}deg)`,
              }}
            >
              <div className="w-1/2 h-full bg-rose-600 flex items-center justify-center text-[7px] font-bold text-white/90">
                500
              </div>
              <div className="w-1/2 h-full bg-white dark:bg-slate-100" />
            </div>
          ) : item.type === 'capsule-mint' ? (
            <div
              className="rounded-full flex overflow-hidden border border-emerald-300 shadow-md transform"
              style={{
                width: `${item.size * 2}px`,
                height: `${item.size}px`,
                transform: `rotate(${item.rotationOffset}deg)`,
              }}
            >
              <div className="w-1/2 h-full bg-emerald-500" />
              <div className="w-1/2 h-full bg-teal-100" />
            </div>
          ) : item.type === 'capsule-honey' ? (
            <div
              className="rounded-full flex overflow-hidden border border-amber-300 shadow-md transform"
              style={{
                width: `${item.size * 2}px`,
                height: `${item.size}px`,
                transform: `rotate(${item.rotationOffset}deg)`,
              }}
            >
              <div className="w-1/2 h-full bg-amber-500" />
              <div className="w-1/2 h-full bg-orange-400" />
            </div>
          ) : item.type === 'tablet-aspirin' ? (
            <div
              className="rounded-full shadow-lg bg-gradient-to-tr from-slate-100 via-white to-slate-200 border-2 border-slate-300 flex items-center justify-center relative transform"
              style={{
                width: `${item.size * 1.2}px`,
                height: `${item.size * 1.2}px`,
                transform: `rotate(${item.rotationOffset}deg)`,
              }}
            >
              <div className="w-full h-0.5 bg-slate-400/80 transform rotate-45" />
              <div className="absolute text-[6px] font-mono text-slate-500 font-bold">M</div>
            </div>
          ) : item.type === 'tablet-vitamin' ? (
            <div
              className="rounded-full shadow-md bg-gradient-to-br from-amber-200 to-orange-300 border border-amber-400 flex items-center justify-center relative transform"
              style={{
                width: `${item.size * 1.1}px`,
                height: `${item.size * 1.1}px`,
                transform: `rotate(${item.rotationOffset}deg)`,
              }}
            >
              <span className="text-[7px] font-bold text-amber-900">Vit C</span>
            </div>
          ) : item.type === 'gel-omega' ? (
            <div
              className="rounded-full shadow-md bg-gradient-to-r from-amber-400/90 to-yellow-300/80 border border-yellow-200 backdrop-blur-xs flex items-center justify-center transform"
              style={{
                width: `${item.size * 1.7}px`,
                height: `${item.size}px`,
                transform: `rotate(${item.rotationOffset}deg)`,
              }}
            >
              <div className="w-1/3 h-1/3 rounded-full bg-white/60 blur-[1px]" />
            </div>
          ) : (
            <div
              className="rounded-md shadow-md bg-gradient-to-tr from-purple-400 to-indigo-500 border border-purple-300 flex items-center justify-center transform"
              style={{
                width: `${item.size * 1.1}px`,
                height: `${item.size * 1.1}px`,
                transform: `rotate(${item.rotationOffset}deg)`,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
            </div>
          )}
        </div>
      ))}

      {/* 3. AMBIENT FLOATING BACKGROUND ELEMENTS */}
      {floatingElements.map((el) => {
        return (
          <div
            key={el.id}
            className="absolute transition-transform will-change-transform opacity-30 dark:opacity-25 animate-float-slow hover:opacity-70"
            style={{
              left: el.left,
              top: el.top,
              animationDelay: el.delay,
              animationDuration: el.duration,
            }}
          >
            {el.type === 'capsule' && (
              <div
                className="rounded-full shadow-md flex overflow-hidden border border-slate-300/80 dark:border-slate-700/80 transition-transform duration-300 hover:scale-125"
                style={{
                  width: `${el.size * 2.2}px`,
                  height: `${el.size}px`,
                  transform: `rotate(${el.rotation}deg)`,
                }}
              >
                <div
                  className={`w-1/2 h-full ${
                    el.colorTheme === 'emerald'
                      ? 'bg-emerald-500'
                      : el.colorTheme === 'rose'
                      ? 'bg-rose-500'
                      : el.colorTheme === 'amber'
                      ? 'bg-amber-500'
                      : el.colorTheme === 'teal'
                      ? 'bg-teal-500'
                      : 'bg-indigo-500'
                  }`}
                />
                <div className="w-1/2 h-full bg-white/95 dark:bg-slate-200/90 shadow-inner" />
              </div>
            )}

            {el.type === 'round-tablet' && (
              <div
                className="rounded-full shadow-md bg-gradient-to-tr from-white via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 border border-slate-300/80 dark:border-slate-600/80 relative flex items-center justify-center transition-transform duration-300 hover:scale-125"
                style={{
                  width: `${el.size * 1.3}px`,
                  height: `${el.size * 1.3}px`,
                  transform: `rotate(${el.rotation}deg)`,
                }}
              >
                <div className="w-full h-0.5 bg-slate-300 dark:bg-slate-600" />
              </div>
            )}

            {el.type === 'oval-pill' && (
              <div
                className="rounded-full shadow-md bg-gradient-to-r from-teal-400/80 to-emerald-500/80 dark:from-teal-600/80 dark:to-emerald-700/80 border border-teal-300/60 dark:border-teal-700/60 transition-transform duration-300 hover:scale-125"
                style={{
                  width: `${el.size * 1.8}px`,
                  height: `${el.size * 1.1}px`,
                  transform: `rotate(${el.rotation}deg)`,
                }}
              />
            )}

            {el.type === 'cross' && (
              <div
                className="relative flex items-center justify-center text-brand-500/60 dark:text-brand-400/50 transition-transform duration-300 hover:scale-125"
                style={{
                  width: `${el.size}px`,
                  height: `${el.size}px`,
                  transform: `rotate(${el.rotation}deg)`,
                }}
              >
                <div className="absolute w-full h-2 bg-brand-500/40 rounded-full" />
                <div className="absolute h-full w-2 bg-brand-500/40 rounded-full" />
              </div>
            )}

            {el.type === 'dna' && (
              <div
                className="flex items-center gap-1.5 opacity-40 transition-transform duration-300 hover:scale-125"
                style={{
                  transform: `rotate(${el.rotation}deg)`,
                }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                <div className="w-4 h-0.5 bg-slate-300 dark:bg-slate-600" />
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
              </div>
            )}
          </div>
        );
      })}

      {/* 4. SYRUP FILLING BACKGROUND RESERVOIR (Bottom Waves + Rising Effervescence) */}
      {syrupBackgroundActive && syrupLevel > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 z-0 transition-all duration-700 ease-out overflow-hidden pointer-events-none"
          style={{
            height: `${syrupLevel}%`,
            minHeight: syrupLevel > 0 ? '48px' : '0px',
            maxHeight: '90vh',
          }}
        >
          {/* Wave Layer 1 */}
          <div className="absolute -top-6 left-0 right-0 h-12 overflow-hidden opacity-40">
            <svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="w-[200%] h-full animate-liquid-wave-reverse"
            >
              <path
                d="M0,0 C150,90 350,-40 500,45 C650,120 850,-20 1000,60 C1150,110 1350,-30 1500,50 L1500,120 L0,120 Z"
                fill={flavorConfig.waveColor}
              />
            </svg>
          </div>

          {/* Wave Layer 2 */}
          <div className="absolute -top-5 left-0 right-0 h-10 overflow-hidden opacity-80">
            <svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="w-[200%] h-full animate-liquid-wave"
            >
              <path
                d="M0,45 C150,-20 350,100 500,30 C650,-30 850,90 1000,40 C1150,-10 1350,85 1500,35 L1500,120 L0,120 Z"
                fill={flavorConfig.waveColor}
              />
            </svg>
          </div>

          {/* Deep Viscous Syrup Fluid Reservoir Body */}
          <div
            className={`w-full h-full bg-gradient-to-t ${flavorConfig.gradient} backdrop-blur-xs relative overflow-hidden`}
            style={{
              boxShadow: `0 -10px 40px ${flavorConfig.glowColor}`,
            }}
          >
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            {bubbles.map((b) => (
              <div
                key={b.id}
                className="absolute rounded-full animate-bubble-rise"
                style={{
                  left: b.left,
                  bottom: '4px',
                  width: `${b.size}px`,
                  height: `${b.size}px`,
                  backgroundColor: flavorConfig.bubbleColor,
                  animationDelay: b.delay,
                  animationDuration: b.duration,
                  boxShadow: `0 0 6px ${flavorConfig.glowColor}`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
