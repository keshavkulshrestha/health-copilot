// Data Contracts for MediMind AI (Altrix Labs Personal Health Copilot)

export interface Patient {
  id: string;
  abha_id?: string | null;
  name: string;
  dob: string;
  gender: 'M' | 'F' | 'O';
  blood_group?: string | null;
  created_at: string;
}

export interface TestResult {
  test_name: string;
  value: string | number;
  unit?: string;
  reference_range?: string;
  status: 'low' | 'high' | 'normal';
}

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration?: string;
  instructions?: string;
  total_tablets?: number;
  remaining_tablets?: number;
  days_remaining?: number;
  refill_alert_days?: number;
  reminder_time?: string;
}

export interface MedicineReminder {
  id: string;
  medicine_name: string;
  dosage: string;
  frequency: string;
  scheduled_time: string;
  phone_number?: string;
  remaining_tablets: number;
  total_tablets: number;
  days_remaining: number;
  is_active: boolean;
  last_taken_at?: string;
}

export interface ExtractedData {
  test_results: TestResult[];
  medicines: Medicine[];
  patient_name?: string;
  lab_name?: string;
  sample_date?: string;
  clinical_notes?: string;
}

export interface AbnormalFlag {
  testName: string;
  value: string | number;
  status: 'low' | 'high' | 'normal';
  explanation: string;
}

export interface HealthInsight {
  id: string;
  record_id: string;
  summary_en: string;
  summary_hi: string;
  abnormal_flags: AbnormalFlag[];
  recommendations: string[];
  questions_for_doctor: string[];
  created_at: string;
}

export interface HealthRecord {
  id: string;
  patient_id?: string;
  record_type: 'lab_report' | 'prescription' | 'discharge_summary';
  file_name: string;
  file_url?: string;
  extracted_data: ExtractedData;
  created_at: string;
  patient?: Patient;
  insights?: HealthInsight;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: Array<{
    quote: string;
    page_number?: number;
  }>;
  created_at?: string;
}

export interface AnalyzeResponse {
  extracted_data: ExtractedData;
  summary_en: string;
  summary_hi: string;
  abnormal_flags: AbnormalFlag[];
  recommendations: string[];
  questions_for_doctor: string[];
}
