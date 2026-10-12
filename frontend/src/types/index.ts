export interface UserPreference {
  language: 'en' | 'hi';
  theme: 'light' | 'dark';
  summary_depth: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  age?: number;
  gender?: string;
  blood_group?: string;
  is_active: boolean;
  created_at: string;
  preference?: UserPreference;
}

export interface LabValue {
  name: string;
  value: string;
  unit?: string;
  reference_range?: string;
  status: 'normal' | 'low' | 'high' | 'critical' | 'unknown';
}

export interface Citation {
  quote: string;
  page_number?: number;
}

export interface DocumentSummary {
  id: string;
  document_id: string;
  quick_summary: string;
  key_findings: string[];
  lab_values: LabValue[];
  recommendations: string[];
  questions_for_doctor: string[];
  citations: Citation[];
  disclaimer: string;
  language: string;
  is_ai_generated: boolean;
  created_at: string;
}

export interface MedicalDocument {
  id: string;
  user_id: string;
  original_filename: string;
  file_size: number;
  file_type: string;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  page_count: number;
  document_type: string;
  created_at: string;
  has_summary?: boolean;
  summary?: DocumentSummary;
}

export interface DocumentListResponse {
  items: MedicalDocument[];
  total: number;
  page: number;
  limit: number;
}

export interface ChatCitation {
  quote: string;
  document_id?: string;
  document_name?: string;
  page_number?: number;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  citations: ChatCitation[];
  is_grounded: boolean;
  created_at: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  selected_document_id?: string;
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
}
