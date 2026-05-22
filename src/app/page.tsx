'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, CreditCard, MessageCircle, Zap, CheckCircle2, 
  ArrowRight, ArrowUpRight, Copy, Check, Play, Video, Lock, X
} from 'lucide-react';

export default function Home() {
  const [copiedBank, setCopiedBank] = useState(false);

  const handleCopyMockBank = async () => {
    try {
      await navigator.clipboard.writeText("123-4-56789-0");
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    } catch (err) {
      console.error('Failed to copy mock bank number:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#3e2723] font-sans selection:bg-pink-500 selection:text-white relative overflow-hidden flex flex-col">
      
      {/* ─── Organic Animated Background Blobs ─── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-8%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-pink-300/15 to-rose-200/10 blur-[100px] animate-blob-1" />
        <div className="absolute bottom-[-10%] right-[-12%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-indigo-300/12 to-purple-200/8 blur-[120px] animate-blob-2" />
        <div className="absolute top-[40%] left-[50%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-br from-amber-200/10 to-orange-100/8 blur-[90px] animate-blob-3" />
      </div>

      {/* ─── Fixed Navbar ─── */}
      <header className="fixed top-0 left-0 right-0 border-b border-[#e4dfd5]/60 bg-[#fdfbf7]/85 backdrop-blur-xl z-50 px-6 py-3.5 transition-all duration-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-[#f5ebe0] border border-[#d5bdaf]/60 flex items-center justify-center shadow-xs">
              <span className="text-sm font-black text-[#3e2723]">S<span className="text-pink-600">L</span></span>
            </div>
            <h1 className="text-xl font-black text-[#3e2723] tracking-tight group-hover:scale-102 transition-transform">
              SiamLink
            </h1>
          </Link>
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard" 
              className="text-sm font-bold text-[#7f5539] hover:text-[#3e2723] transition-colors hidden sm:block"
            >
              เข้าสู่ระบบ
            </Link>
            <Link 
              href="/dashboard" 
              className="bg-[#3e2723] hover:bg-[#54352f] text-white text-xs font-black px-5 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md"
            >
              เริ่มสร้างลิงก์ฟรี
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <main className="flex-1 relative z-10">
        <section className="max-w-6xl mx-auto px-6 pt-32 pb-8 md:pt-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left: Copy */}
            <div className="flex flex-col gap-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/80 border border-[#d5bdaf]/40 rounded-full text-xs font-bold text-pink-600 shadow-xs w-fit mx-auto lg:mx-0 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" /> Link-in-Bio สำหรับครีเอเตอร์ชาวไทย 🇹🇭
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight leading-[1.25] text-[#3e2723]">
                รวมทุกช่องทาง <span className="inline-block whitespace-nowrap bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent pb-1">ปิดยอดขาย</span>
                <br className="hidden md:inline" />
                ได้ง่ายกว่าเดิม
              </h2>

              <p className="text-[#7f5539] text-sm md:text-base max-w-lg leading-relaxed font-medium mx-auto lg:mx-0">
                มินิมัลลิงก์ในไบโอ ออกแบบพิเศษสำหรับคนขายของออนไลน์ ก๊อปเลขบัญชีคลิกเดียว บายพาสแอป LINE กันแชทหลุด พร้อมฝังวิดีโอรีวิวสินค้าบนหน้าโปรไฟล์
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full justify-center lg:justify-start max-w-md mx-auto lg:mx-0">
                <Link 
                  href="/dashboard" 
                  className="flex items-center justify-center gap-2 bg-[#3e2723] hover:bg-[#54352f] text-white font-black px-7 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 text-sm cursor-pointer"
                >
                  เริ่มสร้างลิงก์ฟรี <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#pricing"
                  className="flex items-center justify-center gap-2 bg-white hover:bg-[#f5ebe0] border border-[#d5bdaf]/60 text-[#3e2723] font-bold px-7 py-3.5 rounded-xl transition-all text-sm cursor-pointer"
                >
                  ดูแพ็กเกจราคา
                </Link>
              </div>

              <div className="flex items-center gap-4 justify-center lg:justify-start text-[11px] text-[#7f5539] font-bold mt-2">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> ฟรีตลอดชีพ</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> ไม่ต้องใส่บัตรเครดิต</span>
              </div>
            </div>

            {/* Right: Floating Phone Mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative animate-floating">
                {/* Phone outer shell */}
                <div className="relative w-[280px] md:w-[310px] bg-zinc-900 border-[10px] border-zinc-800 rounded-[2.8rem] p-1 shadow-2xl shadow-stone-400/30 overflow-hidden">
                  
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-zinc-800 rounded-b-xl z-20 flex items-center justify-center">
                    <div className="w-2 h-2 bg-zinc-900 rounded-full border border-zinc-700" />
                  </div>

                  {/* Inner Screen — Cafe Minimal theme */}
                  <div className="w-full aspect-[9/18.5] bg-[#fdfbf7] text-[#3e2723] rounded-[2rem] px-4 py-7 flex flex-col justify-between overflow-hidden scrollbar-none relative">
                    
                    {/* Profile header */}
                    <div className="flex flex-col items-center mt-2 text-center">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#f5ebe0] to-[#ebd5c7] border-2 border-white/60 shadow-md mb-2 flex items-center justify-center font-bold text-sm text-[#3e2723]">
                        SL
                      </div>
                      <h4 className="text-xs font-bold text-[#3e2723]">@siam_creator</h4>
                      <p className="text-[9px] opacity-65 mt-0.5 font-medium max-w-[180px] leading-relaxed">ร้านกาแฟอาราบิก้า ☕ สั่งซื้อผ่านทุกช่องทาง</p>
                    </div>

                    {/* Demo links */}
                    <div className="flex flex-col gap-2 my-3 flex-1 justify-center stagger-children">
                      
                      {/* Video embed demo */}
                      <div className="w-full bg-white/60 border border-[#d5bdaf]/40 rounded-xl p-1 shadow-xs">
                        <div className="w-full aspect-video bg-zinc-900 rounded-lg overflow-hidden relative flex items-center justify-center">
                          <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-purple-800/30" />
                          <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md z-10">
                            <Play className="w-4 h-4 text-[#3e2723] ml-0.5" fill="#3e2723" />
                          </div>
                          <span className="absolute bottom-1 right-1.5 text-[7px] bg-black/60 text-white px-1.5 py-0.5 rounded font-bold">3:42</span>
                        </div>
                        <p className="text-[8px] font-bold text-center opacity-60 mt-1">รีวิวเมล็ดกาแฟใหม่ ☕</p>
                      </div>

                      {/* Bank card (Interactive!) */}
                      <button 
                        onClick={handleCopyMockBank}
                        className="w-full bg-[#f5ebe0] border border-[#d5bdaf] rounded-xl p-2.5 flex items-center justify-between text-left shadow-xs hover:bg-[#ebd5c7] transition-all cursor-pointer group/btn active:scale-98"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 border border-emerald-200/50">
                            <CreditCard className="w-3 h-3" />
                          </div>
                          <div className="truncate">
                            <h5 className="font-bold text-[10px] text-[#3e2723]">กสิกรไทย — นายสยาม</h5>
                            <span className="text-[8px] font-mono text-[#7f5539] font-semibold">123-4-56789-0</span>
                          </div>
                        </div>
                        <div className="shrink-0 ml-1">
                          {copiedBank ? (
                            <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Check className="w-2 h-2" /> คัดลอกสำเร็จ! ✨
                            </span>
                          ) : (
                            <span className="text-[8px] font-black text-[#7f5539] bg-white/80 border border-[#d5bdaf]/40 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Copy className="w-2 h-2" /> คัดลอก
                            </span>
                          )}
                        </div>
                      </button>

                      {/* LINE button */}
                      <div className="bg-[#f5ebe0] border border-[#d5bdaf] rounded-xl p-2.5 flex items-center justify-between text-left shadow-xs">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-200/50">
                            <MessageCircle className="w-3 h-3 fill-emerald-600 text-emerald-50" />
                          </div>
                          <div>
                            <h5 className="font-bold text-[10px] text-[#3e2723]">สั่งซื้อผ่าน LINE</h5>
                            <span className="text-[8px] text-[#7f5539] font-medium">แชทกับแอดมินทันที</span>
                          </div>
                        </div>
                        <ArrowUpRight className="w-3 h-3 text-[#3e2723]/40" />
                      </div>

                      {/* Shopee standard link */}
                      <div className="bg-[#f5ebe0] border border-[#d5bdaf] rounded-xl p-2.5 flex items-center justify-between text-left shadow-xs animate-wiggle animate-elegant-pulse ring-1 ring-pink-400/40">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-[#f5ebe0] text-[#8f7663] rounded-lg border border-[#d5bdaf]/50">
                            <Sparkles className="w-3 h-3" />
                          </div>
                          <div>
                            <h5 className="font-bold text-[10px] text-[#3e2723]">สั่งซื้อผ่าน Shopee 🛒</h5>
                            <span className="text-[8px] text-[#7f5539] font-medium">ลด 15% เมื่อซื้อครบ 500 บ.</span>
                          </div>
                        </div>
                        <ArrowUpRight className="w-3 h-3 text-[#3e2723]/40" />
                      </div>
                    </div>

                    {/* Watermark */}
                    <div className="text-center shrink-0 mt-1">
                      <span className="text-[8px] font-bold text-[#7f5539]/40">
                        สร้างลิงก์ของคุณฟรีด้วย SiamLink 🇹🇭
                      </span>
                    </div>

                  </div>
                </div>

                {/* Decorative floating badges */}
                <div className="absolute -top-3 -right-6 bg-white border border-[#d5bdaf]/40 rounded-xl px-3 py-1.5 shadow-lg text-[10px] font-black text-emerald-600 animate-bobbing z-30" style={{ animationDuration: '3s' }}>
                  ✨ ปุ่มขยับดึงสายตา
                </div>
                <div className="absolute -bottom-2 -left-6 bg-white border border-[#d5bdaf]/40 rounded-xl px-3 py-1.5 shadow-lg text-[10px] font-black text-pink-600 animate-bobbing z-30" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
                  📋 ก๊อปเลขบัญชีทันใจ
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ─── FEATURES SECTION ─── */}
        <section className="bg-white/40 border-y border-[#e4dfd5]/60 py-20 relative z-10 mt-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="text-[10px] font-black text-pink-600 uppercase tracking-[0.2em] bg-pink-50 px-3.5 py-1.5 rounded-full mb-4 inline-block border border-pink-100">ฟีเจอร์เด่น</span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-[#3e2723] mt-3">ออกแบบเพื่อคนขายของออนไลน์ชาวไทย</h3>
              <p className="text-[#7f5539] text-sm max-w-lg mx-auto font-medium mt-3">ช่วยลดขั้นตอน ปิดการขายเร็วขึ้น ลูกค้าไม่ต้องรอ</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white border border-[#e4dfd5]/80 rounded-2xl p-7 hover:border-pink-400/30 transition-all duration-300 shadow-xs group">
                <div className="w-11 h-11 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-pink-100">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#3e2723] mb-2">ก๊อปเลขบัญชีคลิกเดียว 💳</h4>
                <p className="text-[#7f5539] text-xs leading-relaxed font-medium">
                  ลูกค้ากดที่แถบเลขบัญชี คัดลอกอัตโนมัติ แสดงข้อความ "คัดลอกสำเร็จ! ✨" ทันที ปิดยอดไวขึ้น 3 เท่า
                </p>
              </div>

              <div className="bg-white border border-[#e4dfd5]/80 rounded-2xl p-7 hover:border-emerald-400/30 transition-all duration-300 shadow-xs group">
                <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-emerald-100">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#3e2723] mb-2">บายพาสแอป LINE 💬</h4>
                <p className="text-[#7f5539] text-xs leading-relaxed font-medium">
                  แก้ปัญหากดลิงก์ LINE จาก TikTok แล้วแชทหลุด ด้วยระบบบังคับเปิดบนเบราว์เซอร์หลักอัตโนมัติ
                </p>
              </div>

              <div className="bg-white border border-[#e4dfd5]/80 rounded-2xl p-7 hover:border-amber-400/30 transition-all duration-300 shadow-xs group">
                <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-amber-100">
                  <Video className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#3e2723] mb-2">ฝังวิดีโอรีวิวสินค้า 🎬</h4>
                <p className="text-[#7f5539] text-xs leading-relaxed font-medium">
                  แปะคลิป YouTube / TikTok รีวิวสินค้าบนหน้าโปรไฟล์ให้ลูกค้าดูก่อนตัดสินใจซื้อ เพิ่มความมั่นใจและยอดคลิก
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ─── PRICING SECTION ─── */}
        <section id="pricing" className="max-w-6xl mx-auto px-6 py-20 text-center relative z-10">
          <div className="text-center mb-14">
            <span className="text-[10px] font-black text-pink-600 uppercase tracking-[0.2em] bg-pink-50 px-3.5 py-1.5 rounded-full mb-4 inline-block border border-pink-100">ราคาแพ็กเกจ</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#3e2723] mt-3">เลือกแพลนที่เหมาะกับตัวคุณ</h3>
            <p className="text-[#7f5539] text-sm max-w-md mx-auto font-medium mt-3">เริ่มต้นใช้งานฟรีได้ตลอดชีพ ไม่ต้องใส่บัตรเครดิต</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto items-stretch">
            
            {/* Free Tier */}
            <div className="bg-white border border-[#e4dfd5] rounded-2xl p-7 flex flex-col justify-between text-left shadow-xs">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-lg font-bold text-[#3e2723]">SiamLink Free</h4>
                  <span className="text-[9px] font-black bg-[#f5ebe0] text-[#7f5539] px-2 py-0.5 rounded-full">🆓 ฟรี</span>
                </div>
                <p className="text-[11px] text-[#7f5539] mb-5 font-medium">สำหรับครีเอเตอร์เริ่มต้นใช้งาน</p>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-4xl font-extrabold text-[#3e2723]">0</span>
                  <span className="text-[#7f5539] text-sm font-semibold">บาท / ตลอดชีพ</span>
                </div>
                
                <hr className="border-[#e4dfd5] my-5" />

                <ul className="flex flex-col gap-3 text-xs text-[#3e2723] font-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>หน้าโปรไฟล์ Mobile-First ความเร็วสูง</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>สร้างลิงก์ได้สูงสุด 5 ปุ่ม</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>ก๊อปเลขบัญชี + บายพาส LINE อัตโนมัติ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>ฝังวิดีโอได้ 1 คลิป</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>ธีมฟรี 2 แบบ — คาเฟ่มินิมอล & คลีนไวท์</span>
                  </li>
                  <li className="flex items-start gap-2 opacity-40">
                    <X className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                    <span>มีลายน้ำ "สร้างลิงก์ด้วย SiamLink" ท้ายหน้า</span>
                  </li>
                  <li className="flex items-start gap-2 opacity-40">
                    <X className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                    <span>ปุ่มขยับเรียกสายตา & ธีมพรีเมียม 10 แบบ</span>
                  </li>
                </ul>
              </div>

              <Link 
                href="/dashboard"
                className="w-full bg-[#3e2723] hover:bg-[#54352f] text-white font-bold py-3 px-6 rounded-xl transition-all cursor-pointer text-center text-xs mt-7 block shadow-md hover:scale-102"
              >
                เริ่มใช้งานฟรีเลย
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-white border-2 border-pink-400/50 rounded-2xl p-7 flex flex-col justify-between text-left relative shadow-lg shadow-pink-500/5">
              <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md">
                แนะนำ 🔥
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-lg font-bold text-[#3e2723]">SiamLink Pro</h4>
                  <span className="text-[9px] font-black bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full border border-pink-100">👑 PRO</span>
                </div>
                <p className="text-[11px] text-pink-600 font-bold mb-5">สำหรับครีเอเตอร์และร้านค้ามืออาชีพ</p>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-4xl font-extrabold text-[#3e2723]">129</span>
                  <span className="text-[#7f5539] text-sm font-semibold">บาท / เดือน</span>
                </div>
                
                <hr className="border-pink-100 my-5" />

                <ul className="flex flex-col gap-3 text-xs text-[#3e2723] font-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="font-bold text-emerald-700">ลบลายน้ำท้ายหน้าออก 100%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="font-bold text-emerald-700">ฝังวิดีโอ YouTube / TikTok ได้ไม่จำกัด</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="font-bold text-emerald-700">ปลดล็อกธีมพรีเมียม 10 แบบ รวม 12 ธีม</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="font-bold text-emerald-700">ปุ่มขยับเรียกสายตาดึงดูดคลิก</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                    <span>สร้างลิงก์และเลขบัญชีได้ไม่จำกัดจำนวน</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                    <span>สถิติการคลิก & วิเคราะห์ความนิยม (Advanced)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                    <span>ซัพพอร์ตลำดับความสำคัญ</span>
                  </li>
                </ul>
              </div>

              <Link 
                href="/dashboard"
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-95 text-white font-bold py-3.5 px-6 rounded-xl transition-all cursor-pointer text-center text-xs mt-7 block shadow-md shadow-pink-500/15 hover:scale-102"
              >
                อัปเกรดเป็นสยามลิงก์โปร ⚡
              </Link>
            </div>

          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[#e4dfd5] bg-[#fdfbf7] py-10 px-6 text-center text-xs text-[#7f5539] relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-medium">© {new Date().getFullYear()} SiamLink. มินิมัลลิงก์ในไบโอสำหรับครีเอเตอร์ชาวไทย 🇹🇭</p>
          <span className="opacity-70 text-[10px]">สร้างสรรค์ด้วย ❤️ ในประเทศไทย</span>
        </div>
      </footer>

    </div>
  );
}
