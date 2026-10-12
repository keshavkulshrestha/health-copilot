import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  Globe, 
  Moon, 
  Sun, 
  Trash2, 
  Check, 
  AlertTriangle,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { api } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/ui/Modal';

export const SettingsPage: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { user, updateUser, updatePreferences, logout } = useAuth();
  const navigate = useNavigate();

  // Profile form state
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [age, setAge] = useState(user?.age ? user.age.toString() : '');
  const [gender, setGender] = useState(user?.gender || '');
  const [bloodGroup, setBloodGroup] = useState(user?.blood_group || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Deletion modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateUser({
        full_name: fullName.trim() || undefined,
        age: age ? parseInt(age) : undefined,
        gender: gender || undefined,
        blood_group: bloodGroup || undefined,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLanguageChange = async (newLang: 'en' | 'hi') => {
    setLanguage(newLang);
    try {
      await updatePreferences({ language: newLang });
    } catch (err) {
      console.error('Failed to sync language preference:', err);
    }
  };

  const handleThemeChange = async (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    try {
      await updatePreferences({ theme: newTheme });
    } catch (err) {
      console.error('Failed to sync theme preference:', err);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await api.deleteAccount();
      navigate('/login');
    } catch (err) {
      console.error('Failed to delete account:', err);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {t('settings_title')}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your patient credentials, response language, and medical privacy.
        </p>
      </div>

      {/* Profile Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {t('settings_profile_info')}
            </h2>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {t('settings_name')}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {t('settings_age')}
              </label>
              <input
                type="number"
                min="0"
                max="125"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 35"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {t('settings_gender')}
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {t('settings_blood_group')}
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {saveSuccess && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Changes saved successfully!
              </span>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 transition-all"
              >
                {isSavingProfile ? 'Saving...' : t('settings_save')}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Preferences Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider pb-3 border-b border-slate-100 dark:border-slate-800">
          {t('settings_pref_title')}
        </h2>

        {/* Language Selection */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {t('settings_lang_label')}
            </h4>
            <p className="text-[11px] text-slate-400">Choose between English and Hindi for AI responses</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                language === 'en'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange('hi')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                language === 'hi'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {t('settings_theme_label')}
            </h4>
            <p className="text-[11px] text-slate-400">Light mode for daylight or high-contrast dark mode</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                theme === 'light'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>{t('settings_theme_light')}</span>
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                theme === 'dark'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>{t('settings_theme_dark')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 sm:p-8 rounded-3xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 space-y-4">
        <h2 className="text-sm font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
          {t('settings_danger_zone')}
        </h2>
        <p className="text-xs text-rose-600/90 dark:text-rose-300/80 leading-relaxed">
          {t('settings_delete_warning')}
        </p>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all"
        >
          <Trash2 className="w-4 h-4" />
          <span>{t('settings_delete_account')}</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Account Deletion"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <p>
              Are you completely sure? This will wipe your account, private encrypted files, OCR extracts, and chat records permanently.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeletingAccount}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
            >
              {isDeletingAccount ? 'Deleting...' : 'Permanently Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
