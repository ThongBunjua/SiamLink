'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) throw authError;
    } catch (err: any) {
      console.error('OAuth error:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ Google');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fdfbf7] text-[#3e2723] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background soft blurs for dynamic warm feeling */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#f5ebe0]/60 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#e3d5ca]/40 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-[#d5bdaf]/40 rounded-3xl p-8 md:p-10 shadow-xl relative z-10 transition-all duration-300">
        <div className="flex flex-col items-center text-center">
          {/* Logo Brand Icon */}
          <div className="w-16 h-16 rounded-2xl bg-[#f5ebe0] border border-[#d5bdaf]/70 flex items-center justify-center shadow-xs mb-5">
            <span className="text-2xl font-black tracking-tighter text-[#3e2723] flex items-center">
              S<span className="text-pink-600 font-extrabold">L</span>
            </span>
          </div>

          <h1 className="text-2xl font-black tracking-tight leading-tight">
            เข้าสู่ระบบ Siam<span className="text-pink-600 font-black">Link</span>
          </h1>
          <p className="text-xs text-[#7f5539] font-bold mt-2 max-w-[280px]">
            สร้างหน้าแลนดิ้งเพจรวมลิงก์ที่สวยงามและทรงพลังที่สุดในประเทศไทย 🇹🇭
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-[#3e2723] hover:bg-[#54352f] disabled:bg-[#3e2723]/60 text-white font-black py-4 px-6 rounded-2xl text-sm transition-all duration-300 shadow-md hover:shadow-lg hover:scale-101 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                กำลังนำทางไปที่ Google...
              </span>
            ) : (
              <>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.706 0 3.277.604 4.5 1.625l2.437-2.437C17.312 1.696 14.933 1 12.24 1 6.705 1 2.24 5.465 2.24 11s4.465 10 10 10c5.782 0 9.618-4.062 9.618-9.78 0-.66-.06-1.285-.18-1.935H12.24z" />
                </svg>
                เข้าสู่ระบบด้วย Google
              </>
            )}
          </button>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-black text-rose-700 text-center animate-fade-in">
              ⚠️ {error}
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-[#d5bdaf]/30 pt-6 flex flex-col gap-4 items-center text-center">
          <div className="flex items-center gap-1.5 text-[10px] text-[#7f5539] font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            เชื่อมต่อทันใจ ปลอดภัยด้วยมาตรฐาน Google OAuth 2.0
          </div>
          <p className="text-[9px] text-stone-400 font-bold max-w-[280px]">
            การเข้าสู่ระบบ หมายถึงคุณยอมรับข้อตกลงการใช้งานและนโยบายความเป็นส่วนตัวของ SiamLink
          </p>
        </div>
      </div>
    </main>
  );
}
