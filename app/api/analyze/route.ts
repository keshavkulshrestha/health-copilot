import { NextRequest, NextResponse } from 'next/server';
import { genAI, getGeminiModel, GEMINI_ANALYZE_SYSTEM_PROMPT, generateFallbackAnalysis } from '@/lib/server/gemini';
import { AnalyzeResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { extractedText, structuredData, fileName } = body;

    const inputContent =
      extractedText ||
      (structuredData ? JSON.stringify(structuredData) : '') ||
      'General Blood Test Report';

    let analysis: AnalyzeResponse;

    if (genAI && process.env.GEMINI_API_KEY && process.env.NEXT_PUBLIC_USE_MOCKS !== 'true') {
      try {
        const model = getGeminiModel(genAI, {
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `${GEMINI_ANALYZE_SYSTEM_PROMPT}\n\nMedical Document Content:\n${inputContent}`;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        analysis = JSON.parse(text);
      } catch (geminiErr) {
        console.warn('Gemini analyze failed or rate limited, using rule-based fallback:', geminiErr);
        analysis = generateFallbackAnalysis(inputContent, fileName);
      }
    } else {
      analysis = generateFallbackAnalysis(inputContent, fileName);
    }

    return NextResponse.json(analysis);
  } catch (err: any) {
    console.error('Analyze route error:', err);
    // Return resilient fallback analysis even on unexpected request errors
    return NextResponse.json(generateFallbackAnalysis(''));
  }
}
