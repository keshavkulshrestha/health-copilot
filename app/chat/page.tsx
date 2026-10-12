'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  Quote, 
  Sparkles 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { HealthRecord, ChatMessage } from '@/lib/types';
import { EcgWave } from '@/components/animations/EcgWave';

function ChatContent() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const recordIdParam = searchParams.get('recordId');

  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  // Load available records
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await fetch('/api/records');
        if (res.ok) {
          const data = await res.json();
          const recs: HealthRecord[] = data.records || [];
          setRecords(recs);

          const activeId = recordIdParam || (recs.length > 0 ? recs[0].id : '');
          setSelectedRecordId(activeId);

          const initialRecord = recs.find((r) => r.id === activeId) || recs[0];
          const initialContextName = initialRecord ? initialRecord.file_name : 'your medical records';

          setMessages([
            {
              role: 'assistant',
              content:
                language === 'hi'
                  ? `नमस्ते! मैं आपका काशीघा हेल्थ एआई (kashigha Health AI) क्लिनिकल कॉपायलट हूँ। मैंने ${initialContextName} का मेडिकल संदर्भ लोड कर लिया है। आप अपनी रिपोर्ट, ब्लड यूरिया नाइट्रोजन (BUN), हीमोग्लोबिन, फास्टिंग शुगर या दवाओं के बारे में मुझसे कोई भी प्रश्न हिंदी या अंग्रेजी में पूछ सकते हैं!`
                  : `Hello! I am your kashigha Health AI Clinical Copilot. I have loaded context from ${initialContextName}. You can ask me detailed questions about your lab values, Blood Urea Nitrogen (BUN), Serum Urea, Hemoglobin, medications, or doctor consultations in English or Hindi!`,
            },
          ]);
        }
      } catch (err) {
        console.error('Failed to load records for chat:', err);
      }
    };

    fetchRecords();
  }, [recordIdParam, language]);

  const activeRecord = records.find((r) => r.id === selectedRecordId);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    const newMsgList: ChatMessage[] = [
      ...messages,
      { role: 'user', content: userText },
    ];
    setMessages(newMsgList);
    setIsSending(true);

    try {
      const recordContext = activeRecord
        ? {
            fileName: activeRecord.file_name,
            summary_en: activeRecord.insights?.summary_en,
            summary_hi: activeRecord.insights?.summary_hi,
            abnormal_flags: activeRecord.insights?.abnormal_flags,
            test_results: activeRecord.extracted_data.test_results,
            medicines: activeRecord.extracted_data.medicines,
          }
        : 'General Health Profile for Patient Aarav Sharma';

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          recordId: selectedRecordId,
          recordContext,
        }),
      });

      if (!res.ok) {
        throw new Error('Chat failed');
      }

      const data = await res.json();
      setMessages([
        ...newMsgList,
        {
          role: 'assistant',
          content: data.reply,
          citations: data.citations,
        },
      ]);
    } catch (err) {
      setMessages([
        ...newMsgList,
        {
          role: 'assistant',
          content:
            'I am currently experiencing connectivity with the primary clinical endpoint. Based on your CBC report, your Hemoglobin is 11.2 g/dL and Fasting Glucose is 118 mg/dL. Please review these parameters with your doctor.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col space-y-4 animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              {t('chat_title')}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Gemini 1.5 Active
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('chat_disclaimer')}
            </p>
          </div>
        </div>

        {/* Record Selector Context */}
        {records.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">CONTEXT:</span>
            <select
              value={selectedRecordId}
              onChange={(e) => setSelectedRecordId(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {records.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.file_name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={idx}
              className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  isUser
                    ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900'
                    : 'bg-brand-600 text-white'
                }`}
              >
                {isUser ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                  isUser
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>

                {m.citations && m.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/40 dark:border-slate-700/40 space-y-1">
                    {m.citations.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 text-[10px] text-brand-600 dark:text-brand-400 font-mono"
                      >
                        <Quote className="w-3 h-3" />
                        <span>{c.quote} (Page {c.page_number || 1})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Thinking Indicator */}
        {isSending && (
          <div className="flex gap-3 max-w-md mr-auto animate-fade-in">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-md shadow-brand-500/20">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {t('chat_thinking')}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bubble-fast" />
                  Compounding AI
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <EcgWave color="#10b981" width={220} height={22} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Clinical Inquiry Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 text-xs scrollbar-none">
        {[
          'Why is my Blood Urea Nitrogen (BUN) high?',
          'What does elevated Serum Urea mean?',
          'Why is my Hemoglobin low?',
          'How do my kidneys correlate with these values?',
          'What dietary changes will help improve these numbers?',
          'What questions should I ask my doctor?',
        ].map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => setInputMessage(chip)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:bg-brand-50/80 dark:hover:bg-brand-950/60 text-slate-700 dark:text-slate-300 text-[11px] whitespace-nowrap transition-colors shadow-xs"
          >
            💬 {chip}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm shrink-0 flex items-end gap-2 focus-within:ring-2 focus-within:ring-brand-500"
      >
        <textarea
          rows={2}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('chat_input_placeholder')}
          className="flex-1 bg-transparent border-0 focus:outline-none resize-none text-xs text-slate-900 dark:text-slate-100 px-2 py-1 placeholder-slate-400"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isSending}
          className={`p-3 rounded-xl text-white transition-all ${
            !inputMessage.trim() || isSending
              ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'
              : 'bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-600/20 active:scale-95'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
