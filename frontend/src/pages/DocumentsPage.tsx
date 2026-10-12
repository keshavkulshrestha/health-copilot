import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Filter, 
  Trash2, 
  ExternalLink, 
  Eye, 
  Sparkles, 
  AlertTriangle,
  ArrowUpDown,
  Download
} from 'lucide-react';
import { api } from '../lib/api';
import { MedicalDocument } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { StatusBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { MedicalSkeletonCard } from '../components/animations/MedicalLoadingElements';

export const DocumentsPage: React.FC = () => {
  const { t } = useLanguage();
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('desc');

  // Preview Modal state
  const [previewDoc, setPreviewDoc] = useState<MedicalDocument | null>(null);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [loadingContent, setLoadingContent] = useState(false);

  // Deletion Modal state
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const res = await api.listDocuments({
        search: search.trim() || undefined,
        status: statusFilter || undefined,
        document_type: docTypeFilter || undefined,
        sort_by: sortBy,
        order: order,
        limit: 50,
      });
      setDocuments(res.items);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDocuments();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter, docTypeFilter, sortBy, order]);

  const handleOpenPreview = async (doc: MedicalDocument) => {
    setPreviewDoc(doc);
    setLoadingContent(true);
    try {
      const content = await api.getDocumentContent(doc.id);
      setPreviewContent(content.extracted_text || 'No extracted text found.');
    } catch (err) {
      setPreviewContent('Failed to load document content.');
    } finally {
      setLoadingContent(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteDocId) return;
    setIsDeleting(true);
    try {
      await api.deleteDocument(deleteDocId);
      setDeleteDocId(null);
      await loadDocuments();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            {t('doc_title')}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t('doc_subtitle')}
          </p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 transition-all self-start sm:self-auto"
        >
          <span>{t('dash_action_upload')}</span>
        </Link>
      </div>

      {/* Search & Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('doc_search_placeholder')}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={docTypeFilter}
            onChange={(e) => setDocTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-auto"
          >
            <option value="">{t('doc_filter_all')}</option>
            <option value="Complete Blood Count / Lab Report">{t('doc_filter_lab')}</option>
            <option value="Prescription">{t('doc_filter_rx')}</option>
            <option value="Discharge Summary">{t('doc_filter_discharge')}</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-auto"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>

          {/* Sort By */}
          <select
            value={`${sortBy}-${order}`}
            onChange={(e) => {
              const [sb, ord] = e.target.value.split('-');
              setSortBy(sb);
              setOrder(ord);
            }}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-auto"
          >
            <option value="created_at-desc">{t('doc_sort_newest')}</option>
            <option value="created_at-asc">{t('doc_sort_oldest')}</option>
            <option value="original_filename-asc">{t('doc_sort_name')}</option>
          </select>
        </div>
      </div>

      {/* Documents Grid / List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MedicalSkeletonCard rows={3} />
          <MedicalSkeletonCard rows={3} />
        </div>
      ) : documents.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No medical documents match your filter.
          </p>
          <p className="text-xs text-slate-400">Try modifying your search or upload a new record.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <StatusBadge status={doc.status} />
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1" title={doc.original_filename}>
                  {doc.original_filename}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {doc.document_type}
                </p>

                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                  <span>{(doc.file_size / 1024).toFixed(1)} KB</span>
                  <span>•</span>
                  <span>{doc.page_count} page{doc.page_count > 1 ? 's' : ''}</span>
                  <span>•</span>
                  <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenPreview(doc)}
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title={t('doc_btn_preview')}
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteDocId(doc.id)}
                    className="p-2 rounded-lg text-rose-500 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title={t('doc_btn_delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {doc.status === 'completed' && (
                  <Link
                    to={`/documents/${doc.id}/summary`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('doc_btn_summary')}</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Content Preview Modal */}
      <Modal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc?.original_filename || 'Document Content Preview'}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Type: {previewDoc?.document_type}</span>
            <span>Pages: {previewDoc?.page_count}</span>
          </div>

          <div className="max-h-96 overflow-y-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
            {loadingContent ? 'Extracting document text...' : previewContent}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {previewDoc && (
              <a
                href={api.getDownloadUrl(previewDoc.id)}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Original</span>
              </a>
            )}
            <button
              onClick={() => setPreviewDoc(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteDocId}
        onClose={() => setDeleteDocId(null)}
        title={t('doc_delete_confirm_title')}
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <p>{t('doc_delete_confirm_desc')}</p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteDocId(null)}
              disabled={isDeleting}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            >
              {t('doc_confirm_cancel')}
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-all"
            >
              {isDeleting ? 'Deleting...' : t('doc_confirm_yes')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
