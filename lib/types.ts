export type RecordType = 'lab_report' | 'prescription' | 'discharge_summary';

export interface Patient {
  id: string;
  abhaId: string; // Mock ABHA ID, e.g., '98-7654-3210-9876'
  name: string;
  dob: string; // ISO date
  gender: 'M' | 'F' | 'O';
  bloodGroup?: string;
  createdAt: string;
}

export interface HealthRecord {
  id: string;
  patientId: string;
  recordType: RecordType;
  fileName: string;
  extractedData: ExtractedData;
  createdAt: string;
}

export interface ExtractedData {
  date: string;
  facility?: string;
  medicines?: Medicine[];
  testResults?: TestResult[];
  diagnoses?: string[];
  notes?: string;
}

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  purpose?: string;
}

export interface TestResult {
  testName: string;
  value: string;
  unit: string;
  referenceRange?: string;
  status: 'normal' | 'low' | 'high' | 'abnormal';
}

export interface HealthInsight {
  id: string;
  recordId: string;
  summaryEn: string;
  summaryRegional?: string;
  abnormalFlags: AbnormalFlag[];
  disclaimerAcknowledged: boolean;
  createdAt: string;
}

export interface AbnormalFlag {
  testName: string;
  value: string;
  status: 'low' | 'high' | 'abnormal';
  explanation: string;
}

export interface ApiError {
  error: { code: 'VALIDATION' | 'NOT_FOUND' | 'FORBIDDEN' | 'SERVER'; message: string };
}
