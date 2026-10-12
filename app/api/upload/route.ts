import { NextRequest, NextResponse } from 'next/server';
import { createRequire } from 'module';
import { supabase, inMemoryStore } from '@/lib/server/supabase';
import { analyzeMedicalDocument, generateHealthInsights } from '@/lib/server/gemini';
import { HealthRecord } from '@/lib/types';

const nativeRequire = createRequire(import.meta.url);
const pdfParse = nativeRequire('pdf-parse');

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uint8Array = new Uint8Array(buffer);

    let extractedText = '';
    try {
      const pdfData = await pdfParse(uint8Array);
      extractedText = pdfData?.text || '';
    } catch (pdfErr: any) {
      console.error('PDF parsing error details:', pdfErr);
      return NextResponse.json(
        { error: `Failed to extract text from PDF: ${pdfErr?.message || 'Invalid PDF buffer'}` },
        { status: 400 }
      );
    }

    if (!extractedText || !extractedText.trim()) {
      return NextResponse.json(
        { error: 'Text extraction failed or document contains no readable text' },
        { status: 400 }
      );
    }

    // Call Gemini to analyze and extract structured medical document parameters
    const structuredData = await analyzeMedicalDocument(extractedText);

    // Call existing /api/analyze logic to synthesize clinical health insights
    const insightsData = await generateHealthInsights(structuredData, extractedText, file.name);

    // Generate unique record ID
    const recordId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : `rec-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
    const patient = inMemoryStore.getPatient();

    // Insert structured JSON into Supabase health_records table
    if (supabase) {
      try {
        const { error: recordError } = await supabase.from('health_records').insert({
          id: recordId,
          patient_id: patient.id,
          record_type: 'lab_report',
          file_name: file.name,
          file_url: `/uploads/${file.name}`,
          extracted_data: structuredData,
        });

        if (recordError) {
          console.warn('Supabase health_records insert warning:', recordError.message);
        }

        // Insert health insights into Supabase health_insights table
        const { error: insightsError } = await supabase.from('health_insights').insert({
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `ins-${recordId}`,
          record_id: recordId,
          summary_en: insightsData.summary_en,
          summary_hi: insightsData.summary_hi,
          abnormal_flags: insightsData.abnormal_flags,
          recommendations: insightsData.recommendations,
          questions_for_doctor: insightsData.questions_for_doctor,
        });

        if (insightsError) {
          console.warn('Supabase health_insights insert warning:', insightsError.message);
        }
      } catch (dbErr) {
        console.warn('Supabase insert caught exception:', dbErr);
      }
    }

    // Maintain in-memory store so record is immediately queryable across routes
    const newRecord: HealthRecord = {
      id: recordId,
      patient_id: patient.id,
      record_type: 'lab_report',
      file_name: file.name,
      file_url: `/uploads/${file.name}`,
      created_at: new Date().toISOString(),
      extracted_data: structuredData,
      patient: patient,
      insights: {
        id: `ins-${recordId}`,
        record_id: recordId,
        summary_en: insightsData.summary_en,
        summary_hi: insightsData.summary_hi,
        abnormal_flags: insightsData.abnormal_flags,
        recommendations: insightsData.recommendations,
        questions_for_doctor: insightsData.questions_for_doctor,
        created_at: new Date().toISOString(),
      },
    };

    inMemoryStore.saveRecord(newRecord);

    return NextResponse.json({
      success: true,
      recordId: newRecord.id,
      record: newRecord,
    });
  } catch (err: any) {
    console.error('Upload processing error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to process document upload' },
      { status: 500 }
    );
  }
}
