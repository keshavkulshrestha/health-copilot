'use client';

import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { KashighaLogo } from '../ui/KashighaLogo';

export const AbhaLoginModal: React.FC = () => {
  const { user, login, isLoginModalOpen, setIsLoginModalOpen } = useAuth();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('••••••••');
  const [abhaId, setAbhaId] = useState(user.abhaId);
  const [phone, setPhone] = useState(user.phone);
  const [bloodGroup, setBloodGroup] = useState(user.bloodGroup);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      login({
        name,
        email,
        password,
        abhaId,
        phone,
        bloodGroup,
        isAbdmLinked: true,
      });
      setIsSubmitting(false);
      setSuccessToast(true);
      setTimeout(() => {
        setSuccessToast(false);
      }, 1500);
    }, 400);
  };

  const handleGenerateAbha = () => {
    const random12 = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const formatted = `91-${random12.slice(0, 4)}-${random12.slice(4, 8)}-${random12.slice(8, 12)}`;
    setAbhaId(formatted);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <KashighaLogo size="md" />
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              kashigha Health AI
            </h2>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ABDM Ayushman Bharat Digital Health Login</span>
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          Sign in with any email, password, and link your 14-digit ABHA ID to access instant OCR summaries and mobile dose reminders.
        </p>

        {successToast && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>ABHA Account Linked & Logged In Successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Full Name */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Patient Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Keshav Kulshrestha"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patient@healthmail.in"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password (Any input accepted)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* ABHA ID */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                ABHA ID (Ayushman Bharat Health Account)
              </label>
              <button
                type="button"
                onClick={handleGenerateAbha}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Generate Mock ABHA</span>
              </button>
            </div>
            <div className="relative">
              <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={abhaId}
                onChange={(e) => setAbhaId(e.target.value)}
                placeholder="91-2345-6789-0123"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
              />
            </div>
          </div>

          {/* Phone for Medicine Reminders & Blood Group */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone (For Reminders)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
              >
                <option value="O+">O Positive (O+)</option>
                <option value="A+">A Positive (A+)</option>
                <option value="B+">B Positive (B+)</option>
                <option value="AB+">AB Positive (AB+)</option>
                <option value="O-">O Negative (O-)</option>
                <option value="A-">A Negative (A-)</option>
                <option value="B-">B Negative (B-)</option>
                <option value="AB-">AB Negative (AB-)</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <span>{isSubmitting ? 'Linking ABHA Account...' : 'Sign In & Link ABHA ID'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <p className="mt-4 text-[10px] text-center text-slate-400">
          Compliant with Ayushman Bharat Digital Mission (ABDM) FHIR Record Standards.
        </p>
      </div>
    </div>
  );
};
