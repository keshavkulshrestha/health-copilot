import { Patient, HealthRecord, HealthInsight } from '../types';

export const mockPatient: Patient = {
  id: 'p1',
  abhaId: '98-7654-3210-9876',
  name: 'Rajesh Kumar',
  dob: '1985-06-15',
  gender: 'M',
  bloodGroup: 'B+',
  createdAt: '2026-10-01T10:00:00Z',
};

export const mockRecords: HealthRecord[] = [
  {
    id: 'r1',
    patientId: 'p1',
    recordType: 'lab_report',
    fileName: 'blood_test_oct2026.pdf',
    extractedData: {
      date: '2026-10-08',
      facility: 'City Health Lab',
      testResults: [
        { testName: 'Hemoglobin', value: '9.2', unit: 'g/dL', referenceRange: '13.5-17.5', status: 'low' },
        { testName: 'WBC', value: '7,500', unit: '/μL', referenceRange: '4,500-11,000', status: 'normal' },
        { testName: 'Platelets', value: '250,000', unit: '/μL', referenceRange: '150,000-400,000', status: 'normal' },
        { testName: 'Fasting Glucose', value: '105', unit: 'mg/dL', referenceRange: '70-100', status: 'high' },
      ],
      notes: 'Complete blood count with differential',
    },
    createdAt: '2026-10-08T14:30:00Z',
  },
  {
    id: 'r2',
    patientId: 'p1',
    recordType: 'prescription',
    fileName: 'prescription_sept2026.pdf',
    extractedData: {
      date: '2026-09-22',
      facility: 'Dr. Mehta Clinic',
      medicines: [
        { name: 'Paracetamol', dosage: '500mg', frequency: 'Twice daily after meals', purpose: 'Fever and body pain' },
        { name: 'Iron Supplement', dosage: '200mg', frequency: 'Once daily', purpose: 'Low hemoglobin' },
      ],
      diagnoses: ['Mild anemia', 'Viral fever'],
    },
    createdAt: '2026-09-22T11:00:00Z',
  },
];

export const mockInsights: Record<string, HealthInsight> = {
  'r1': {
    id: 'i1',
    recordId: 'r1',
    summaryEn: 'Your recent blood test shows generally healthy markers. However, your Hemoglobin is slightly below the normal range (9.2 g/dL vs 13.5-17.5), which might explain fatigue. Your fasting glucose is also slightly elevated (105 mg/dL), which could indicate early prediabetes. Consider discussing these with your doctor.',
    summaryRegional: 'आपकी हालिया ब्लड टेस्ट सामान्य रूप से स्वस्थ मार्कर दिखाती है। हालांकि, आपका हीमोग्लोबिन सामान्य सीमा से थोड़ा कम है (9.2 g/dL बनाम 13.5-17.5), जो थकान की व्याख्या कर सकता है।',
    abnormalFlags: [
      {
        testName: 'Hemoglobin',
        value: '9.2 g/dL',
        status: 'low',
        explanation: 'Low hemoglobin can cause fatigue, weakness, and shortness of breath. This may indicate anemia. Consider iron-rich foods and consult your doctor.',
      },
      {
        testName: 'Fasting Glucose',
        value: '105 mg/dL',
        status: 'high',
        explanation: 'Slightly elevated fasting glucose (normal: 70-100 mg/dL) may indicate early prediabetes. Monitor your diet and consult your doctor for further testing.',
      },
    ],
    disclaimerAcknowledged: true,
    createdAt: '2026-10-08T14:35:00Z',
  },
};
