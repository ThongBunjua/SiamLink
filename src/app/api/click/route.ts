import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Asynchronous Route Handler for fast, non-blocking click tracking
export async function POST(request: NextRequest) {
  try {
    const { linkId } = await request.json();

    if (!linkId) {
      return NextResponse.json({ error: 'Missing linkId parameter' }, { status: 400 });
    }

    // Insert log record to supabase database (RLS allows public inserts)
    const { error } = await supabase
      .from('click_logs')
      .insert([{ link_id: linkId }]);

    if (error) {
      console.error('Database logging error:', error);
      return NextResponse.json({ error: 'Failed to record click in database' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Click logged successfully' }, { status: 201 });
  } catch (err) {
    console.error('Unhandled analytics API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
