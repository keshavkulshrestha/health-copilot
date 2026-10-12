'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  FileText, 
  Sparkles, 
  Globe, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Stethoscope, 
  ArrowLeft,
  Copy,
  Check,
  ShieldCheck,
  Send,
  Bot,
  User as UserIcon
} from 'lucide-react';
import { HealthRecord } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { BiomarkerBadge } from '@/components/ui/Badge';
import { LiquidProgressBar } from '@/components/animations/LiquidProgressBar';
import { EcgWave } from '@/components/animations/EcgWave';
import { MedicalSkeletonCard } from '@/components/animations/MedicalLoadingElements';
import { MedicineReminderTracker } from '@/components/medications/MedicineReminderTracker';

export default function RecordDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { t, language } = useLanguage();

  const [record, setRecord] = useState<HealthRecord | null>(null);
  const [summaryLang, setSummaryLang] = useState<'en' | 'hi'>(language);
  const [loading, setLoading] = useState(true);
  const [copiedQuestionIdx, setCopiedQuestionIdx] = useState<number | null>(null);

  // Embedded Record Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content:
        language === 'hi'
          ? 'नमस्ते! मैं आपका स्वास्थ्य कॉपायलट हूँ। इस रिपोर्ट के परीक्षण परिणामों या असामान्य मानों के बारे में मुझसे कोई भी प्रश्न पूछें।'
          : 'Hello! Ask me any question about the biomarkers, medications, or doctor follow-ups in this medical report.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatSending, setIsChatSending] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) return;
      try {
        const res = await fetch(`/api/records/${id}`);
        if (res.ok) {
          const data = await res.json();
          setRecord(data);
        }
      } catch (err) {
        console.error('Failed to fetch record:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  const handleCopyQuestion = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestionIdx(idx);
    setTimeout(() => setCopiedQuestionIdx(null), 2000);
  };

  const handleSendRecordChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatSending) return;

    const userInput = chatInput.trim();
    setChatInput('');

    const nextHistory = [...chatMessages, { role: 'user' as const, content: userInput }];
    setChatMessages(nextHistory);
    setIsChatSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userInput,
          recordId: id,
          recordContext: {
            fileName: record?.file_name,
            summary_en: record?.insights?.summary_en,
            summary_hi: record?.insights?.summary_hi,
            abnormal_flags: record?.insights?.abnormal_flags,
            test_results: record?.extracted_data.test_results,
            medicines: record?.extracted_data.medicines,
            clinical_notes: record?.extracted_data.clinical_notes,
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Chat failed');
      }

      const data = await res.json();
      const aiResponse = data.reply || data.message || 'Report analyzed.';
      setChatMessages([...nextHistory, { role: 'assistant' as const, content: aiResponse }]);
    } catch (err: any) {
      console.error('Record chat error:', err);
      setChatMessages([
        ...nextHistory,
        {
          role: 'assistant' as const,
          content: 'Unable to connect to the clinical copilot at this moment. Please try again.',
        },
      ]);
    } finally {
      setIsChatSending(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <MedicalSkeletonCard rows={5} />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">Health Record Not Found</h2>
        <p className="text-xs text-slate-500">The requested clinical record could not be loaded.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  const insights = record.insights;
  const extracted = record.extracted_data;
  const isHindi = summaryLang === 'hi';

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Health Dashboard</span>
        </Link>

        {/* English / Hindi Toggle Button */}
        <div className="flex items-center gap-2">
          <div className="flex p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800 text-xs font-bold border border-slate-300/80 dark:border-slate-700">
            <button
              onClick={() => setSummaryLang('en')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                summaryLang === 'en'
                  ? 'bg-white dark:bg-slate-900 text-brand-700 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setSummaryLang('hi')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                summaryLang === 'hi'
                  ? 'bg-white dark:bg-slate-900 text-brand-700 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>हिंदी</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                AI
              </span>
            </button>
          </div>

          <Link
            href={`/chat?recordId=${record.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-indigoBrand-600 hover:from-brand-500 hover:to-indigoBrand-500 text-white shadow-md shadow-brand-500/20 transition-all"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Consult Copilot</span>
          </Link>
        </div>
      </div>

      {/* Hero Header Card with ECG wave */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-white via-slate-50 to-brand-50/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800/80 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  {record.file_name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Uploaded: {new Date(record.created_at).toLocaleString()} • Patient: {record.patient?.name || 'Aarav Sharma'}
              </p>
            </div>
          </div>

          {/* Cardiac Vital Rhythm Strip */}
          <div className="w-44 bg-slate-950/80 p-2 rounded-xl border border-slate-800 shrink-0">
            <EcgWave color="#10b981" height={24} />
          </div>
        </div>

        {/* Clinical Plain-Language Summary Box */}
        {insights && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-500/10 via-teal-500/5 to-indigo-500/5 dark:from-brand-950/40 dark:via-slate-900 dark:to-slate-900 border border-brand-300/60 dark:border-brand-800/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-700 dark:text-brand-300">
              <Sparkles className="w-4 h-4" />
              <span>
                {isHindi ? 'एआई क्लिनिकल सारांश (विस्तृत हिंदी)' : 'AI Clinical Synthesis (Comprehensive Medical Review)'}
              </span>
            </div>
            <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-line">
              {isHindi ? insights.summary_hi : insights.summary_en}
            </div>
          </div>
        )}
      </div>

      {/* Abnormal Biomarker Flags */}
      {insights && insights.abnormal_flags && insights.abnormal_flags.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>Biomarkers Requiring Clinical Attention</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {insights.abnormal_flags.map((flag, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {flag.testName}
                  </span>
                  <BiomarkerBadge status={flag.status} />
                </div>
                <div className="text-lg font-extrabold text-slate-800 dark:text-slate-200">
                  {flag.value}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  {flag.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extracted Lab Biomarkers Table */}
      {extracted.test_results && extracted.test_results.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            {t('summary_lab_values')}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="pb-3 font-semibold">TEST PARAMETER</th>
                  <th className="pb-3 font-semibold">RESULT</th>
                  <th className="pb-3 font-semibold">REFERENCE RANGE</th>
                  <th className="pb-3 font-semibold">FLUID METER</th>
                  <th className="pb-3 font-semibold">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {extracted.test_results.map((tr, idx) => {
                  const numVal = parseFloat(String(tr.value).replace(/[^0-9.]/g, '')) || 50;
                  const progressPct = tr.status === 'low' ? 30 : tr.status === 'high' ? 88 : 60;
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                        {tr.test_name}
                      </td>
                      <td className="py-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                        {tr.value} {tr.unit || ''}
                      </td>
                      <td className="py-3 text-slate-400 font-mono text-[11px]">
                        {tr.reference_range || 'Standard range'}
                      </td>
                      <td className="py-3 w-36">
                        <LiquidProgressBar
                          progress={progressPct}
                          color={tr.status === 'low' ? 'tonic' : tr.status === 'high' ? 'ruby' : 'emerald'}
                          height={8}
                        />
                      </td>
                      <td className="py-3">
                        <BiomarkerBadge status={tr.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Prescription Adherence, Dosage Tracking & Days Remaining Tracker */}
      <MedicineReminderTracker initialMedicines={extracted.medicines} />

      {/* Lifestyle Recommendations & Questions for Doctor */}
      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lifestyle */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              {t('summary_lifestyle')}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              {insights.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Questions for Doctor */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              {t('summary_doctor_questions')}
            </h3>
            <div className="space-y-2.5 text-xs">
              {insights.questions_for_doctor.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-start justify-between gap-2 group"
                >
                  <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <HelpCircle className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                    <span>{q}</span>
                  </div>
                  <button
                    onClick={() => handleCopyQuestion(q, idx)}
                    className="text-slate-400 hover:text-brand-600 shrink-0 p-1 rounded"
                    title="Copy question"
                  >
                    {copiedQuestionIdx === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Interactive AI Chat Copilot Box */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Ask kashigha Health AI Copilot About This Report
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ask questions regarding biomarkers, BUN/creatinine, medications, or doctor follow-ups
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Copilot Connected
          </span>
        </div>

        {/* Message Thread */}
        <div className="max-h-72 overflow-y-auto space-y-3 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs">
          {chatMessages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-2.5 max-w-xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900'
                      : 'bg-brand-600 text-white'
                  }`}
                >
                  {isUser ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                <div
                  className={`p-3 rounded-2xl ${
                    isUser
                      ? 'bg-brand-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="leading-relaxed">{msg.content}</p>
                </div>
              </div>
            );
          })}
          {isChatSending && (
            <div className="flex gap-2 items-center text-slate-400 text-xs italic">
              <Bot className="w-4 h-4 animate-spin text-brand-600" />
              <span>Analyzing report parameters...</span>
            </div>
          )}
        </div>

        {/* Chat Input & Send Form */}
        <form onSubmit={handleSendRecordChat} className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask about your hemoglobin, cholesterol, glucose, or lifestyle..."
            disabled={isChatSending}
            className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || isChatSending}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5 ${
              !chatInput.trim() || isChatSending
                ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 active:scale-95'
            }`}
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
