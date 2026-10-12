import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { HealthRecord, Patient, HealthInsight } from '../types';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      })
    : null;

// Initial Seed Data for Demo Fallback
const defaultPatient: Patient = {
  id: 'a0000000-0000-0000-0000-000000000001',
  abha_id: '91-2345-6789-0123',
  name: 'Aarav Sharma',
  dob: '1989-04-12',
  gender: 'M',
  blood_group: 'O+',
  created_at: new Date().toISOString(),
};

const initialSampleRecord: HealthRecord = {
  id: 'rec-cbc-001',
  patient_id: defaultPatient.id,
  record_type: 'lab_report',
  file_name: 'CBC_Comprehensive_Report_Sample.pdf',
  file_url: 'https://storage.medimind.ai/reports/cbc_sample.pdf',
  created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  extracted_data: {
    patient_name: 'Aarav Sharma',
    lab_name: 'Apollo Diagnostics Centre',
    sample_date: '2026-10-09',
    test_results: [
      { test_name: 'Hemoglobin', value: '11.2', unit: 'g/dL', reference_range: '13.0 - 17.0', status: 'low' },
      { test_name: 'WBC (Total Leucocyte Count)', value: '7,800', unit: '/mcL', reference_range: '4,000 - 11,000', status: 'normal' },
      { test_name: 'RBC Count', value: '3.9', unit: 'million/mcL', reference_range: '4.5 - 5.5', status: 'low' },
      { test_name: 'Platelet Count', value: '210,000', unit: '/mcL', reference_range: '150,000 - 450,000', status: 'normal' },
      { test_name: 'Fasting Blood Glucose', value: '118', unit: 'mg/dL', reference_range: '70 - 99', status: 'high' },
      { test_name: 'Total Cholesterol', value: '224', unit: 'mg/dL', reference_range: '< 200', status: 'high' },
    ],
    medicines: [
      { name: 'Iron Ferrous Ascorbate', dosage: '100mg', frequency: 'Once daily after meals', duration: '30 days' },
      { name: 'Vitamin C (Ascorbic Acid)', dosage: '500mg', frequency: 'Once daily morning', duration: '30 days' },
    ],
    clinical_notes: 'Mild microcytic hypochromic anemia observed. Elevated fasting glycemic level warrants dietary review.',
  },
  patient: defaultPatient,
  insights: {
    id: 'ins-cbc-001',
    record_id: 'rec-cbc-001',
    summary_en:
      'Your blood report shows mildly reduced Hemoglobin (11.2 g/dL) indicating mild anemia, along with slightly elevated Fasting Blood Glucose (118 mg/dL) and Total Cholesterol (224 mg/dL). White blood cells and platelets are healthy and within standard limits.',
    summary_hi:
      'आपकी रक्त रिपोर्ट में हीमोग्लोबिन का स्तर हल्का कम (11.2 g/dL) है जो हल्के एनीमिया का संकेत देता है, साथ ही फास्टिंग ब्लड शुगर (118 mg/dL) और कोलेस्ट्रॉल हल्का बढ़ा हुआ है। श्वेत रक्त कोशिकाएं और प्लेटलेट्स पूरी तरह सामान्य हैं।',
    abnormal_flags: [
      {
        testName: 'Hemoglobin',
        value: '11.2 g/dL',
        status: 'low',
        explanation: 'Indicates mild reduction in oxygen-carrying red blood cells, which can cause mild fatigue.',
      },
      {
        testName: 'Fasting Blood Glucose',
        value: '118 mg/dL',
        status: 'high',
        explanation: 'Fasting sugar is in the impaired fasting glucose / pre-diabetic monitoring range.',
      },
      {
        testName: 'Total Cholesterol',
        value: '224 mg/dL',
        status: 'high',
        explanation: 'Total circulating lipids are mildly elevated; dietary modifications are suggested.',
      },
    ],
    recommendations: [
      'Increase iron-rich foods such as spinach, lentils, pomegranate, and beetroot alongside vitamin C for absorption.',
      'Engage in 30 minutes of daily aerobic physical exercise like brisk walking or cycling.',
      'Reduce processed sugar and refined carbohydrate intake, focusing on high-fiber whole grains.',
    ],
    questions_for_doctor: [
      'Should we conduct serum ferritin and iron profile testing to investigate the cause of the low hemoglobin?',
      'Would you recommend an HbA1c test to assess 3-month average blood glucose control?',
      'Are dietary modifications sufficient for the lipid levels or is medication required?',
    ],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
};

// Global in-memory fallback store
declare global {
  // eslint-disable-next-line no-var
  var __medimind_records: HealthRecord[] | undefined;
}

if (!global.__medimind_records) {
  global.__medimind_records = [initialSampleRecord];
}

export const inMemoryStore = {
  getRecords: (): HealthRecord[] => global.__medimind_records || [initialSampleRecord],
  getRecordById: (id: string): HealthRecord | undefined => {
    return (global.__medimind_records || []).find((r) => r.id === id);
  },
  saveRecord: (record: HealthRecord) => {
    if (!global.__medimind_records) global.__medimind_records = [];
    const existingIndex = global.__medimind_records.findIndex((r) => r.id === record.id);
    if (existingIndex >= 0) {
      global.__medimind_records[existingIndex] = record;
    } else {
      global.__medimind_records.unshift(record);
    }
    return record;
  },
  getPatient: (): Patient => defaultPatient,
};
