'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  UploadCloud, 
  MessageSquare, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Activity,
  Sparkles,
  Stethoscope,
  ShieldCheck,
  Calendar,
  Pill
} from 'lucide-react';
import { HealthRecord, Patient } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { StatusBadge } from '@/components/ui/Badge';
import { EcgWave } from '@/components/animations/EcgWave';
import { MedicalSkeletonCard } from '@/components/animations/MedicalLoadingElements';
import { MedicineReminderTracker } from '@/components/medications/MedicineReminderTracker';

export default function DashboardPage() {
  const { t } = useLanguage();
  const { user, isLoggedIn, setIsLoginModalOpen } = useAuth();

  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/records');
        if (res.ok) {
          const data = await res.json();
          setRecords(data.records || []);
          setPatient(data.patient || null);
        }
      } catch (err) {
        console.error('Failed to load records:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute metrics
  const totalReports = records.length;
  const flaggedCount = records.reduce((acc, rec) => {
    const flags = rec.insights?.abnormal_flags || [];
    return acc + flags.filter((f) => f.status !== 'normal').length;
  }, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner with glowing ECG Wave and gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigoBrand-700 p-6 sm:p-8 text-white shadow-xl shadow-brand-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide uppercase mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI-Powered Personal Health Copilot</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('dash_welcome')}, {user?.name || patient?.name || 'Aarav'}!
          </h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-50/90 leading-relaxed">
            {t('dash_subtitle')}
          </p>

          {/* ABHA ID Chip & Login Link */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-xs font-mono font-medium backdrop-blur-xs border border-white/15">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>ABHA ID: {user?.abhaId || '91-8472-9102-4521'}</span>
            </span>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-xs px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-xs transition-colors font-medium border border-white/15"
            >
              {isLoggedIn ? 'Manage ABDM Profile' : 'Sign In / Link ABHA ID'}
            </button>
          </div>
        </div>

        {/* Real-time Heartbeat ECG Graph Wave */}
        <div className="relative z-10 flex flex-col items-start md:items-end p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>CLINICAL MONITOR LIVE</span>
          </div>
          <EcgWave color="#34d399" width={220} height={32} />
        </div>

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
          <p className="mt-1 text-[11px] text-slate-400">Verified Health Records</p>
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
          <p className="mt-1 text-[11px] text-slate-400">Biomarkers Outside Range</p>
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
            0
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Pipeline In Sync</p>
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
            {loading ? '...' : records.length > 0 ? 1 : 0}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Active Copilot Sessions</p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3">
          {t('dash_quick_actions')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/upload"
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
            href="/chat"
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
            href="/records"
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

      {/* Prescription Adherence, Dosage Tracking & Days Remaining Suite */}
      <div>
        <MedicineReminderTracker
          initialMedicines={
            records.flatMap((r) => r.extracted_data?.medicines || []).length > 0
              ? records.flatMap((r) => r.extracted_data?.medicines || [])
              : undefined
          }
        />
      </div>

      {/* ABDM Unified Health Profile & Timeline */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigoBrand-600 text-white shadow-md shadow-brand-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Unified ABDM Health Timeline</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 rounded-full border border-brand-300 dark:border-brand-800">
                  FHIR R4 Aligned
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chronological longitudinal health record linked to ABHA ID {user?.abhaId || '91-8472-9102-4521'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="self-start sm:self-center px-3.5 py-1.5 rounded-xl text-xs font-bold bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 transition-colors"
          >
            Manage ABHA Link
          </button>
        </div>

        {/* Timeline Items */}
        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-brand-500 before:via-teal-500 before:to-slate-300 dark:before:to-slate-700">
          {records.map((rec, idx) => (
            <div key={rec.id} className="relative group">
              {/* Timeline Node Icon */}
              <div className="absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 bg-brand-500 ring-4 ring-brand-100 dark:ring-brand-950/80 group-hover:scale-125 transition-transform" />

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 space-y-2 hover:border-brand-400 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {rec.file_name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {rec.record_type.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {new Date(rec.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {rec.extracted_data.clinical_notes ||
                    rec.insights?.summary_en?.substring(0, 160) + '...' ||
                    'Diagnostic lab parameters extracted and synced.'}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>Facility: {rec.extracted_data.lab_name || 'Diagnostic Laboratory'}</span>
                    <span>•</span>
                    <span>{rec.extracted_data.test_results?.length || 0} Biomarkers</span>
                  </div>

                  <Link
                    href={`/records/${rec.id}`}
                    className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                  >
                    <span>Inspect Record</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Medical Reports Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {t('dash_recent_reports')}
          </h3>
          <Link
            href="/records"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>{t('dash_action_library')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <MedicalSkeletonCard rows={3} />
        ) : records.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{t('dash_no_reports')}</p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{t('dash_upload_first')}</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {records.map((rec) => (
              <div
                key={rec.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 -mx-3 px-3 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate max-w-xs sm:max-w-md">
                      {rec.file_name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <span className="capitalize">{rec.record_type.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{rec.extracted_data.test_results?.length || 0} Biomarkers</span>
                      <span>•</span>
                      <span>{new Date(rec.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <StatusBadge status="completed" />
                  <Link
                    href={`/records/${rec.id}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 transition-colors"
                  >
                    {t('upload_view_summary')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
