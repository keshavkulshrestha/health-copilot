import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Send, 
  Plus, 
  Trash2, 
  FileText, 
  Sparkles, 
  Paperclip, 
  ShieldAlert, 
  Bot, 
  User as UserIcon,
  Globe,
  Quote,
  CheckCircle2
} from 'lucide-react';
import { api } from '../lib/api';
import { ChatConversation, ChatMessage, MedicalDocument } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { EcgWave } from '../components/animations/EcgWave';
import { SyrupFillingLoader } from '../components/animations/SyrupFillingLoader';

export const ChatPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConv, setCurrentConv] = useState<ChatConversation | null>(null);
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  
  const [inputMessage, setInputMessage] = useState('');
  const [chatLang, setChatLang] = useState<'en' | 'hi'>(language);
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConv?.messages, isSending]);

  // Initial load
  useEffect(() => {
    const initializeChat = async () => {
      setLoading(true);
      try {
        const [convs, docsRes] = await Promise.all([
          api.listConversations(),
          api.listDocuments({ limit: 50 }),
        ]);

        setConversations(convs);
        setDocuments(docsRes.items);

        // Check if redirected from summary with pre-selected document
        const incomingDocId = location.state?.selectedDocId;
        if (incomingDocId) {
          setSelectedDocId(incomingDocId);
          // Create new conversation with this doc
          const newConv = await api.createConversation({
            title: `Report Consultation`,
            selected_document_id: incomingDocId,
          });
          setConversations([newConv, ...convs]);
          setCurrentConv(newConv);
        } else if (convs.length > 0) {
          // Load first conversation
          const fullConv = await api.getConversation(convs[0].id);
          setCurrentConv(fullConv);
          if (fullConv.selected_document_id) {
            setSelectedDocId(fullConv.selected_document_id);
          }
        } else {
          // Create initial consultation
          const newConv = await api.createConversation({ title: 'General Consultation' });
          setConversations([newConv]);
          setCurrentConv(newConv);
        }
      } catch (err) {
        console.error('Failed to initialize chat:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, []);

  const handleSelectConversation = async (convId: string) => {
    try {
      const fullConv = await api.getConversation(convId);
      setCurrentConv(fullConv);
      if (fullConv.selected_document_id) {
        setSelectedDocId(fullConv.selected_document_id);
      } else {
        setSelectedDocId('');
      }
    } catch (err) {
      console.error('Failed to fetch conversation:', err);
    }
  };

  const handleCreateNewConsultation = async () => {
    try {
      const newConv = await api.createConversation({
        title: 'New Consultation',
        selected_document_id: selectedDocId || undefined,
      });
      setConversations([newConv, ...conversations]);
      setCurrentConv(newConv);
    } catch (err) {
      console.error('Failed to create consultation:', err);
    }
  };

  const handleDeleteConversation = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.deleteConversation(convId);
      const remaining = conversations.filter(c => c.id !== convId);
      setConversations(remaining);
      if (currentConv?.id === convId) {
        if (remaining.length > 0) {
          handleSelectConversation(remaining[0].id);
        } else {
          handleCreateNewConsultation();
        }
      }
    } catch (err) {
      console.error('Failed to delete consultation:', err);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !currentConv || isSending) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    // Optimistically add user message to UI
    const tempUserMsg: ChatMessage = {
      id: 'temp-' + Date.now(),
      conversation_id: currentConv.id,
      role: 'user',
      content: userText,
      citations: [],
      is_grounded: false,
      created_at: new Date().toISOString(),
    };

    setCurrentConv(prev => prev ? {
      ...prev,
      messages: [...prev.messages, tempUserMsg],
    } : null);

    try {
      const selectedDocs = selectedDocId ? [selectedDocId] : [];
      const assistantMsg = await api.sendMessage(
        currentConv.id,
        userText,
        chatLang,
        selectedDocs
      );

      // Refresh full conversation to ensure sync
      const refreshedConv = await api.getConversation(currentConv.id);
      setCurrentConv(refreshedConv);
      
      // Update sidebar title if modified
      setConversations(prev => prev.map(c => c.id === currentConv.id ? { ...c, title: refreshedConv.title } : c));
    } catch (err) {
      console.error('Failed to send message:', err);
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
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-4 animate-fade-in">
      {/* Left Sidebar: Conversations & Attachments */}
      <div className="w-full md:w-72 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 flex flex-col justify-between shadow-sm shrink-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Consultations
            </span>
            <button
              onClick={handleCreateNewConsultation}
              className="p-1.5 rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 hover:bg-brand-100 transition-colors"
              title={t('chat_new_consultation')}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Conversations List */}
          <div className="max-h-56 md:max-h-80 overflow-y-auto space-y-1 pr-1">
            {conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSelectConversation(c.id)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                  currentConv?.id === c.id
                    ? 'bg-brand-50 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="truncate max-w-[170px]">{c.title}</span>
                <button
                  onClick={(e) => handleDeleteConversation(c.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity p-0.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Document Context Selector */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {t('chat_attach_document')}
          </label>
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="w-full px-2.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 truncate"
          >
            <option value="">{t('chat_no_document')}</option>
            {documents.map((d) => (
              <option key={d.id} value={d.id}>
                📄 {d.original_filename}
              </option>
            ))}
          </select>

          {/* Language Toggle */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">Response Language:</span>
            <button
              onClick={() => setChatLang(chatLang === 'en' ? 'hi' : 'en')}
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <Globe className="w-3 h-3" />
              <span>{chatLang === 'en' ? 'English' : 'हिंदी'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl flex flex-col justify-between shadow-sm overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigoBrand-500 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {currentConv?.title || 'Health Consultation'}
              </h2>
              <p className="text-[10px] text-slate-400">
                {selectedDocId ? (
                  <span className="text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Grounded in attached report
                  </span>
                ) : (
                  'General Health Information Mode'
                )}
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:block">
            {t('chat_disclaimer')}
          </div>
        </div>

        {/* Message Flow Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {currentConv?.messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    isUser
                      ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900'
                      : 'bg-brand-600 text-white'
                  }`}
                >
                  {isUser ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                    isUser
                      ? 'bg-brand-600 text-white rounded-tr-none'
                      : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>

                  {/* Grounded Citation Badge */}
                  {m.citations && m.citations.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/40 dark:border-slate-700/40 space-y-1">
                      {m.citations.map((c, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px] text-brand-600 dark:text-brand-400 font-mono">
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

          {/* Medical Typing Indicator with ECG wave & Effervescent Micro-Bubbles */}
          {isSending && (
            <div className="flex gap-3 max-w-md mr-auto animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-md shadow-brand-500/20">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{t('chat_thinking')}</span>
                  </div>
                  {/* Mini dissolving tablet badge */}
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

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/40">
          <div className="flex items-end gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-brand-500">
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
              className={`p-2.5 rounded-xl text-white transition-all ${
                !inputMessage.trim() || isSending
                  ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'
                  : 'bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-600/20 active:scale-95'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
