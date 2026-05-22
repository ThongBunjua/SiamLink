import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseAdmin } from '@/lib/supabase';

// Initialize stripe client
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-18' as any, // standard secure client
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  if (!stripeSecretKey) {
    console.error('Stripe SECRET_KEY is missing.');
    return NextResponse.json({ error: 'Internal Server Config Error' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    // Verify signature to prevent malicious spoofing requests
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Stripe Webhook Signature verification failed: ${err.message}`);
    // Return 400 Bad Request if verification fails
    return NextResponse.json({ error: `Signature verification failed: ${err.message}` }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();

  // 1. checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;

    if (userId) {
      // Elevated privileges to bypass normal user Row Level Security (RLS)
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ plan: 'pro' })
        .eq('user_id', userId);

      if (error) {
        console.error(`Database error updating profile for user ${userId}:`, error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      console.log(`[Stripe Webhook] Successfully upgraded user ${userId} to PRO tier!`);
    } else {
      console.warn('[Stripe Webhook] checkout.session.completed triggered but no user_id metadata found.');
    }
  }

  // 2. invoice.payment_succeeded event (subsequent recurring subscription renewals)
  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice;
    // Extract metadata from either the invoice itself or subscription details safely
    const userId = invoice.metadata?.user_id || (invoice as any).subscription_details?.metadata?.user_id;

    if (userId) {
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ plan: 'pro' })
        .eq('user_id', userId);

      if (error) {
        console.error(`Database error updating profile for user ${userId}:`, error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      console.log(`[Stripe Webhook] Successfully renewed PRO tier for user ${userId}!`);
    }
  }

  // Return 200 OK to Stripe confirming receipt
  return NextResponse.json({ received: true }, { status: 200 });
}
