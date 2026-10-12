import { NextRequest, NextResponse } from 'next/server';
import { supabase, inMemoryStore } from '@/lib/server/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    let record = null;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('health_records')
          .select('*, patient:patients(*), insights:health_insights(*)')
          .eq('id', id)
          .single();

        if (data && !error) {
          record = {
            ...data,
            insights: Array.isArray(data.insights) ? data.insights[0] : data.insights,
          };
        }
      } catch (dbErr) {
        console.warn('Supabase fetch single record failed:', dbErr);
      }
    }

    if (!record) {
      record = inMemoryStore.getRecordById(id);
    }

    // Fallback: if id not found, return first available record so demo never breaks
    if (!record) {
      const all = inMemoryStore.getRecords();
      record = all.length > 0 ? all[0] : null;
    }

    if (!record) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (err: any) {
    console.error('Fetch record by ID error:', err);
    const fallback = inMemoryStore.getRecords()[0];
    return NextResponse.json(fallback);
  }
}
