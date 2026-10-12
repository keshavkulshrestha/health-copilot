import { NextRequest, NextResponse } from 'next/server';
import { supabase, inMemoryStore } from '@/lib/server/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    let records = [];

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('health_records')
          .select('*, patient:patients(*), insights:health_insights(*)')
          .order('created_at', { ascending: false });

        if (error || !data || data.length === 0) {
          records = inMemoryStore.getRecords();
        } else {
          // Normalize nested insights
          records = data.map((d: any) => ({
            ...d,
            insights: Array.isArray(d.insights) ? d.insights[0] : d.insights,
          }));
        }
      } catch (dbErr) {
        records = inMemoryStore.getRecords();
      }
    } else {
      records = inMemoryStore.getRecords();
    }

    return NextResponse.json({
      records,
      patient: inMemoryStore.getPatient(),
    });
  } catch (err: any) {
    console.error('Records list error:', err);
    return NextResponse.json({
      records: inMemoryStore.getRecords(),
      patient: inMemoryStore.getPatient(),
    });
  }
}
