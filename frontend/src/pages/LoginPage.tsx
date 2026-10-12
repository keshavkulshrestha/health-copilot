import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, Lock, Mail, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useAnimations } from '../context/AnimationContext';
import { MedicalFloatingBackground } from '../components/animations/MedicalFloatingBackground';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const { triggerTabletShower } = useAnimations();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('patient@medimind.ai');
    setPassword('Password123!');
    triggerTabletShower();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors relative overflow-hidden">
      <MedicalFloatingBackground density="high" fallingTablets={true} />
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/20 mb-3">
          <HeartPulse className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {t('auth_login_title')}
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {t('auth_login_sub')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {t('settings_email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patient@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {t('auth_password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 active:scale-95 transition-all"
            >
              {isLoading ? 'Signing in...' : t('auth_login_btn')}
            </button>
          </form>

          {/* Quick Demo Credential Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2 px-3 rounded-xl text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Fill Demo Credentials</span>
            </button>
          </div>

          <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            <span>{t('auth_no_account')} </span>
            <Link to="/register" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
              {t('auth_sign_up_link')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
