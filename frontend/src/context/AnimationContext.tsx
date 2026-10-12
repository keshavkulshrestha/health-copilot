import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type SyrupFlavor = 'emerald' | 'ruby' | 'honey' | 'tonic' | 'violet';

export interface SyrupColorConfig {
  name: string;
  gradient: string;
  waveColor: string;
  glowColor: string;
  bubbleColor: string;
  accentBg: string;
  description: string;
}

export const SYRUP_FLAVORS: Record<SyrupFlavor, SyrupColorConfig> = {
  emerald: {
    name: 'Emerald Healing Tonic',
    gradient: 'from-emerald-500/25 via-teal-600/30 to-emerald-700/40',
    waveColor: 'rgba(16, 185, 129, 0.45)',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    bubbleColor: 'rgba(167, 243, 208, 0.8)',
    accentBg: 'bg-emerald-500',
    description: 'Refreshing herbal antiseptic blend with spearmint notes',
  },
  ruby: {
    name: 'Ruby Cough Elixir',
    gradient: 'from-rose-500/25 via-red-600/30 to-rose-700/40',
    waveColor: 'rgba(244, 63, 94, 0.45)',
    glowColor: 'rgba(244, 63, 94, 0.35)',
    bubbleColor: 'rgba(254, 205, 211, 0.8)',
    accentBg: 'bg-rose-500',
    description: 'Soothing wild cherry throat coating syrup',
  },
  honey: {
    name: 'Golden Honey Bio-Elixir',
    gradient: 'from-amber-400/25 via-orange-500/30 to-amber-600/40',
    waveColor: 'rgba(245, 158, 11, 0.45)',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    bubbleColor: 'rgba(253, 230, 138, 0.8)',
    accentBg: 'bg-amber-500',
    description: 'Rich immune-supportive honey and propolis extract',
  },
  tonic: {
    name: 'Sapphire Electrolyte Infusion',
    gradient: 'from-cyan-400/25 via-blue-500/30 to-cyan-600/40',
    waveColor: 'rgba(6, 182, 212, 0.45)',
    glowColor: 'rgba(6, 182, 212, 0.35)',
    bubbleColor: 'rgba(165, 243, 252, 0.8)',
    accentBg: 'bg-cyan-500',
    description: 'Rapid rehydration & vital mineral electrolyte solution',
  },
  violet: {
    name: 'Amethyst Restorative Draught',
    gradient: 'from-purple-500/25 via-indigo-600/30 to-purple-700/40',
    waveColor: 'rgba(139, 92, 246, 0.45)',
    glowColor: 'rgba(139, 92, 246, 0.35)',
    bubbleColor: 'rgba(221, 214, 254, 0.8)',
    accentBg: 'bg-purple-500',
    description: 'Calming lavender & neuro-supportive sleep formulation',
  },
};

interface AnimationContextType {
  fallingTabletsActive: boolean;
  setFallingTabletsActive: (active: boolean) => void;
  syrupBackgroundActive: boolean;
  setSyrupBackgroundActive: (active: boolean) => void;
  syrupLevel: number;
  setSyrupLevel: (level: number) => void;
  syrupFlavor: SyrupFlavor;
  setSyrupFlavor: (flavor: SyrupFlavor) => void;
  isShowerBurstActive: boolean;
  triggerTabletShower: () => void;
  isFxModalOpen: boolean;
  setIsFxModalOpen: (open: boolean) => void;
  burstCount: number;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fallingTabletsActive, setFallingTabletsActive] = useState<boolean>(() => {
    const saved = localStorage.getItem('medimind_falling_tablets');
    return saved !== null ? saved === 'true' : true;
  });

  const [syrupBackgroundActive, setSyrupBackgroundActive] = useState<boolean>(() => {
    const saved = localStorage.getItem('medimind_syrup_bg');
    return saved !== null ? saved === 'true' : true;
  });

  const [syrupLevel, setSyrupLevel] = useState<number>(() => {
    const saved = localStorage.getItem('medimind_syrup_level');
    return saved !== null ? Number(saved) : 12; // default 12% subtle resting reservoir
  });

  const [syrupFlavor, setSyrupFlavor] = useState<SyrupFlavor>(() => {
    const saved = localStorage.getItem('medimind_syrup_flavor');
    return (saved as SyrupFlavor) || 'emerald';
  });

  const [isShowerBurstActive, setIsShowerBurstActive] = useState(false);
  const [burstCount, setBurstCount] = useState(0);
  const [isFxModalOpen, setIsFxModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('medimind_falling_tablets', String(fallingTabletsActive));
  }, [fallingTabletsActive]);

  useEffect(() => {
    localStorage.setItem('medimind_syrup_bg', String(syrupBackgroundActive));
  }, [syrupBackgroundActive]);

  useEffect(() => {
    localStorage.setItem('medimind_syrup_level', String(syrupLevel));
  }, [syrupLevel]);

  useEffect(() => {
    localStorage.setItem('medimind_syrup_flavor', syrupFlavor);
  }, [syrupFlavor]);

  const triggerTabletShower = useCallback(() => {
    setIsShowerBurstActive(true);
    setBurstCount((prev) => prev + 1);
    const timer = setTimeout(() => {
      setIsShowerBurstActive(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimationContext.Provider
      value={{
        fallingTabletsActive,
        setFallingTabletsActive,
        syrupBackgroundActive,
        setSyrupBackgroundActive,
        syrupLevel,
        setSyrupLevel,
        syrupFlavor,
        setSyrupFlavor,
        isShowerBurstActive,
        triggerTabletShower,
        isFxModalOpen,
        setIsFxModalOpen,
        burstCount,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimations = (): AnimationContextType => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimations must be used within an AnimationProvider');
  }
  return context;
};
