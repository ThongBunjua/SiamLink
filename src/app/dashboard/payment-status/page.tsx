'use client';
export const dynamic = 'force-dynamic';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Sparkles, CheckCircle, XCircle, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';
import Link from 'next/link';

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get('status');
  const sessionId = searchParams.get('session_id');

  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!status) {
      router.push('/dashboard');
    }
  }, [status, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const isSuccess = status === 'success';

  return (
    <main className="min-h-screen bg-[#fdfbf7] text-[#3e2723] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg bg-white border border-[#e4dfd5] rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden text-center flex flex-col gap-6">

        {/* Top brand-aligned aesthetic stripe */}
        <div className={`absolute top-0 left-0 right-0 h-3 bg-gradient-to-r ${isSuccess
          ? 'from-emerald-500 via-teal-400 to-indigo-500'
          : 'from-rose-500 via-pink-400 to-amber-500'
          }`} />

        {isSuccess ? (
          /* SUCCESS STATE PANEL */
          <>
            <div className="flex flex-col items-center mt-4">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100 shadow-md">
                <CheckCircle className="w-12 h-12 text-emerald-500 animate-bounce" />
              </div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                ยินดีต้อนรับสู่ SiamLink PRO! 👑
              </h1>
              <p className="text-sm font-extrabold text-stone-400 mt-2 tracking-wide uppercase">
                Payment Completed Successfully
              </p>
            </div>

            <div className="p-6 bg-emerald-50/50 border border-emerald-150 rounded-2xl flex flex-col items-center gap-3 shadow-3xs">
              <p className="text-base font-black text-emerald-950">
                ยินดีด้วย! บัญชีของคุณเป็น SiamLink Pro เรียบร้อยแล้ว ✨
              </p>
              <p className="text-xs font-bold text-stone-600 leading-relaxed text-center mt-1">
                ระบบได้ปลดล็อกความสามารถระดับพรีเมียมให้บัญชีของคุณเรียบร้อยแล้ว ทุกฟีเจอร์พร้อมเปิดใช้งานบนแผงควบคุมหลักทันที!
              </p>
            </div>

            {/* List of Activated Pro Features */}
            <div className="flex flex-col gap-3 text-xs font-extrabold border-y border-stone-100 py-6 text-left px-2">
              <div className="flex items-center gap-2.5">
                <span className="text-emerald-500 text-base">✓</span>
                <span>ลบลายน้ำเครดิต SiamLink ท้ายหน้าโปรไฟล์</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-emerald-500 text-base">✓</span>
                <span>ขยับปุ่มเรียกสายตา (Attention Grabber) เพื่อดึงดูดคลิก</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-emerald-500 text-base">✓</span>
                <span>ฝังวิดีโอ YouTube และ TikTok ได้ไม่จำกัดรายการ</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-emerald-500 text-base">✓</span>
                <span>ปลดล็อกธีมพิเศษระดับโปรสีสันสดใส ทั้งหมด 10 แบบ</span>
              </div>
            </div>

            {sessionId && (
              <p className="text-[10px] font-mono font-bold text-stone-400">
                Session ID: {sessionId.substring(0, 24)}...
              </p>
            )}

            <div className="flex flex-col gap-3.5 mt-2">
              <Link
                href="/dashboard"
                className="w-full bg-[#3e2723] hover:bg-[#54352f] text-white font-black py-4 px-6 rounded-2xl text-sm md:text-base flex items-center justify-center gap-2 transition-all hover:scale-102 shadow-md cursor-pointer"
              >
                <Sparkles className="w-5 h-5 animate-pulse" />
                เข้าสู่หน้าแผงควบคุมระบบโปร ⚡
              </Link>
            </div>
          </>
        ) : (
          /* CANCEL STATE PANEL */
          <>
            <div className="flex flex-col items-center mt-4">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6 border border-rose-100 shadow-md">
                <XCircle className="w-12 h-12 text-rose-500 animate-pulse" />
              </div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
                การชำระเงินไม่เสร็จสมบูรณ์
              </h1>
              <p className="text-sm font-extrabold text-stone-400 mt-2 tracking-wide uppercase">
                Payment Cancelled or Incomplete
              </p>
            </div>

            <div className="p-6 bg-rose-50/50 border border-rose-150 rounded-2xl flex flex-col items-center gap-3 shadow-3xs">
              <p className="text-base font-black text-rose-950">
                การชำระเงินยังไม่เสร็จสิ้น หากมีปัญหาโปรดติดต่อเรา
              </p>
              <p className="text-xs font-bold text-stone-600 leading-relaxed text-center mt-1">
                คุณสามารถยกเลิกและทดลองชำระเงินใหม่อีกครั้งผ่านระบบ Stripe Checkout เพื่อปลดล็อกคุณสมบัติ SiamLink Pro
              </p>
            </div>

            <div className="flex flex-col gap-3.5 mt-4">
              <Link
                href="/dashboard"
                className="w-full bg-gradient-to-r from-pink-600 to-rose-500 hover:opacity-95 text-white font-black py-4 px-6 rounded-2xl text-sm md:text-base flex items-center justify-center gap-2 transition-all hover:scale-102 shadow-md cursor-pointer"
              >
                ลองชำระเงินใหม่อีกครั้ง <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/dashboard"
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold py-3 px-6 rounded-2xl text-xs md:text-sm transition-all cursor-pointer"
              >
                ย้อนกลับไปใช้แบบฟรีต่อ
              </Link>
            </div>
          </>
        )}

        {/* Security / trust badge */}
        <p className="text-[10px] text-stone-400 font-bold flex items-center gap-1 mt-3 justify-center border-t border-stone-100 pt-4">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          ระบบยืนยันความปลอดภัย Stripe Secure Connection
        </p>
      </div>
    </main>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#fdfbf7] text-[#3e2723] flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-lg bg-white border border-[#e4dfd5] rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-12 h-12 border-4 border-[#3e2723] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-bold text-stone-500">กำลังโหลด...</p>
        </div>
      </main>
    }>
      <PaymentStatusContent />
    </Suspense>
  );
}
