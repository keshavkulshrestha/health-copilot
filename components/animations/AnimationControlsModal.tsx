'use client';

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Droplet, 
  Sliders, 
  Check 
} from 'lucide-react';
import { useAnimations, SYRUP_FLAVORS, SyrupFlavor } from '@/context/AnimationContext';
import { PillDissolveLoader, CapsuleFlipLoader, EcgHeartbeatLoader } from './MedicalLoadingElements';
import { SyrupFillingLoader } from './SyrupFillingLoader';

export const AnimationControlsModal: React.FC = () => {
  const {
    fallingTabletsActive,
    setFallingTabletsActive,
    syrupBackgroundActive,
    setSyrupBackgroundActive,
    syrupLevel,
    setSyrupLevel,
    syrupFlavor,
    setSyrupFlavor,
    triggerTabletShower,
    isShowerBurstActive,
    isFxModalOpen,
    setIsFxModalOpen,
  } = useAnimations();

  const [activePreviewTab, setActivePreviewTab] = useState<'fizz' | 'bottle' | 'ecg' | 'capsule'>('fizz');
  const [interactiveSyrupFill, setInteractiveSyrupFill] = useState(65);

  if (!isFxModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fx-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-brand-50 to-teal-50 dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-md shadow-brand-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 id="fx-modal-title" className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Medical UI / UX Animations & FX Studio
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 rounded-full border border-brand-300 dark:border-brand-800">
                  Interactive
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time falling tablets, dynamic syrup background waves, and clinical loaders
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFxModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* SECTION 1: INTERACTIVE TABLET SHOWER BURST */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-brand-50/40 dark:from-slate-800/60 dark:to-slate-800/30 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">💊</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Falling Medicines & Tablets Cascade
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Cascading 2-tone capsules, aspirin tablets, omega-3 gel caps & vitamin C discs
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFallingTabletsActive(!fallingTabletsActive)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                  fallingTabletsActive
                    ? 'bg-brand-500 text-white border-brand-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                }`}
              >
                {fallingTabletsActive ? 'Ambient On' : 'Ambient Off'}
              </button>
            </div>

            <button
              onClick={triggerTabletShower}
              disabled={isShowerBurstActive}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2.5 transition-all transform active:scale-98 ${
                isShowerBurstActive
                  ? 'bg-brand-400 text-white cursor-wait animate-pulse'
                  : 'bg-gradient-to-r from-brand-600 via-teal-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-brand-500/25 hover:shadow-xl'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isShowerBurstActive ? 'Cascading Tablets Raining Down...' : 'Trigger Medicine Tablet Shower (Rain 32+ Pills!)'}
              </span>
            </button>
          </div>

          {/* SECTION 2: DYNAMIC SYRUP FILLING BACKGROUND RESERVOIR */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-teal-50/40 dark:from-slate-800/60 dark:to-slate-800/30 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Syrup Filling Background Wave Reservoir
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Translucent layered viscous fluid waves with rising effervescent bubbles
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSyrupBackgroundActive(!syrupBackgroundActive)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                  syrupBackgroundActive
                    ? 'bg-teal-600 text-white border-teal-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                }`}
              >
                {syrupBackgroundActive ? 'Wave Active' : 'Wave Off'}
              </button>
            </div>

            {/* Level slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Background Fluid Fill Level:
                </span>
                <span className="font-bold text-teal-600 dark:text-teal-400">
                  {syrupLevel}% {syrupLevel === 0 ? '(Empty)' : syrupLevel > 40 ? '(Deep Reservoir)' : '(Ambient Wave)'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="2"
                value={syrupLevel}
                onChange={(e) => setSyrupLevel(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0% Off</span>
                <span>12% Ambient</span>
                <span>30% Half</span>
                <span>60% Deep</span>
              </div>
            </div>

            {/* Flavor selection cards */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Syrup Tonic Formulation & Flavor:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(SYRUP_FLAVORS) as SyrupFlavor[]).map((flavorKey) => {
                  const conf = SYRUP_FLAVORS[flavorKey];
                  const isSelected = syrupFlavor === flavorKey;
                  return (
                    <button
                      key={flavorKey}
                      onClick={() => setSyrupFlavor(flavorKey)}
                      className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-950/40 ring-2 ring-brand-500/20 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full ${conf.accentBg} shrink-0 mt-0.5`} />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {conf.name.split(' ')[0]} {conf.name.split(' ')[1]}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {flavorKey}
                        </p>
                      </div>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 ml-auto shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION 3: MEDICAL LOADING ELEMENTS GALLERY & DEMO */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Medical Loading & Transition Elements
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Preview animated clinical loaders used during uploads, report summaries, and AI reasoning
                </p>
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-semibold">
              <button
                onClick={() => setActivePreviewTab('fizz')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  activePreviewTab === 'fizz'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                🫧 Dissolving Tablet
              </button>
              <button
                onClick={() => setActivePreviewTab('bottle')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  activePreviewTab === 'bottle'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                🧴 Syrup Bottle
              </button>
              <button
                onClick={() => setActivePreviewTab('ecg')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  activePreviewTab === 'ecg'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                ⚡ ECG Wave
              </button>
              <button
                onClick={() => setActivePreviewTab('capsule')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  activePreviewTab === 'capsule'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                💊 3D Capsule
              </button>
            </div>

            {/* Preview Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 min-h-[180px] flex items-center justify-center">
              {activePreviewTab === 'fizz' && (
                <PillDissolveLoader
                  flavor={syrupFlavor === 'violet' ? 'emerald' : syrupFlavor}
                  label="Compounding AI Clinical Advice..."
                  sublabel="Dissolving diagnostic parameters with Gemini 1.5 Flash"
                />
              )}

              {activePreviewTab === 'bottle' && (
                <div className="w-full flex flex-col items-center space-y-3">
                  <SyrupFillingLoader
                    percentage={interactiveSyrupFill}
                    flavor={syrupFlavor}
                    size="md"
                    label={`Pipetting ${interactiveSyrupFill}% Volume`}
                  />
                  <div className="flex items-center gap-2 w-48">
                    <button
                      onClick={() => setInteractiveSyrupFill((p) => Math.max(0, p - 20))}
                      className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-xs font-bold"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={interactiveSyrupFill}
                      onChange={(e) => setInteractiveSyrupFill(Number(e.target.value))}
                      className="flex-1 accent-brand-500"
                    />
                    <button
                      onClick={() => setInteractiveSyrupFill((p) => Math.min(100, p + 20))}
                      className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {activePreviewTab === 'ecg' && (
                <EcgHeartbeatLoader label="Synchronizing Patient Vital Rhythms..." bpm={75} />
              )}

              {activePreviewTab === 'capsule' && (
                <CapsuleFlipLoader
                  label="Compound Synthesizer Active"
                  size="md"
                  tone={
                    syrupFlavor === 'ruby'
                      ? 'ruby-white'
                      : syrupFlavor === 'honey'
                      ? 'amber-teal'
                      : syrupFlavor === 'violet'
                      ? 'indigo-white'
                      : 'emerald-white'
                  }
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Animations render at 60 FPS with hardware GPU acceleration
          </span>
          <button
            onClick={() => setIsFxModalOpen(false)}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
