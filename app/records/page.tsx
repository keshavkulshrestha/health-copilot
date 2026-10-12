'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Search, 
  Filter, 
  UploadCloud, 
  ArrowRight,
  Sparkles 
} from 'lucide-react';
import { HealthRecord } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { StatusBadge } from '@/components/ui/Badge';
import { MedicalSkeletonCard } from '@/components/animations/MedicalLoadingElements';

export default function RecordsLibraryPage() {
  const { t } = useLanguage();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await fetch('/api/records');
        if (res.ok) {
          const data = await res.json();
          setRecords(data.records || []);
        }
      } catch (err) {
        console.error('Failed to load records:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const filtered = records.filter((r) => {
    const matchesSearch =
      r.file_name.toLowerCase().includes(search.toLowerCase()) ||
      (r.insights?.summary_en || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || r.record_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            {t('nav_documents')}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Search, filter, and view synthesized medical records and prescriptions.
          </p>
        </div>

        <Link
          href="/upload"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition-all self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>{t('dash_action_upload')}</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search report by name, biomarker, or condition..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-auto"
        >
          <option value="">All Record Types</option>
          <option value="lab_report">Lab Reports (CBC, Lipids, etc.)</option>
          <option value="prescription">Prescriptions</option>
          <option value="discharge_summary">Discharge Summaries</option>
        </select>
      </div>

      {/* Grid of Records */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MedicalSkeletonCard rows={3} />
          <MedicalSkeletonCard rows={3} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No medical records match your criteria.
          </p>
          <p className="text-xs text-slate-400">Upload a new medical report to populate this list.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((rec) => (
            <div
              key={rec.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
                      <FileText className="w-4 h-4" />
                    </span>
                    <span className="text-[11px] font-mono capitalize text-slate-500 dark:text-slate-400">
                      {rec.record_type.replace('_', ' ')}
                    </span>
                  </div>
                  <StatusBadge status="completed" />
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                  {rec.file_name}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {rec.insights?.summary_en || 'Clinical parameters extracted and indexed.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  {new Date(rec.created_at).toLocaleDateString()}
                </span>
                <Link
                  href={`/records/${rec.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
