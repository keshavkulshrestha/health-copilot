import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  RefreshCw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { api } from '../lib/api';
import { MedicalDocument } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAnimations } from '../context/AnimationContext';
import { SyrupFillingLoader } from '../components/animations/SyrupFillingLoader';
import { LiquidProgressBar } from '../components/animations/LiquidProgressBar';

export const UploadPage: React.FC = () => {
  const { t } = useLanguage();
  const { triggerTabletShower } = useAnimations();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedDoc, setUploadedDoc] = useState<MedicalDocument | null>(null);
  const [pipelineStatus, setPipelineStatus] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    const validExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validExtensions.includes(ext)) {
      setError('Please upload a valid file format: PDF, JPG, JPEG, or PNG.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError('File size exceeds the 25 MB maximum limit.');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    setPipelineStatus('uploading');

    try {
      const doc = await api.uploadDocument(selectedFile);
      setUploadedDoc(doc);
      setPipelineStatus(doc.status);

      // Poll status until completion or failure
      let attempts = 0;
      const pollInterval = setInterval(async () => {
        attempts += 1;
        try {
          const statusRes = await api.getDocumentStatus(doc.id);
          setPipelineStatus(statusRes.status);

          if (statusRes.status === 'completed' || statusRes.status === 'failed' || attempts > 25) {
            clearInterval(pollInterval);
            setIsUploading(false);
            if (statusRes.status === 'completed') {
              triggerTabletShower();
            } else if (statusRes.status === 'failed') {
              setError(statusRes.error_message || 'Document processing encountered an issue.');
            }
          }
        } catch (pollErr) {
          clearInterval(pollInterval);
          setIsUploading(false);
        }
      }, 2000);
    } catch (err: any) {
      setIsUploading(false);
      setError(err.message || 'Failed to upload document.');
    }
  };

  const handleRetry = async () => {
    if (!uploadedDoc) return;
    setIsUploading(true);
    setError(null);
    setPipelineStatus('processing');
    try {
      await api.retryDocument(uploadedDoc.id);
      // Resume polling
      let attempts = 0;
      const pollInterval = setInterval(async () => {
        attempts += 1;
        const statusRes = await api.getDocumentStatus(uploadedDoc.id);
        setPipelineStatus(statusRes.status);
        if (statusRes.status === 'completed' || statusRes.status === 'failed' || attempts > 25) {
          clearInterval(pollInterval);
          setIsUploading(false);
        }
      }, 2000);
    } catch (err: any) {
      setIsUploading(false);
      setError(err.message || 'Retry failed.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {t('upload_title')}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t('upload_subtitle')}
        </p>
      </div>

      {/* Drag & Drop Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all bg-white dark:bg-slate-900 ${
          isDragging
            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-3xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          {t('upload_drag_drop')}{' '}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-brand-600 dark:text-brand-400 hover:underline font-bold"
          >
            {t('upload_browse')}
          </button>
        </h3>
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          {t('upload_limits')}
        </p>

        {selectedFile && (
          <div className="mt-6 inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-left">
            <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-xs">
                {selectedFile.name}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              disabled={isUploading}
              className="ml-2 text-xs text-slate-400 hover:text-rose-500"
            >
              ✕
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className={`px-6 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-md ${
              !selectedFile || isUploading
                ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed shadow-none'
                : 'bg-brand-600 hover:bg-brand-700 shadow-brand-600/25 hover:shadow-brand-600/35 active:scale-95'
            }`}
          >
            {isUploading ? t('uploading') : t('upload_btn_submit')}
          </button>
        </div>
      </div>

      {/* Real-Time Processing Pipeline Tracker with Syrup Filling Animation */}
      {pipelineStatus && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>{t('upload_pipeline_title')}</span>
            </h3>
            {pipelineStatus === 'completed' && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                {t('upload_status_completed')}
              </span>
            )}
          </div>

          {/* Animated Medicine Syrup Filling Bottle Showcase */}
          <div className="py-4 flex flex-col sm:flex-row items-center justify-center gap-8 bg-gradient-to-b from-slate-50/80 to-slate-100/40 dark:from-slate-800/40 dark:to-slate-900/40 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800">
            <SyrupFillingLoader
              percentage={
                pipelineStatus === 'completed'
                  ? 100
                  : pipelineStatus === 'processing'
                  ? 75
                  : pipelineStatus === 'uploading'
                  ? 30
                  : pipelineStatus === 'failed'
                  ? 40
                  : 50
              }
              flavor={pipelineStatus === 'failed' ? 'ruby' : 'emerald'}
              size="md"
              label={
                pipelineStatus === 'completed'
                  ? 'Syrup Elixir 100% Prepared! Analysis Ready'
                  : pipelineStatus === 'processing'
                  ? 'Extracting clinical parameters & biomarkers...'
                  : pipelineStatus === 'uploading'
                  ? 'Uploading & validating encrypted document...'
                  : pipelineStatus === 'failed'
                  ? 'Processing paused'
                  : 'Filling medicine bottle...'
              }
            />

            <div className="flex-1 max-w-md w-full space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Fluid Pipeline Progress</span>
                  <span>
                    {pipelineStatus === 'completed'
                      ? '100%'
                      : pipelineStatus === 'processing'
                      ? '75%'
                      : '30%'}
                  </span>
                </div>
                <LiquidProgressBar
                  progress={
                    pipelineStatus === 'completed'
                      ? 100
                      : pipelineStatus === 'processing'
                      ? 75
                      : 30
                  }
                  color={pipelineStatus === 'failed' ? 'ruby' : 'emerald'}
                  height="h-3.5"
                />
              </div>

              {/* Stepper Stages */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {[
                  { label: t('upload_step_1'), done: true },
                  { 
                    label: t('upload_step_2'), 
                    done: pipelineStatus === 'processing' || pipelineStatus === 'completed' 
                  },
                  { 
                    label: t('upload_step_3'), 
                    done: pipelineStatus === 'completed' 
                  },
                  { 
                    label: t('upload_step_4'), 
                    done: pipelineStatus === 'completed' 
                  },
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border font-medium flex items-center gap-2 transition-all ${
                      step.done
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300'
                        : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-400'
                    }`}
                  >
                    {step.done ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span className="truncate">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Completion Action */}
          {pipelineStatus === 'completed' && uploadedDoc && (
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => navigate(`/documents/${uploadedDoc.id}/summary`)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 transition-all"
              >
                <span>{t('upload_view_summary')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Failure Action */}
          {pipelineStatus === 'failed' && (
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t('upload_retry')}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
