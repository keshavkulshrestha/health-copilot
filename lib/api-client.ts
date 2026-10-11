import { Patient, HealthRecord, HealthInsight, ExtractedData } from './types';
import { mockPatient, mockRecords, mockInsights } from './mocks/sample_records';

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export async function getPatient(): Promise<Patient> {
  if (USE_MOCKS) return mockPatient;
  const res = await fetch('/api/patient');
  if (!res.ok) throw new Error('Failed to fetch patient');
  return (await res.json()).patient;
}

export async function getRecords(): Promise<HealthRecord[]> {
  if (USE_MOCKS) return mockRecords;
  const res = await fetch('/api/records');
  if (!res.ok) throw new Error('Failed to fetch records');
  return (await res.json()).records;
}

export async function getRecordDetails(id: string): Promise<{ record: HealthRecord; insight: HealthInsight | null }> {
  if (USE_MOCKS) {
    const record = mockRecords.find((r) => r.id === id);
    if (!record) throw new Error('Record not found');
    return { record, insight: mockInsights[id] || null };
  }
  const res = await fetch(`/api/records/${id}`);
  if (!res.ok) throw new Error('Failed to fetch record details');
  return await res.json();
}

export async function analyzeRecord(recordData: ExtractedData): Promise<{ insight: HealthInsight; source: 'ai' | 'rules' }> {
  if (USE_MOCKS) {
    // Simulate AI analysis with mock data
    return {
      insight: mockInsights['r1']!,
      source: 'rules',
    };
  }
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recordData }),
  });
  if (!res.ok) throw new Error('Failed to analyze record');
  return await res.json();
}
