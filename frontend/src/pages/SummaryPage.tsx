import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FileText, 
  Sparkles, 
  Globe, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Quote, 
  Stethoscope, 
  ArrowLeft,
  Copy,
  Check,
  ShieldCheck
} from 'lucide-react';
import { api } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { DocumentSummary, MedicalDocument } from '../types';
import { BiomarkerBadge } from '../components/ui/Badge';
import { LiquidProgressBar } from '../components/animations/LiquidProgressBar';
import { EcgWave } from '../components/animations/EcgWave';

export const SummaryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const [doc, setDoc] = useState<MedicalDocument | null>(null);
  const [summary, setSummary] = useState<DocumentSummary | null>(null);
  const [summaryLang, setSummaryLang] = useState<'en' | 'hi'>(language);
  const [loading, setLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedQuestionIdx, setCopiedQuestionIdx] = useState<number | null>(null);

  const fetchSummary = async (targetLang: 'en' | 'hi' = summaryLang, force: boolean = false) => {
    if (!id) return;
    if (force) setIsRegenerating(true);
    else setLoading(true);
    setError(null);

    try {
      // First fetch document details
      const docRes = await api.getDocument(id);
      setDoc(docRes);

      // Generate or retrieve summary
      const sumRes = await api.generateSummary(id, targetLang, force);
      setSummary(sumRes);
      setSummaryLang(targetLang);
    } catch (err: any) {
      setError(err.message || 'Failed to load medical summary.');
    } finally {
      setLoading(false);
      setIsRegenerating(false);
    }
  };

  useEffect(() => {
    fetchSummary(summaryLang, false);
  }, [id]);

  const handleLanguageToggle = () => {
    const nextLang = summaryLang === 'en' ? 'hi' : 'en';
    fetchSummary(nextLang, true);
  };

  const handleCopyQuestion = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestionIdx(idx);
    setTimeout(() => setCopiedQuestionIdx(null), 2000);
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Analyzing clinical parameters with Gemini AI...
        </p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Unable to load summary</h3>
        <p className="text-xs text-slate-500">{error || 'Summary not found.'}</p>
        <button
          onClick={() => fetchSummary(summaryLang, true)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => navigate('/documents')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Documents</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            onClick={handleLanguageToggle}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>{summaryLang === 'en' ? 'हिंदी में सारांश देखें' : 'View in English'}</span>
          </button>

          {/* Regenerate Button */}
          <button
            onClick={() => fetchSummary(summaryLang, true)}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{t('sum_regenerate')}</span>
          </button>
        </div>
      </div>

      {/* Main Summary Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400">
            <Sparkles className="w-4 h-4" />
            <span>{summary.is_ai_generated ? 'Gemini Clinical AI Analysis' : 'Clinical Rule Engine Analysis'}</span>
          </div>
          <EcgWave color="#10b981" width={160} height={24} />
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          {doc?.original_filename}
        </h1>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span>Type: {doc?.document_type}</span>
          <span>•</span>
          <span>Pages: {doc?.page_count}</span>
          <span>•</span>
          <span>Analyzed on {new Date(summary.created_at).toLocaleDateString()}</span>
        </div>

        <div className="pt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-brand-50/50 dark:bg-brand-950/30 p-4 rounded-2xl border border-brand-100 dark:border-brand-900/50">
          <p className="font-semibold text-brand-900 dark:text-brand-200 mb-1">{t('sum_executive')}:</p>
          <p>{summary.quick_summary}</p>
        </div>
      </div>

      {/* Medical Disclaimer Alert */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">{summary.disclaimer}</p>
      </div>

      {/* Biomarkers & Lab Values Table with Fluid Gauge */}
      {summary.lab_values && summary.lab_values.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <span>{t('sum_lab_table')}</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">{t('sum_col_test')}</th>
                  <th className="py-3 px-4">{t('sum_col_value')}</th>
                  <th className="py-3 px-4">{t('sum_col_range')}</th>
                  <th className="py-3 px-4">Fluid Range Meter</th>
                  <th className="py-3 px-4 rounded-r-xl">{t('sum_col_status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {summary.lab_values.map((v, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{v.name}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">
                      {v.value} {v.unit || ''}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{v.reference_range || 'N/A'}</td>
                    <td className="py-3 px-4 w-36">
                      <LiquidProgressBar
                        progress={v.status === 'low' ? 35 : v.status === 'high' ? 88 : v.status === 'critical' ? 95 : 60}
                        color={v.status === 'low' ? 'honey' : v.status === 'high' || v.status === 'critical' ? 'ruby' : 'emerald'}
                        height="h-2.5"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <BiomarkerBadge status={v.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Two Column Layout for Findings & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Findings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            {t('sum_key_findings')}
          </h2>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            {summary.key_findings.map((finding, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{finding}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Clinical Recommendations */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            {t('sum_recommendations')}
          </h2>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            {summary.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Questions for Doctor */}
      {summary.questions_for_doctor && summary.questions_for_doctor.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigoBrand-500" />
            <span>{t('sum_doctor_questions')}</span>
          </h2>
          <div className="space-y-2.5">
            {summary.questions_for_doctor.map((q, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200"
              >
                <span className="leading-relaxed pr-3">{q}</span>
                <button
                  onClick={() => handleCopyQuestion(q, idx)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
                  title="Copy question"
                >
                  {copiedQuestionIdx === idx ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grounded Source Citations */}
      {summary.citations && summary.citations.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Quote className="w-4 h-4 text-slate-400" />
            <span>{t('sum_citations')}</span>
          </h2>
          <div className="space-y-2">
            {summary.citations.map((c, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400"
              >
                <p className="italic">"{c.quote}"</p>
                <span className="text-[10px] text-slate-400 font-sans block mt-1">Page {c.page_number || 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA to Chat with this document pre-selected */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-500 to-indigoBrand-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-teal-500/10">
        <div>
          <h3 className="text-base font-bold">Have questions about this report?</h3>
          <p className="text-xs text-teal-100 mt-0.5">
            Discuss findings with MediMind AI in conversational English or Hindi.
          </p>
        </div>
        <button
          onClick={() => navigate('/chat', { state: { selectedDocId: doc?.id } })}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-md transition-all self-start sm:self-auto"
        >
          <Stethoscope className="w-4 h-4 text-brand-600" />
          <span>{t('sum_open_chat')}</span>
        </button>
      </div>
    </div>
  );
};
