import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  UploadCloud, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Activity,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  Droplet,
  Sliders
} from 'lucide-react';
import { api } from '../lib/api';
import { MedicalDocument, ChatConversation } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAnimations, SYRUP_FLAVORS, SyrupFlavor } from '../context/AnimationContext';
import { StatusBadge } from '../components/ui/Badge';
import { EcgWave } from '../components/animations/EcgWave';
import { MedicalSkeletonCard } from '../components/animations/MedicalLoadingElements';

export const DashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { 
    triggerTabletShower, 
    isShowerBurstActive, 
    syrupBackgroundActive, 
    setSyrupBackgroundActive, 
    syrupLevel, 
    setSyrupLevel, 
    syrupFlavor, 
    setSyrupFlavor, 
    setIsFxModalOpen 
  } = useAnimations();

  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [docsRes, convsRes] = await Promise.all([
          api.listDocuments({ limit: 5 }),
          api.listConversations()
        ]);
        setDocuments(docsRes.items);
        setConversations(convsRes);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Compute metrics from real backend records
  const totalReports = documents.length;
  const processingCount = documents.filter(d => d.status === 'processing' || d.status === 'uploaded').length;
  const completedCount = documents.filter(d => d.status === 'completed').length;
  const flaggedCount = documents.reduce((acc, doc) => {
    if (doc.summary && doc.summary.lab_values) {
      const abnormal = doc.summary.lab_values.filter(v => v.status !== 'normal');
      return acc + abnormal.length;
    }
    return acc;
  }, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner with glowing ECG Wave and gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigoBrand-700 p-6 sm:p-8 text-white shadow-xl shadow-brand-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide uppercase mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI-Powered Clinical Copilot</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('dash_welcome')}, {user?.full_name || user?.email.split('@')[0]}!
          </h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-50/90 leading-relaxed">
            {t('dash_subtitle')}
          </p>
        </div>

        {/* Real-time Heartbeat ECG Graph Wave */}
        <div className="relative z-10 flex flex-col items-start md:items-end p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>CLINICAL MONITOR LIVE</span>
          </div>
          <EcgWave color="#34d399" width={220} height={32} />
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Emergency & Disclaimer Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            <strong>{t('dash_disclaimer_title')}:</strong> {t('dash_disclaimer_desc')}
          </span>
        </div>
        <span className="font-semibold text-rose-600 dark:text-rose-400 shrink-0 text-[11px] bg-rose-100 dark:bg-rose-950/60 px-2.5 py-1 rounded-full">
          {t('dash_emergency')}
        </span>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('dash_total_reports')}
            </span>
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {loading ? '...' : totalReports}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {completedCount} analyzed & verified
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('dash_flagged_markers')}
            </span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {loading ? '...' : flaggedCount}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Biomarkers outside reference range
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('dash_processing')}
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {loading ? '...' : processingCount}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Pipeline extraction jobs
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('dash_consultations')}
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigoBrand-600 dark:text-indigoBrand-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {loading ? '...' : conversations.length}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Interactive sessions
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3">
          {t('dash_quick_actions')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/upload"
            className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-brand-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {t('dash_action_upload')}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">PDF, JPG, PNG up to 25MB</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/chat"
            className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigoBrand-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigoBrand-600 dark:bg-indigo-950/60 dark:text-indigoBrand-400 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {t('dash_action_chat')}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Ask questions in EN or Hindi</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigoBrand-600 dark:group-hover:text-indigoBrand-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/documents"
            className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {t('dash_action_library')}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Search and filter all records</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>

      {/* Interactive Medical Animation & FX Suite Showcase Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-brand-50/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800/80 border border-brand-200/60 dark:border-brand-900/40 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-brand-500/25">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Medical UI / UX Animations & FX Suite
                <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 rounded-full border border-brand-300 dark:border-brand-800">
                  Live Physics
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Interactive falling medicines, dynamic background syrup waves, and clinical transition elements
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsFxModalOpen(true)}
            className="self-start sm:self-center px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-all shadow-xs"
          >
            <Sliders className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Open Studio</span>
          </button>
        </div>

        {/* Quick Animation Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Falling Tablets Trigger */}
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">💊</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                  Medicines & Tablets Cascade
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Rain 32+ dual-tone capsules, split aspirin, vitamin C discs, and omega-3 gel caps across viewport
              </p>
            </div>

            <button
              onClick={triggerTabletShower}
              disabled={isShowerBurstActive}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                isShowerBurstActive
                  ? 'bg-brand-500 text-white cursor-wait animate-pulse'
                  : 'bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white shadow-brand-500/20 active:scale-98'
              }`}
            >
              <span>{isShowerBurstActive ? 'Cascading Tablets Showering...' : 'Rain Falling Medicines Now'}</span>
              <span className="text-sm">🌧️</span>
            </button>
          </div>

          {/* Syrup Background Wave Controls */}
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                    Syrup Wave Background
                  </h4>
                </div>
                <button
                  onClick={() => setSyrupBackgroundActive(!syrupBackgroundActive)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors ${
                    syrupBackgroundActive
                      ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-800'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 border-slate-200'
                  }`}
                >
                  {syrupBackgroundActive ? 'Wave Active' : 'Wave Off'}
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Reservoir Level:</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">{syrupLevel}% Fluid</span>
              </div>
            </div>

            {/* Level slider */}
            <input
              type="range"
              min="0"
              max="50"
              step="2"
              value={syrupLevel}
              onChange={(e) => setSyrupLevel(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />

            {/* Flavor chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
              {(['emerald', 'ruby', 'honey', 'tonic', 'violet'] as SyrupFlavor[]).map((flv) => (
                <button
                  key={flv}
                  onClick={() => setSyrupFlavor(flv)}
                  className={`px-2 py-0.5 rounded-full font-semibold border capitalize transition-all ${
                    syrupFlavor === flv
                      ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                  }`}
                >
                  {flv}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Medical Reports Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {t('dash_recent_reports')}
          </h3>
          <Link
            to="/documents"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>{t('dash_action_library')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <MedicalSkeletonCard rows={3} />
        ) : documents.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{t('dash_no_reports')}</p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{t('dash_upload_first')}</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 -mx-3 px-3 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate max-w-xs sm:max-w-md">
                      {doc.original_filename}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <span>{doc.document_type}</span>
                      <span>•</span>
                      <span>{(doc.file_size / 1024).toFixed(1)} KB</span>
                      <span>•</span>
                      <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <StatusBadge status={doc.status} />
                  {doc.status === 'completed' && (
                    <Link
                      to={`/documents/${doc.id}/summary`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 transition-colors"
                    >
                      {t('upload_view_summary')}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
