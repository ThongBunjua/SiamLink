'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart2, Sparkles, ShieldAlert, ArrowLeft, TrendingUp, CheckCircle, 
  Eye, MousePointerClick, Calendar, Zap, Layout
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Profile, LinkItem } from '@/lib/types';
import Link from 'next/link';

interface LinkAnalytics extends LinkItem {
  click_count: number;
}

export default function AnalyticsPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [linksAnalytics, setLinksAnalytics] = useState<LinkAnalytics[]>([]);
  const [totalClicks, setTotalClicks] = useState(0);
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadAnalyticsData(session.user.id);
      } else {
        setLoading(false);
      }
    });
  }, []);

  const loadAnalyticsData = async (userId: string) => {
    try {
      setLoading(true);

      // 1. Fetch Profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileError || !profileData) throw profileError || new Error('No profile found');
      
      const p = profileData as Profile;
      setProfile(p);

      // Only fetch analytics details if Pro tier is unlocked
      if (p.plan === 'pro') {
        // 2. Fetch all links
        const { data: linksData, error: linksError } = await supabase
          .from('links')
          .select('*')
          .eq('profile_id', p.id)
          .order('sort_order', { ascending: true });

        if (linksError) throw linksError;

        const links = linksData as LinkItem[];

        // 3. For each link, fetch click count
        const analyticsList: LinkAnalytics[] = [];
        let grandTotal = 0;

        for (const link of links) {
          const { count, error: countError } = await supabase
            .from('click_logs')
            .select('*', { count: 'exact', head: true })
            .eq('link_id', link.id);

          if (countError) {
            console.error('Error counting clicks for link:', link.id, countError);
          }

          const countVal = count || 0;
          analyticsList.push({
            ...link,
            click_count: countVal,
          });
          grandTotal += countVal;
        }

        // Sort by click counts descending
        analyticsList.sort((a, b) => b.click_count - a.click_count);
        
        setLinksAnalytics(analyticsList);
        setTotalClicks(grandTotal);
      }
    } catch (err) {
      console.error('Error loading analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sandbox simulated upgrade trigger
  const handleUpgradeToPro = async () => {
    if (!profile) return;
    setUpgradeLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ plan: 'pro' })
        .eq('id', profile.id);

      if (error) throw error;
      
      setProfile(prev => prev ? { ...prev, plan: 'pro' } : null);
      // Automatically load analytics after simulated upgrade
      await loadAnalyticsData(session.user.id);
    } catch (err) {
      console.error('Failed to trigger upgrade', err);
    } finally {
      setUpgradeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center text-[#3e2723] font-medium">
        <Sparkles className="w-8 h-8 text-pink-500 animate-spin mb-4" />
        <p className="animate-pulse font-bold">กำลังดึงข้อมูลสถิติช่องทางของคุณ...</p>
      </div>
    );
  }

  // Not logged in fallback
  if (!session || !profile) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center p-6 text-[#3e2723]">
        <div className="text-center bg-white border border-[#e4dfd5] p-8 rounded-3xl shadow-xl max-w-sm w-full">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold">กรุณาเข้าสู่ระบบหลังบ้าน</h2>
          <p className="text-sm opacity-60 mt-1 mb-6">เข้าสู่ระบบเพื่อความปลอดภัยในการจัดการสถิติ</p>
          <Link href="/dashboard" className="w-full block text-center py-2.5 bg-[#3e2723] text-white font-bold rounded-xl hover:bg-[#54352f] transition-all text-xs">
            ไปที่หน้าแดชบอร์ด
          </Link>
        </div>
      </div>
    );
  }

  // PAYWALL: Free Tier users see a gorgeous lock screen
  if (profile.plan === 'free') {
    return (
      <div className="min-h-screen bg-[#fdfbf7] text-[#3e2723] flex flex-col font-sans">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-[#e4dfd5] px-6 py-4 sticky top-0 z-10">
          <div className="max-w-[1500px] mx-auto flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-stone-250 hover:bg-stone-50 rounded-xl transition-all">
              <ArrowLeft className="w-4 h-4" /> ย้อนกลับไปแผงควบคุม
            </Link>
            <h2 className="text-xl font-extrabold bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-1.5">
              SiamLink <span className="text-xs px-2 py-0.5 bg-neutral-200 text-neutral-700 rounded-full font-bold uppercase">Free</span>
            </h2>
          </div>
        </header>

        {/* Lock Screen paywall container */}
        <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full flex flex-col items-center justify-center">
          
          <div className="bg-white border border-[#e4dfd5] rounded-3xl p-8 md:p-12 shadow-xl w-full text-center relative overflow-hidden flex flex-col items-center">
            {/* Top decorative badge */}
            <div className="inline-flex p-3 bg-pink-50 text-pink-500 rounded-2xl mb-6">
              <BarChart2 className="w-8 h-8 animate-bounce" />
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              ปลดล็อกสถิติการคลิกขั้นสูงด้วย SiamLink Pro 📊
            </h1>

            <p className="text-sm md:text-base text-stone-550 max-w-xl mb-8 leading-relaxed">
              ก้าวไปอีกขั้นกับบัญชี Pro! บันทึกและแสดงผลยอดการคลิกลิงก์ทั้งหมดแบบเรียลไทม์ ช่วยให้คุณวิเคราะห์ช่องทางติดต่อที่ลูกค้าชอบที่สุดได้อย่างแม่นยำ
            </p>

            {/* Features comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl text-left mb-8">
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">การคลิกอัปเดตเรียลไทม์</h4>
                  <p className="text-xs text-stone-400 mt-0.5">บันทึกสถิติทุกครั้งที่ผู้เยี่ยมชมคลิกช่องทางโอนเงินหรือลิงก์</p>
                </div>
              </div>
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">ไม่มีลายน้ำท้ายเว็บ</h4>
                  <p className="text-xs text-stone-400 mt-0.5">ลบลายน้ำ Powered by SiamLink ที่ท้ายเพจออกเพื่อเพิ่มความน่าเชื่อถือ</p>
                </div>
              </div>
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">กล่องโอนเงินไม่จำกัด</h4>
                  <p className="text-xs text-stone-400 mt-0.5">เพิ่มช่องทางชำระเงินและปุ่มลิงก์โซเชียลของคุณได้ไม่จำกัด</p>
                </div>
              </div>
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">กราฟเปรียบเทียบความนิยม</h4>
                  <p className="text-xs text-stone-400 mt-0.5">เห็นอันดับความนิยมของลิงก์ที่ถูกคลิกมากที่สุดในหน้าเว็บ</p>
                </div>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-gradient-to-r from-pink-500/10 to-indigo-500/10 border border-pink-500/20 rounded-3xl p-6 mb-8 w-full max-w-md flex flex-col items-center">
              <span className="text-xs font-bold text-pink-600 uppercase tracking-widest bg-pink-100 px-3 py-1 rounded-full mb-2">SiamLink Pro</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight">129</span>
                <span className="text-lg font-bold opacity-75">บาท / เดือน</span>
              </div>
              <p className="text-[10px] opacity-60 mt-1">ยกเลิกหรือสลับแพลนได้ทุกเมื่อ ไม่มีสัญญาผูกมัด</p>
            </div>

            <button
              onClick={handleUpgradeToPro}
              disabled={upgradeLoading}
              className="px-8 py-4 bg-gradient-to-r from-pink-600 to-indigo-600 text-white font-extrabold rounded-2xl hover:opacity-95 shadow-lg hover:shadow-pink-500/20 active:scale-98 transition-all duration-300 text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-white" />
              {upgradeLoading ? 'กำลังทำรายการ...' : 'อัปเกรดเป็น SiamLink Pro ทันที (จำลอง) ⚡'}
            </button>
          </div>
        </main>
      </div>
    );
  }

  // PRO: Active premium analytics dashboard
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#3e2723] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#e4dfd5] px-6 py-4 sticky top-0 z-10">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:opacity-85 transition-opacity">
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-1.5">
                SiamLink <span className="text-xs px-2.5 py-0.5 bg-emerald-100 text-emerald-600 rounded-full font-bold uppercase">Pro</span>
              </h2>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/dashboard" className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-stone-500 hover:text-[#3e2723] rounded-xl transition-colors">
                <Layout className="w-4 h-4" /> แผงควบคุม
              </Link>
              <Link href="/dashboard/analytics" className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold bg-[#f5ebe0] text-[#3e2723] rounded-xl">
                <BarChart2 className="w-4 h-4 text-pink-600" /> สถิติ & ผู้ชม
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-1.5 px-4 py-2 border border-stone-250 hover:bg-stone-50 text-xs font-bold rounded-xl transition-all">
              <ArrowLeft className="w-3.5 h-3.5" /> กลับไปหน้าจัดลิงก์
            </Link>
          </div>
        </div>
      </header>

      {/* Main Analytics Content */}
      <main className="max-w-[1500px] mx-auto px-6 py-8 flex-1 w-full flex flex-col gap-8">
        
        {/* KPI Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#e4dfd5] rounded-3xl p-8 shadow-sm flex items-center gap-5">
            <div className="p-4 bg-pink-50 text-pink-500 rounded-2xl shrink-0">
              <MousePointerClick className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider opacity-65">ยอดคลิกสะสม (Total Clicks)</p>
              <h3 className="text-4xl font-extrabold tracking-tight mt-1">{totalClicks}</h3>
            </div>
          </div>

          <div className="bg-white border border-[#e4dfd5] rounded-3xl p-8 shadow-sm flex items-center gap-5">
            <div className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl shrink-0">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider opacity-65">อัตราเฉลี่ยความนิยม</p>
              <h3 className="text-2xl font-black tracking-tight mt-1 text-stone-850">
                {linksAnalytics.length > 0 ? (totalClicks / linksAnalytics.length).toFixed(1) : 0} <span className="text-sm opacity-60 font-extrabold">คลิก / ลิงก์</span>
              </h3>
            </div>
          </div>

          <div className="bg-white border border-[#e4dfd5] rounded-3xl p-8 shadow-sm flex items-center gap-5">
            <div className="p-4 bg-indigo-50 text-indigo-500 rounded-2xl shrink-0">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider opacity-65">สถานะแพ็กเกจ (Plan Status)</p>
              <h3 className="text-xl font-black tracking-tight mt-1 text-indigo-650">
                PRO ACTIVE 👑
              </h3>
            </div>
          </div>
        </div>

        {/* Visual Charts & Rankings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Rank Distribution chart */}
          <div className="bg-white border border-[#e4dfd5] rounded-3xl p-8 shadow-sm lg:col-span-8 flex flex-col gap-6">
            <h3 className="text-lg md:text-xl font-black uppercase tracking-wider opacity-85 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-pink-500 animate-pulse" /> แผนภูมิความนิยมของแต่ละช่องทาง
            </h3>

            {linksAnalytics.length === 0 ? (
              <div className="text-center py-16 opacity-50 text-base italic">
                ยังไม่มีข้อมูลคลิกสำหรับช่องทางใดๆ ในขณะนี้
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {linksAnalytics.map((link) => {
                  const maxClicks = Math.max(...linksAnalytics.map(l => l.click_count)) || 1;
                  const pct = (link.click_count / maxClicks) * 100;
                  
                  return (
                    <div key={link.id} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-sm md:text-base font-extrabold">
                        <span className="truncate max-w-[280px] opacity-85">{link.title}</span>
                        <span>{link.click_count} ครั้ง ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full h-4 bg-stone-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full transition-all duration-1000"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Top clicks lists */}
          <div className="bg-white border border-[#e4dfd5] rounded-3xl p-8 shadow-sm lg:col-span-4 flex flex-col gap-6">
            <h3 className="text-lg md:text-xl font-black uppercase tracking-wider opacity-85">
              ตารางความนิยมสูงสุด
            </h3>

            <div className="flex flex-col gap-4.5">
              {linksAnalytics.length === 0 ? (
                <div className="text-center py-10 opacity-40 text-sm italic">
                  ยังไม่มีการคลิก
                </div>
              ) : (
                linksAnalytics.slice(0, 5).map((link, idx) => (
                  <div key={link.id} className="flex items-center justify-between p-4 bg-stone-50 border border-stone-200 rounded-[1.25rem] shadow-3xs">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="w-6 h-6 flex items-center justify-center bg-pink-100 text-pink-650 rounded-full text-xs font-black shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-sm md:text-base font-extrabold truncate max-w-[160px]">{link.title}</span>
                    </div>
                    <span className="text-sm font-mono font-extrabold text-stone-650 shrink-0">{link.click_count} คลิก</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
