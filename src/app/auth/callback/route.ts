import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    // Create a server-side Supabase client to exchange code for session
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.session) {
      const { access_token, refresh_token, expires_in } = data.session;
      // Redirect to dashboard with session tokens in hash so the browser client gets it
      return NextResponse.redirect(
        `${origin}/dashboard#access_token=${access_token}&refresh_token=${refresh_token}&expires_in=${expires_in}&token_type=bearer`
      );
    }

    if (error) {
      console.error('Error exchanging OAuth code for session:', error);
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
    }
  }

  // Redirect to dashboard on success
  return NextResponse.redirect(`${origin}/dashboard`);
}

