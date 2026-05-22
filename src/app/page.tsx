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
            <span className="text-xl font-black text-[#3e2723] tracking-tight group-hover:scale-102 transition-transform">
              SiamLink
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm font-bold text-[#7f5539] hover:text-[#3e2723] transition-colors hidden sm:block"
            >
              เข้าสู่ระบบหลังบ้าน
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

            {/* Left: Copy (SEO Tagging) */}
            <div className="flex flex-col gap-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/80 border border-[#d5bdaf]/40 rounded-full text-xs font-bold text-pink-600 shadow-xs w-fit mx-auto lg:mx-0 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" /> ระบบสร้าง ลิงก์ในไบโอ สำหรับครีเอเตอร์ชาวไทย 🇹🇭
              </div>

              {/* 💡 ดักคำค้นหาด้วย H1: ลิงก์ในไบโอ, รวมลิงก์, แปะลิงก์ TikTok, ทำลิงก์ในไอจี */}
              <h1 className="text-3xl md:text-5xl lg:text-[2.9rem] font-extrabold tracking-tight leading-[1.25] text-[#3e2723]">
                สร้าง <span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">ลิงก์ในไบโอ ฟรี</span> เว็บรวมลิงก์ มินิมอล ปิดยอดขายง่ายกว่าเดิม
              </h1>

              {/* 💡 ดักคำค้นหาประเภทคำยาว: ปุ่มคัดลอกเลขบัญชีโอนเงิน, วิธีบายพาสแอป LINE แชทหลุด, ฝังคลิปวิดีโอรีวิวสินค้า */}
              <p className="text-[#7f5539] text-sm md:text-base max-w-lg leading-relaxed font-medium mx-auto lg:mx-0">
                SiamLink คือแพลตฟอร์ม <strong className="font-bold text-[#3e2723]">Link in Bio ไทย</strong> ออกแบบพิเศษสำหรับคนขายของออนไลน์และอินฟลูเอนเซอร์ ช่วยให้คุณทำ <strong className="font-bold text-[#3e2723]">ปุ่มคัดลอกเลขบัญชีโอนเงิน</strong> ในคลิกเดียว พร้อมฟีเจอร์ <strong className="font-bold text-[#3e2723]">วิธีบายพาสแอป LINE</strong> กันแชทหลุด และฝังวิดีโอรีวิวสินค้าบนหน้าโปรไฟล์สไตล์คาเฟ่
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full justify-center lg:justify-start max-w-md mx-auto lg:mx-0">
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 bg-[#3e2723] hover:bg-[#54352f] text-white font-black px-7 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 text-sm cursor-pointer"
                >
                  เริ่มสร้างลิงก์ฟรีตอนนี้ <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#pricing"
                  className="flex items-center justify-center gap-2 bg-white hover:bg-[#f5ebe0] border border-[#d5bdaf]/60 text-[#3e2723] font-bold px-7 py-3.5 rounded-xl transition-all text-sm cursor-pointer"
                >
                  ดูแพ็กเกจราคาพรีเมียม
                </Link>
              </div>

              <div className="flex items-center gap-4 justify-center lg:justify-start text-[11px] text-[#7f5539] font-bold mt-2">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> สมัครทำลิงก์ฟรีตลอดชีพ</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> ไม่ต้องผูกบัตรเครดิต</span>
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
                      <p className="text-[9px] opacity-65 mt-0.5 font-medium max-w-[180px] leading-relaxed">ร้านค้าและอินฟลูเอนเซอร์ ☕ รวมลิงก์ขายของใน TikTok</p>
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
                        <p className="text-[8px] font-bold text-center opacity-60 mt-1">ฝังคลิปวิดีโอรีวิวสินค้าจาก TikTok 🎬</p>
                      </div>

                      {/* Bank card */}
                      <button
                        onClick={handleCopyMockBank}
                        className="w-full bg-[#f5ebe0] border border-[#d5bdaf] rounded-xl p-2.5 flex items-center justify-between text-left shadow-xs hover:bg-[#ebd5c7] transition-all cursor-pointer group/btn active:scale-98"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 border border-emerald-200/50">
                            <CreditCard className="w-3 h-3" />
                          </div>
                          <div className="truncate">
                            <h5 className="font-bold text-[10px] text-[#3e2723]">ปุ่มโอนเงิน — นายสยามลิงก์</h5>
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
                              <Copy className="w-2 h-2" /> คัดลอกบัญชี
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
                            <h5 className="font-bold text-[10px] text-[#3e2723]">ลิงก์ LINE บายพาสอัตโนมัติ</h5>
                            <span className="text-[8px] text-[#7f5539] font-medium">กดปุ๊บเด้งเข้าแอปไลน์ทันที</span>
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
                            <h5 className="font-bold text-[10px] text-[#3e2723]">แปะลิงก์ร้านค้า Shopee / Lazada 🛒</h5>
                            <span className="text-[8px] text-[#7f5539] font-medium">แต่ง Bio Link คาเฟ่เรียกสายตา</span>
                          </div>
                        </div>
                        <ArrowUpRight className="w-3 h-3 text-[#3e2723]/40" />
                      </div>
                    </div>

                    {/* Watermark */}
                    <div className="text-center shrink-0 mt-1">
                      <span className="text-[8px] font-bold text-[#7f5539]/40">
                        สร้างลิงก์ฟรีด้วย SiamLink.com 🇹🇭
                      </span>
                    </div>

                  </div>
                </div>

                {/* Decorative floating badges */}
                <div className="absolute -top-3 -right-6 bg-white border border-[#d5bdaf]/40 rounded-xl px-3 py-1.5 shadow-lg text-[10px] font-black text-emerald-600 animate-bobbing z-30" style={{ animationDuration: '3s' }}>
                  ✨ ปุ่มขยับแอนิเมชันเรียกยอดคลิก
                </div>
                <div className="absolute -bottom-2 -left-6 bg-white border border-[#d5bdaf]/40 rounded-xl px-3 py-1.5 shadow-lg text-[10px] font-black text-pink-600 animate-bobbing z-30" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
                  📋 คัดลอกเลขบัญชีธนาคารรวดเร็ว
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ─── FEATURES SECTION ─── */}
        <section className="bg-white/40 border-y border-[#e4dfd5]/60 py-20 relative z-10 mt-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="text-[10px] font-black text-pink-600 uppercase tracking-[0.2em] bg-pink-50 px-3.5 py-1.5 rounded-full mb-4 inline-block border border-pink-100">รวมลิงก์ มินิมอล ฟีเจอร์เด่น</span>
              {/* 💡 ดักคีย์เวิร์ดระดับ H2: ลิงก์ขายของใน TikTok, วิธีทำลิงก์ในไอจี, ปุ่มโอนเงิน */}
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#3e2723] mt-3">ระบบ ลิงก์ในไบโอ ที่ดีที่สุดสำหรับคนขายของออนไลน์และ TikToker</h2>
              <p className="text-[#7f5539] text-sm max-w-lg mx-auto font-medium mt-3">แก้ปัญหาสุดปวดหัวของครีเอเตอร์ไทย ช่วยลดขั้นตอน ลดแชทตกค้าง ดึงดูดลูกค้าให้กดซื้อได้ไวกว่าเดิม</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="bg-white border border-[#e4dfd5]/80 rounded-2xl p-7 hover:border-pink-400/30 transition-all duration-300 shadow-xs group">
                <div className="w-11 h-11 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-pink-100">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#3e2723] mb-2">ปุ่มคัดลอกเลขบัญชีโอนเงิน 💳</h3>
                <p className="text-[#7f5539] text-xs leading-relaxed font-medium">
                  เบื่อไหมกับการที่ลูกค้าต้องคอยพิมพ์ถามเลขบัญชี? ด้วยระบบ <strong className="text-[#3e2723]">ปุ่มโอนเงินสไตล์มินิมอล</strong> ลูกค้าสามารถกดที่แถบเพื่อคัดลอกรหัสบัญชีไปวางในแอปธนาคารได้ทันที สะดวก รวดเร็ว ปิดยอดขายของออนไลน์ได้ไวขึ้น 3 เท่า
                </p>
              </div>

              <div className="bg-white border border-[#e4dfd5]/80 rounded-2xl p-7 hover:border-emerald-400/30 transition-all duration-300 shadow-xs group">
                <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-emerald-100">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#3e2723] mb-2">วิธีบายพาสแอป LINE แชทหลุด 💬</h3>
                <p className="text-[#7f5539] text-xs leading-relaxed font-medium">
                  หมดปัญหาเวลากดเปิดลิงก์ไลน์จากหน้า Bio ในแอป TikTok หรือ Instagram แล้วแชทหน้าต่างหลุดหรือไม่เด้งเข้าแอปหลัก ระบบสยามลิงก์มีระบบ <strong className="text-[#3e2723]">Bypass In-App Browser</strong> บังคับเปิดบนแอปพลิเคชัน LINE หลักโดยตรงทันที
                </p>
              </div>

              <div className="bg-white border border-[#e4dfd5]/80 rounded-2xl p-7 hover:border-amber-400/30 transition-all duration-300 shadow-xs group">
                <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-amber-100">
                  <Video className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#3e2723] mb-2">ฝังคลิปวิดีโอรีวิวสินค้าบนหน้าแรก 🎬</h3>
                <p className="text-[#7f5539] text-xs leading-relaxed font-medium">
                  เพิ่มความน่าเชื่อถือให้กับหน้าเว็บรวมลิงก์ของคุณ ครีเอเตอร์สามารถนำลิงก์ <strong className="text-[#3e2723]">ฝังวิดีโอจาก YouTube หรือ TikTok</strong> มาแปะโชว์เพื่อให้ผู้เยี่ยมชมกดเปิดดูคลิปรีวิวป้ายยา หรือคลิปแนะนำตัวได้ทันทีโดยไม่ต้องเปลี่ยนหน้าต่างหนีไปไหน
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ─── PRICING SECTION ─── */}
        <section id="pricing" className="max-w-6xl mx-auto px-6 py-20 text-center relative z-10">
          <div className="text-center mb-14">
            <span className="text-[10px] font-black text-pink-600 uppercase tracking-[0.2em] bg-pink-50 px-3.5 py-1.5 rounded-full mb-4 inline-block border border-pink-100">แพ็กเกจราคาพรีเมียม</span>
            {/* 💡 ดักคีย์เวิร์ดระดับ H2: เว็บรวมลิงก์ มินิมอล, สมัครสร้างลิงก์ในไบโอฟรี */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#3e2723] mt-3">สมัครสร้างหน้า รวมลิงก์ มินิมอล ในราคาที่คุ้มค่าที่สุด</h2>
            <p className="text-[#7f5539] text-sm max-w-md mx-auto font-medium mt-3">เลือกแพลนที่ใช่เพื่อปรับแต่ง Bio Link คาเฟ่ของคุณให้ดูเป็นมืออาชีพยิ่งขึ้น เริ่มต้นใช้งานได้ฟรี</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto items-stretch">

            {/* Free Tier */}
            <div className="bg-white border border-[#e4dfd5] rounded-2xl p-7 flex flex-col justify-between text-left shadow-xs">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-lg font-bold text-[#3e2723]">SiamLink Free (เริ่มต้นฟรี)</h4>
                  <span className="text-[9px] font-black bg-[#f5ebe0] text-[#7f5539] px-2 py-0.5 rounded-full">🆓 ฟรีตลอดชีพ</span>
                </div>
                <p className="text-[11px] text-[#7f5539] mb-5 font-medium">สำหรับครีเอเตอร์และร้านค้าออนไลน์ที่เพิ่งเริ่มต้นเปิดร้าน</p>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-4xl font-extrabold text-[#3e2723]">0</span>
                  <span className="text-[#7f5539] text-sm font-semibold">บาท / สร้างลิงก์ในไบโอฟรี</span>
                </div>

                <hr className="border-[#e4dfd5] my-5" />

                <ul className="flex flex-col gap-3 text-xs text-[#3e2723] font-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>หน้าโปรไฟล์รวมลิงก์ Mobile-First เปิดดาวน์โหลดรวดเร็ว</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>สร้างปุ่มลิงก์โซเชียลมีเดียได้สูงสุด 5 ปุ่มคัดลอก</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>ระบบก๊อปเลขบัญชีอัตโนมัติ + บายพาสลิงก์แอป LINE</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>ฝังคลิปวิดีโอรีวิวสินค้าได้ 1 คลิปบนหน้าต่างหลัก</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>ธีมสีสไตล์มินิมอลคาเฟ่ & สีคลีนไวท์คลาสสิก</span>
                  </li>
                  <li className="flex items-start gap-2 opacity-40">
                    <X className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                    <span>มีลายน้ำเครดิต SiamLink แปะท้ายหน้าเพจ</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/dashboard"
                className="w-full bg-[#3e2723] hover:bg-[#54352f] text-white font-bold py-3 px-6 rounded-xl transition-all cursor-pointer text-center text-xs mt-7 block shadow-md hover:scale-102"
              >
                สมัครสร้างลิงก์ในไบโอฟรี
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-white border-2 border-pink-400/50 rounded-2xl p-7 flex flex-col justify-between text-left relative shadow-lg shadow-pink-500/5">
              <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md">
                แนะนำสำหรับมืออาชีพ 🔥
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-lg font-bold text-[#3e2723]">SiamLink Pro (เวอร์ชันจัดเต็ม)</h4>
                  <span className="text-[9px] font-black bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full border border-pink-100">👑 PRO</span>
                </div>
                <p className="text-[11px] text-pink-600 font-bold mb-5">ปลดล็อกฟีเจอร์พรีเมียมทั้งหมดเพื่อเร่งสถิติการปิดยอดขายขั้นสุด</p>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-4xl font-extrabold text-[#3e2723]">129</span>
                  <span className="text-[#7f5539] text-sm font-semibold">บาท / เติมสิทธิ์รายเดือน (30 วัน)</span>
                </div>

                <hr className="border-pink-100 my-5" />

                <ul className="flex flex-col gap-3 text-xs text-[#3e2723] font-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="font-bold text-emerald-700">ลบลายน้ำและเครดิตท้ายเว็บออก 100%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="font-bold text-emerald-700">ฝังคลิปวิดีโอ YouTube / TikTok ได้ไม่จำกัดจำนวน</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="font-bold text-emerald-700">ปลดล็อก 12 ธีมพรีเมียมยอดนิยม สไตล์คาเฟ่จัดเต็ม</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="font-bold text-emerald-700">เปิดโหมดปุ่มขยับสั่นส่ายเรียกสายตาผู้เยี่ยมชม</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                    <span>สร้างปุ่มลิงก์ แปะลิงก์ร้านค้า และเลขบัญชีได้ไม่จำกัด</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                    <span>ระบบวิเคราะห์สถิติการคลิก ดูกราฟความนิยมช่องทางเรียลไทม์</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/dashboard"
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-95 text-white font-bold py-3.5 px-6 rounded-xl transition-all cursor-pointer text-center text-xs mt-7 block shadow-md shadow-pink-500/15 hover:scale-102"
              >
                อัปเกรดสมัครสยามลิงก์โปร ⚡
              </Link>
            </div>

          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[#e4dfd5] bg-[#fdfbf7] py-10 px-6 text-center text-xs text-[#7f5539] relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* 💡 เก็บตกคีย์เวิร์ดในเครดิตท้ายเว็บเพื่อส่งสัญญาณหาบอทกูเกิล */}
          <p className="font-medium">© {new Date().getFullYear()} SiamLink. แพลตฟอร์มสร้าง ลิงก์ในไบโอ มินิมอล ผูกปุ่มโอนเงินสัญชาติไทยเพื่อครีเอเตอร์ชาวไทย 🇹🇭</p>
          <span className="opacity-70 text-[10px]">ออกแบบและพัฒนาด้วย ❤️ สำหรับคนขายของออนไลน์ในประเทศไทย</span>
        </div>
      </footer>

    </div>
  );
}