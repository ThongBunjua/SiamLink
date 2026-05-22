'use client';

import React, { useState } from 'react';
import { Sparkles, CreditCard, ArrowRight, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface CheckoutButtonProps {
  profileId: string;
  onStartLoading?: () => void;
  onEndLoading?: () => void;
  onError?: (msg: string) => void;
}

export default function CheckoutButton({
  profileId,
  onStartLoading,
  onEndLoading,
  onError,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      if (onStartLoading) onStartLoading();

      // 1. Retrieve the client auth session token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('ไม่พบเซสชันผู้ใช้งานกรุณาเข้าสู่ระบบอีกครั้ง');
      }

      // 2. Request the Stripe Checkout Session url
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ profile_id: profileId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการสร้างรายการชำระเงิน');
      }

      // 3. Securely redirect to Stripe hosted billing portal
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('ไม่พบลิงก์ชำระเงินปลายทาง');
      }

    } catch (err: any) {
      console.error('Stripe Checkout Handshake Failed:', err);
      const errMsg = err.message || 'ระบบไม่สามารถประมวลผลคำขอชำระเงินได้ในขณะนี้';
      if (onError) onError(errMsg);
    } finally {
      setLoading(false);
      if (onEndLoading) onEndLoading();
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Stripe Payment Trigger Call Button */}
      <button
        type="button"
        disabled={loading}
        onClick={handleCheckout}
        className="w-full bg-gradient-to-r from-pink-600 via-rose-500 to-indigo-600 text-white font-black py-4 px-6 rounded-2xl hover:opacity-95 cursor-pointer shadow-md text-sm md:text-base flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-99 disabled:opacity-75 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            กำลังเชื่อมต่อไปยัง Stripe Secure Billing... ⏳
          </span>
        ) : (
          <>
            <Sparkles className="w-5 h-5 animate-pulse" />
            ชำระค่าบริการและอัปเกรดเป็น PRO (129 บ./เดือน) ⚡
          </>
        )}
      </button>

      {/* Trust Badges and logos for PromptPay & Cards */}
      <div className="flex flex-col items-center gap-2 mt-1">
        <div className="flex items-center justify-center gap-3.5 opacity-80 flex-wrap">
          {/* PromptPay custom styled badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 border border-sky-100 rounded-lg select-none">
            <span className="text-[10px] font-black text-sky-800">🔵 PromptPay QR</span>
          </div>

          {/* Visa Card badge */}
          <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg select-none">
            <CreditCard className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[10px] font-extrabold text-slate-700">VISA / MASTERCARD</span>
          </div>
        </div>

        {/* Secure badge */}
        <p className="text-[10px] text-stone-400 font-bold flex items-center gap-1 mt-1 justify-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 
          ดำเนินการชำระเงินอย่างปลอดภัย 256-bit SSL เข้ารหัสผ่าน Stripe Gateway
        </p>
      </div>
    </div>
  );
}
