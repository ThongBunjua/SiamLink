import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2022-11-15' as any,
});

export async function POST(request: Request) {
  try {
    // 1. Authenticate user from the Authorization Bearer token header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'ยังไม่ได้ลงชื่อเข้าใช้งาน (Unauthorized: Missing Bearer Token)' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'เซสชันการใช้งานไม่ถูกต้อง โปรดเข้าสู่ระบบใหม่อีกครั้ง (Unauthorized: Invalid User Session)' },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body = await request.json();
    const { profile_id } = body;

    if (!profile_id) {
      return NextResponse.json(
        { error: 'ไม่พบหมายเลขโปรไฟล์ผู้ใช้งาน (Missing profile_id)' },
        { status: 400 }
      );
    }

    // 3. Construct base origin URL for redirect states
    const requestUrl = new URL(request.url);
    const origin = requestUrl.origin;

    // 4. Initialize Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'promptpay'],
      billing_address_collection: 'auto',
      line_items: [
        {
          price_data: {
            currency: 'thb',
            product_data: {
              name: 'SiamLink Pro Plan',
              description: 'ปลดล็อกฟีเจอร์พรีเมียม (ลบลายน้ำท้ายเว็บ, ธีมสีสันสดใส, ขยับปุ่มเรียกสายตา, ฝังคลิป YouTube/TikTok ได้ไม่จำกัด)',
            },
            unit_amount: 12900, // 129.00 THB
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      metadata: {
        profile_id: profile_id,
        user_id: user.id,
        user_email: user.email || '',
      },
      success_url: `${origin}/dashboard/payment-status?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/payment-status?status=cancel`,
    });

    if (!session.url) {
      throw new Error('Failed to create checkout session URL from Stripe.');
    }

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('Stripe Checkout Session Error:', error);
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ Stripe' },
      { status: 500 }
    );
  }
}
