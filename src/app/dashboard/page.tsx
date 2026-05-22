'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, ArrowUp, ArrowDown, LogOut, Layout, Link as LinkIcon, 
  CreditCard, MessageCircle, Sparkles, User, Settings, BarChart2, Eye, ShieldAlert,
  Copy, CheckCircle, Check, Play, Lock, AlertCircle, X, ExternalLink, Video, QrCode
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Profile, LinkItem, ThemeName, LinkType, THEMES } from '@/lib/types';
import Link from 'next/link';
import CheckoutButton from './components/CheckoutButton';

const getYoutubeId = (url: string) => {
  if (url.includes('/shorts/')) {
    const parts = url.split('/shorts/');
    if (parts[1]) {
      return parts[1].split(/[?#&]/)[0];
    }
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const getTikTokId = (url: string) => {
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] : null;
};

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  // Profile State
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [theme, setTheme] = useState<ThemeName>('clean_light');
  const [saveProfileLoading, setSaveProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Premium Features States
  const [removeWatermark, setRemoveWatermark] = useState(false);
  const [isNewAnimated, setIsNewAnimated] = useState(false);
  const [isNewVideoEmbed, setIsNewVideoEmbed] = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [upsellReason, setUpsellReason] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutTab, setCheckoutTab] = useState<'promptpay' | 'card'>('promptpay');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Links State
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<LinkType>('link');
  const [newUrl, setNewUrl] = useState('');
  const [newBankNumber, setNewBankNumber] = useState('');
  const [newBankName, setNewBankName] = useState('');
  const [addLinkLoading, setAddLinkLoading] = useState(false);
  const [linksMessage, setLinksMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Sharing States & Logics
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Simulator Copy State
  const [simulatorCopiedId, setSimulatorCopiedId] = useState<string | null>(null);
  const [checkoutCopied, setCheckoutCopied] = useState(false);

  useEffect(() => {
    if (profile && typeof window !== 'undefined') {
      setShareUrl(`${window.location.origin}/${profile.username}`);
    }
  }, [profile]);

  const handleCopyShareLink = async () => {
    if (!profile) return;
    try {
      const urlToCopy = shareUrl || `${window.location.origin}/${profile.username}`;
      await navigator.clipboard.writeText(urlToCopy);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy share link:', err);
    }
  };

  // Check auth session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchOrCreateProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchOrCreateProfile(session.user);
      } else {
        setProfile(null);
        setLinks([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch or Auto-Create Profile for new users
  const fetchOrCreateProfile = async (user: any) => {
    try {
      setLoading(true);
      
      // Try to fetch profile
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // Auto-create a beautiful default profile based on their email prefix
        const defaultUsername = (user.email?.split('@')[0] || 'creator') + Math.floor(Math.random() * 1000);
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: user.id,
              username: defaultUsername.toLowerCase().replace(/[^a-z0-9_]/g, ''),
              display_name: user.email?.split('@')[0] || 'สยาม ครีเอเตอร์',
              bio: 'ยินดีต้อนรับสู่หน้าลิงก์ของฉัน! 🇹🇭',
              theme: 'clean_light',
              plan: 'free',
            }
          ])
          .select()
          .single();

        if (createError) throw createError;
        data = newProfile;
      }

      const p = data as Profile;
      setProfile(p);
      setUsername(p.username);
      setDisplayName(p.display_name || '');
      
      const bioStr = p.bio || '';
      setRemoveWatermark(bioStr.includes('[config:remove_watermark=true]'));
      setBio(bioStr.replace('[config:remove_watermark=true]', '').trim());
      
      setAvatarUrl(p.avatar_url || '');
      setTheme(p.theme);

      // Fetch links for this profile
      await fetchLinks(p.id);
    } catch (err: any) {
      console.error('Error loading profile:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLinks = async (profileId: string) => {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('profile_id', profileId)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching links:', error);
    } else {
      const mapped = (data || []).map((link: any) => {
        const urlHash = link.url?.split('#')[1] || '';
        const isHighlighted = urlHash.includes('animated=true') || 
                              urlHash.includes('is_highlighted=true') ||
                              (link.type === 'bank' && (link.url === '#animated=true' || link.url === '#is_highlighted=true'));
        
        let mappedType = link.type;
        if (link.type === 'link' && (urlHash.includes('type=video') || urlHash.includes('video_embed=true'))) {
          mappedType = 'video';
        }
        
        return {
          ...link,
          type: mappedType,
          is_highlighted: isHighlighted,
        };
      });
      setLinks(mapped);
    }
  };

  // Auth Operations
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthMessage(null);
    setLoading(true);

    try {
      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        if (data.user && data.session === null) {
          setAuthMessage('สมัครสมาชิกสำเร็จ! โปรดตรวจสอบอีเมลของคุณเพื่อยืนยันบัญชี (เช็กกล่องอีเมลขยะด้วย)');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setAuthError(err.message || 'เกิดข้อผิดพลาดในการลงชื่อเข้าใช้งาน');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaveProfileLoading(true);
    setProfileMessage(null);

    // Guard: Pro Themes selector limit
    const selectedThemeConfig = THEMES[theme];
    if (selectedThemeConfig.isPro && profile.plan !== 'pro') {
      setUpsellReason('ธีมพรีเมียมสีสันสดใส 🔒');
      setShowUpsellModal(true);
      setSaveProfileLoading(false);
      return;
    }

    // Guard: Remove Watermark toggle limit
    if (removeWatermark && profile.plan !== 'pro') {
      setUpsellReason('การลบลายน้ำเครดิต SiamLink ท้ายเว็บ 🔒');
      setShowUpsellModal(true);
      setSaveProfileLoading(false);
      return;
    }

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (cleanUsername.length < 3) {
      setProfileMessage({ type: 'error', text: 'ชื่อผู้ใช้งานต้องมีความยาวอย่างน้อย 3 ตัวอักษร' });
      setSaveProfileLoading(false);
      return;
    }

    // Compile bio with watermark suffix if enabled
    let finalBio = bio.trim();
    if (removeWatermark) {
      finalBio = `${finalBio} [config:remove_watermark=true]`;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: cleanUsername,
          display_name: displayName.trim() || null,
          bio: finalBio || null,
          avatar_url: avatarUrl.trim() || null,
          theme: theme,
        })
        .eq('id', profile.id);

      if (error) {
        if (error.code === '23505') {
          throw new Error('ชื่อผู้ใช้งานนี้มีผู้ใช้แล้ว โปรดเลือกชื่ออื่น');
        }
        throw error;
      }

      setProfile(prev => prev ? { ...prev, username: cleanUsername, display_name: displayName, bio: finalBio, avatar_url: avatarUrl, theme } : null);
      setProfileMessage({ type: 'success', text: 'บันทึกการตั้งค่าโปรไฟล์และธีมเรียบร้อยแล้ว! ✨' });
    } catch (err: any) {
      setProfileMessage({ type: 'error', text: err.message || 'บันทึกข้อมูลล้มเหลว' });
    } finally {
      setSaveProfileLoading(false);
    }
  };

  // Watermark Click Interceptor
  const handleWatermarkToggle = (checked: boolean) => {
    setRemoveWatermark(checked);
  };

  // Animated Highlight Click Interceptor
  const handleAnimatedCheckbox = (checked: boolean) => {
    setIsNewAnimated(checked);
  };

  // Video Embed Type Selector Interceptor
  const handleSelectVideoType = () => {
    setNewType('video');
    setIsNewVideoEmbed(true);
    setLinksMessage(null);
  };

  // Sandbox simulated upgrade trigger
  const handleSandboxUpgrade = async () => {
    if (!profile) return;
    setCheckoutLoading(true);
    
    // Simulate payment transaction network latency of 1.5 seconds
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ plan: 'pro' })
        .eq('id', profile.id);

      if (error) throw error;
      
      setProfile(prev => prev ? { ...prev, plan: 'pro' } : null);
      setProfileMessage({ type: 'success', text: 'อัปเกรดเป็นบัญชี PRO (โหมดจำลองทดสอบ) สำเร็จ! ยินดีต้อนรับสู่ SiamLink Pro 🎉' });
      setShowUpsellModal(false);
      setShowCheckoutModal(false);
    } catch (err: any) {
      console.error('Sandbox upgrade failed:', err.message);
      setProfileMessage({ type: 'error', text: err.message || 'เกิดข้อผิดพลาดในการอัปเกรด' });
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Link Operations
  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    // Guard: Free plan limits standard link elements count to maximum 5
    if (links.length >= 5 && profile.plan !== 'pro') {
      setUpsellReason('การสร้างช่องทางติดต่อลิงก์ได้ไม่จำกัดจำนวน 🔒');
      setShowUpsellModal(true);
      return;
    }

    const isAddingVideo = newType === 'video' || isNewVideoEmbed;
    const videoCount = links.filter(l => l.type === 'video' || l.url?.includes('#type=video') || l.url?.includes('#video_embed=true')).length;

    if (isAddingVideo && profile.plan !== 'pro' && videoCount >= 1) {
      setLinksMessage({ type: 'error', text: 'ปลดล็อกการลงวิดีโอไม่จำกัดด้วย SiamLink Pro' });
      setUpsellReason('ปลดล็อกการลงวิดีโอไม่จำกัดด้วย SiamLink Pro');
      setShowUpsellModal(true);
      return;
    }

    // Guard: Wiggle / Attention Grabber is a Pro Feature
    if (isNewAnimated && profile.plan !== 'pro') {
      setUpsellReason('ขยับปุ่มเพื่อเรียกสายตา (Attention Grabber) 🔒');
      setShowUpsellModal(true);
      return;
    }

    if (!newTitle.trim() && newType !== 'bank') {
      setLinksMessage({ type: 'error', text: 'โปรดระบุหัวข้อลิงก์' });
      return;
    }

    setAddLinkLoading(true);
    setLinksMessage(null);

    let url: string | null = null;
    let bankNumber: string | null = null;
    let bankName: string | null = null;

    if (newType === 'bank') {
      if (!newBankNumber.trim()) {
        setLinksMessage({ type: 'error', text: 'โปรดระบุเลขบัญชีธนาคาร' });
        setAddLinkLoading(false);
        return;
      }
      if (!newTitle.trim()) {
        setLinksMessage({ type: 'error', text: 'โปรดระบุชื่อบัญชีธนาคาร' });
        setAddLinkLoading(false);
        return;
      }
      bankNumber = newBankNumber.trim();
      bankName = newBankName.trim() || 'พร้อมเพย์';
      
      // Save animation flag inside URL for bank type
      if (isNewAnimated) {
        url = '#animated=true';
      }
    } else {
      if (!newUrl.trim()) {
        setLinksMessage({ type: 'error', text: 'โปรดระบุลิงก์ปลายทาง' });
        setAddLinkLoading(false);
        return;
      }

      let rawUrl = newUrl.trim();

      // LINE URL intelligent parser escape wrapper rules
      if (newType === 'line') {
        if (!rawUrl.includes('line.me') && !rawUrl.startsWith('http') && rawUrl.length > 0) {
          const cleanId = rawUrl.replace('@', '');
          rawUrl = `https://line.me/ti/p/~${cleanId}`;
        }
        if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
          rawUrl = 'https://' + rawUrl;
        }
        if (!rawUrl.includes('openExternalBrowser=1')) {
          rawUrl = rawUrl.includes('?') 
            ? `${rawUrl}&openExternalBrowser=1` 
            : `${rawUrl}?openExternalBrowser=1`;
        }
      } else {
        if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
          rawUrl = 'https://' + rawUrl;
        }
      }

      // Serialize premium features in url parameters
      if (newType === 'video') {
        if (!rawUrl.includes('type=video')) {
          rawUrl = rawUrl.includes('#') ? rawUrl.replace('#', '#type=video&') : rawUrl + '#type=video';
        }
      }

      if (isNewAnimated) {
        if (!rawUrl.includes('animated=true')) {
          rawUrl = rawUrl.includes('#') ? rawUrl.replace('#', '#animated=true&') : rawUrl + '#animated=true';
        }
      }

      url = rawUrl;
    }

    try {
      const nextSortOrder = links.length > 0 ? Math.max(...links.map(l => l.sort_order)) + 1 : 0;
      const dbType = newType === 'video' ? 'link' : newType;
      
      const { data, error } = await supabase
        .from('links')
        .insert([
          {
            profile_id: profile.id,
            type: dbType,
            title: newTitle.trim(),
            url: url,
            bank_number: bankNumber,
            bank_name: bankName,
            sort_order: nextSortOrder,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      const inserted = data as LinkItem;
      const urlHash = inserted.url?.split('#')[1] || '';
      const isHighlighted = urlHash.includes('animated=true') || 
                            urlHash.includes('is_highlighted=true') ||
                            (inserted.type === 'bank' && (inserted.url === '#animated=true' || inserted.url === '#is_highlighted=true'));
      
      let mappedType = inserted.type;
      if (inserted.type === 'link' && (urlHash.includes('type=video') || urlHash.includes('video_embed=true'))) {
        mappedType = 'video';
      }

      const mapped = {
        ...inserted,
        type: mappedType,
        is_highlighted: isHighlighted,
      };

      setLinks(prev => [...prev, mapped]);
      setNewTitle('');
      setNewUrl('');
      setNewBankNumber('');
      setNewBankName('');
      setIsNewAnimated(false);
      setIsNewVideoEmbed(false);
      setNewType('link');
      setLinksMessage({ type: 'success', text: 'เพิ่มช่องทาง SiamLink สำเร็จ! พร้อมโชว์บนหน้าเว็บทันที ⚡' });
    } catch (err: any) {
      setLinksMessage({ type: 'error', text: err.message || 'ไม่สามารถเพิ่มลิงก์ได้' });
    } finally {
      setAddLinkLoading(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setLinks(prev => prev.filter(l => l.id !== id));
    } catch (err: any) {
      setLinksMessage({ type: 'error', text: err.message || 'ไม่สามารถลบลิงก์ได้' });
    }
  };

  const moveLink = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === links.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedLinks = [...links];

    // Swap local sort orders
    const tempOrder = updatedLinks[index].sort_order;
    updatedLinks[index].sort_order = updatedLinks[newIndex].sort_order;
    updatedLinks[newIndex].sort_order = tempOrder;

    // Swap elements in local array
    const temp = updatedLinks[index];
    updatedLinks[index] = updatedLinks[newIndex];
    updatedLinks[newIndex] = temp;

    setLinks(updatedLinks);

    // Save to database
    try {
      await supabase
        .from('links')
        .update({ sort_order: updatedLinks[index].sort_order })
        .eq('id', updatedLinks[index].id);

      await supabase
        .from('links')
        .update({ sort_order: updatedLinks[newIndex].sort_order })
        .eq('id', updatedLinks[newIndex].id);
    } catch (err) {
      console.error('Failed to save link order to database:', err);
    }
  };

  // Simulated click logic for interactive mockup preview
  const handleSimulateCopyBank = (linkId: string, bankNumber: string) => {
    navigator.clipboard.writeText(bankNumber);
    setSimulatorCopiedId(linkId);
    setTimeout(() => setSimulatorCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center text-[#3e2723] font-medium">
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          <Sparkles className="w-12 h-12 text-pink-500 animate-spin" />
        </div>
        <p className="animate-pulse font-extrabold text-lg">กำลังเข้าสู่หลังบ้านสยามลิงก์ของคุณ...</p>
      </div>
    );
  }

  // Not logged in: Show premium registration/login screen
  if (!session) {
    return (
      <main className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center p-6 text-[#3e2723]">
        <div className="w-full max-w-2xl bg-white border border-[#e4dfd5] rounded-[2.5rem] p-12 md:p-14 shadow-2xl relative overflow-hidden">
          {/* Top aesthetic accent */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />
          
          <div className="text-center mb-12 mt-4">
            <h1 className="text-5xl md:text-6xl font-black tracking-wider bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent inline-flex items-center gap-3">
              SiamLink <span className="text-3xl md:text-4xl opacity-80">🇹🇭</span>
            </h1>
            <p className="text-sm font-extrabold text-stone-400 mt-3 uppercase tracking-widest">
              Link-in-Bio for Thai Creators
            </p>
          </div>

          <form onSubmit={handleAuth} className="flex flex-col gap-8">
            <div>
              <label className="block text-base md:text-lg font-black uppercase tracking-wider text-stone-700 mb-3">อีเมล (Email)</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="อีเมลของคุณ@gmail.com"
                className="w-full px-6 py-4.5 bg-stone-50 border-2 border-stone-250 rounded-2xl text-lg md:text-xl focus:outline-hidden focus:ring-2 focus:ring-pink-500 transition-all text-[#3e2723]"
              />
            </div>
            
            <div>
              <label className="block text-base md:text-lg font-black uppercase tracking-wider text-stone-700 mb-3">รหัสผ่าน (Password)</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-6 py-4.5 bg-stone-50 border-2 border-stone-250 rounded-2xl text-lg md:text-xl focus:outline-hidden focus:ring-2 focus:ring-pink-500 transition-all text-[#3e2723]"
              />
            </div>

            {authError && (
              <div className="p-5 bg-rose-50 border-2 border-rose-250 text-rose-700 rounded-2xl text-base font-black">
                {authError}
              </div>
            )}

            {authMessage && (
              <div className="p-5 bg-emerald-50 border-2 border-emerald-250 text-emerald-700 rounded-2xl text-base font-black">
                {authMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3e2723] hover:bg-[#54352f] text-white font-black py-4.5 px-6 rounded-2xl text-lg md:text-xl transition-all cursor-pointer disabled:opacity-50 hover:scale-102 flex items-center justify-center gap-2 shadow-md mt-4"
            >
              {loading ? (
                <span>กำลังโหลด...</span>
              ) : isRegistering ? (
                <>สมัครสมาชิกและเริ่มต้นสร้างลิงก์ ✨</>
              ) : (
                <>ลงชื่อเข้าสู่ระบบสยามลิงก์ ⚡</>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mt-6">
              <div className="flex-1 h-px bg-stone-200" />
              <span className="text-sm font-bold text-stone-400 uppercase tracking-wider">หรือ</span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={async () => {
                setAuthError(null);
                const { error: authError } = await supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                  },
                });
                if (authError) {
                  setAuthError(authError.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ Google');
                }
              }}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-stone-50 border-2 border-stone-200 hover:border-stone-300 text-[#3e2723] font-black py-4.5 px-6 rounded-2xl text-lg md:text-xl transition-all cursor-pointer hover:scale-102 shadow-xs mt-2"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              เข้าสู่ระบบด้วย Google
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setAuthError(null);
                  setAuthMessage(null);
                }}
                className="text-stone-500 hover:text-[#3e2723] text-base font-extrabold underline cursor-pointer transition-colors"
              >
                {isRegistering ? 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบที่นี่' : 'ยังไม่มีบัญชีสยามลิงก์? สมัครสมาชิกฟรีที่นี่'}
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  const activeThemeConfig = THEMES[theme] || THEMES.clean_light;

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#3e2723] flex flex-col font-sans relative overflow-x-hidden text-sm">
      {/* Premium Dashboard Header (More Compact) */}
      <header className="bg-white/90 backdrop-blur-md border-b border-[#e4dfd5] px-5 py-2.5 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            {/* BRAND LOGO CLICK EVENT BACK TO HOMEPAGE */}
            <Link href="/" className="hover:opacity-85 transition-opacity">
              <h2 className="text-xl font-black bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-1.5">
                SiamLink 
                <span className="text-[9px] px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full font-black uppercase tracking-widest">
                  {profile?.plan === 'pro' ? '👑 PRO' : '🆓 FREE'}
                </span>
              </h2>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/dashboard" className="flex items-center gap-1 px-3 py-1 text-[11px] font-black bg-[#f5ebe0] text-[#3e2723] rounded-lg shadow-2xs">
                <Layout className="w-3.5 h-3.5 text-pink-650" /> แผงควบคุมลิงก์
              </Link>
              <Link href="/dashboard/analytics" className="flex items-center gap-1 px-3 py-1 text-[11px] font-black text-stone-550 hover:text-[#3e2723] rounded-lg transition-colors">
                <BarChart2 className="w-3.5 h-3.5 text-stone-400" /> วิเคราะห์ผู้ชม
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {profile && (
              <>
                <button
                  onClick={handleCopyShareLink}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-pink-600 to-indigo-600 hover:opacity-95 text-white text-[11px] font-black rounded-lg transition-all cursor-pointer shadow-md hover:shadow-pink-500/15 active:scale-95"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3 h-3" /> คัดลอกแล้ว!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> แชร์ลิงก์
                    </>
                  )}
                </button>
                <a 
                  href={`/${profile.username}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 border border-stone-300 hover:bg-stone-50 text-[11px] font-black rounded-lg transition-all"
                >
                  <Eye className="w-3 h-3" /> พรีวิวเว็บจริง
                </a>
              </>
            )}
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-1 px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 text-[11px] font-black rounded-lg transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> ออกระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Local Sandbox simulated upgrade helper banner */}
      {profile && profile.plan !== 'pro' && (
        <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border-b border-pink-100 px-6 py-2.5 text-center text-xs font-extrabold flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>⚡ คุณกำลังใช้งาน SiamLink เวอร์ชั่นทดสอบฟรี</span>
          <button 
            onClick={() => setShowCheckoutModal(true)} 
            className="px-3.5 py-1 bg-white hover:bg-pink-50 border border-pink-200 text-pink-600 rounded-lg text-xs font-black transition-all shrink-0 shadow-xs cursor-pointer hover:scale-102"
          >
            อัปเกรดเป็น SiamLink Pro ทันที 👑
          </button>
        </div>
      )}

      {/* Main 3-Column Premium Layout grid (Compact & Clean spacing) */}
      <main className="max-w-[1500px] mx-auto px-4 md:px-6 py-6 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 z-10">
        
        {/* COLUMN 1: Profile Settings & Theme Presets (lg:col-span-6 xl:col-span-3 - Taller & Sleeker) */}
        <section className="lg:col-span-6 xl:col-span-3 flex flex-col gap-6">
          <div className="bg-white border border-[#e4dfd5] rounded-3xl p-5 xl:p-6 shadow-xs flex flex-col gap-4 min-h-[960px]">
            <h3 className="text-base font-black uppercase tracking-wider text-stone-750 flex items-center gap-2 border-b border-stone-100 pb-2.5 mb-1.5">
              <User className="w-4 h-4 text-pink-500" /> ตั้งค่าข้อมูลโปรไฟล์
            </h3>
            
            <form onSubmit={handleSaveProfile} className="flex-1 flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-[11px] font-black text-stone-600 mb-1">ลิงก์ส่วนตัว (Username)</label>
                  <div className="flex rounded-lg overflow-hidden border border-stone-250 focus-within:border-pink-500 transition-all">
                    <span className="bg-stone-50 border-r border-stone-200 px-3 py-2 text-[10px] font-extrabold opacity-60 flex items-center shrink-0 select-none">
                      siamlink.me/
                    </span>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="ชื่อร้านหรือแบรนด์ของคุณ"
                      className="w-full px-3 py-2 bg-white text-xs focus:outline-hidden text-[#3e2723] font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-stone-600 mb-1">ชื่อร้าน / ชื่อแสดง (Display Name)</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="เช่น ส้มโอครีเอเตอร์, สมชายกาแฟโบราณ"
                    className="w-full px-3 py-2.5 bg-white border border-stone-250 rounded-lg text-xs font-bold focus:outline-hidden focus:border-pink-500 text-[#3e2723] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-stone-600 mb-1">รูปโปรไฟล์ (Avatar Image URL)</label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={e => setAvatarUrl(e.target.value)}
                    placeholder="ลิงก์รูปโปรไฟล์ของคุณ"
                    className="w-full px-3 py-2.5 bg-white border border-stone-250 rounded-lg text-xs font-bold focus:outline-hidden focus:border-pink-500 text-[#3e2723] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-stone-600 mb-1">ข้อความแนะนำร้าน (Bio)</label>
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="อธิบายตัวคุณหรือร้านค้าสั้นๆ 1-2 ประโยค"
                    rows={2}
                    className="w-full px-3 py-2.5 bg-white border border-stone-250 rounded-lg text-xs font-bold focus:outline-hidden focus:border-pink-500 text-[#3e2723] transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-stone-600 mb-1">ธีมตกแต่งร้าน (Theme Presets)</label>
                  <select
                    value={theme}
                    onChange={e => setTheme(e.target.value as ThemeName)}
                    className="w-full px-3 py-2.5 bg-white border border-stone-250 rounded-lg text-xs focus:outline-hidden focus:border-pink-500 text-[#3e2723] cursor-pointer transition-all font-bold"
                  >
                    <optgroup label="🆓 ธีมฟรี (Free Themes)" className="font-extrabold text-[10px]">
                      {Object.values(THEMES).filter(t => !t.isPro).map(t => (
                        <option key={t.name} value={t.name} className="font-bold text-xs">{t.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🔒 ธีมพรีเมียม (Pro Themes — 10 แบบ)" className="font-extrabold text-[10px]">
                      {Object.values(THEMES).filter(t => t.isPro).map(t => (
                        <option key={t.name} value={t.name} className="font-bold text-xs">🔒 {t.label}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Watermark toggle premium config item */}
                <div className="pt-2.5 border-t border-stone-100">
                  <div className="flex items-center justify-between bg-stone-50/70 p-2.5 rounded-lg border border-stone-200">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-black flex items-center gap-1 text-stone-850">
                        ลบลายน้ำท้ายเว็บ 
                        <span className="text-[8px] font-black bg-pink-100 text-pink-650 px-1.5 py-0.5 rounded-full uppercase">🔒 PRO</span>
                      </span>
                      <span className="text-[10px] opacity-85 text-stone-500 font-semibold">ซ่อนลิงก์เครดิต SiamLink</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={removeWatermark}
                        onChange={(e) => handleWatermarkToggle(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-10 h-5.5 bg-stone-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                  </div>
                </div>

                {profileMessage && (
                  <div className={`p-3.5 rounded-xl text-xs font-black border ${
                    profileMessage.type === 'success' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-250' 
                      : 'bg-rose-50 text-rose-700 border-rose-250'
                  }`}>
                    {profileMessage.text}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={saveProfileLoading}
                className="w-full bg-[#3e2723] hover:bg-[#54352f] text-white hover:opacity-95 font-black py-3 px-5 rounded-xl transition-all cursor-pointer disabled:opacity-50 text-xs md:text-sm flex items-center justify-center gap-1.5 shadow-md hover:scale-102 mt-6"
              >
                <Settings className="w-4 h-4 animate-pulse" />
                {saveProfileLoading ? 'กำลังบันทึกข้อมูล...' : 'บันทึกการตั้งค่าทั้งหมด'}
              </button>
            </form>
          </div>
        </section>

        {/* COLUMN 2: Links CRUD & Sorting Manager (lg:col-span-6 xl:col-span-6) */}
        <section className="lg:col-span-6 xl:col-span-6 flex flex-col gap-5">
          <div className="bg-white border border-[#e4dfd5] rounded-3xl p-4.5 xl:p-5 shadow-xs flex flex-col gap-3.5">
            <h3 className="text-sm font-black uppercase tracking-wider text-stone-750 flex items-center gap-2 border-b border-stone-100 pb-2 mb-1">
              <Plus className="w-4 h-4 text-pink-500" /> เพิ่มลิงก์และช่องทางการติดต่อ
            </h3>

            {/* Free limitation banner warning */}
            {links.length >= 5 && profile?.plan !== 'pro' && (
              <div className="p-3 bg-amber-50 text-amber-900 rounded-xl text-xs font-black border border-amber-250 flex items-start gap-2.5 animate-fade-in shadow-3xs">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <p className="font-black text-xs text-amber-950">💡 โควต้าลิงก์ฟรีครบ 5 รายการแล้ว</p>
                  <p className="font-bold text-[10px] opacity-90 mt-0.5 leading-relaxed">อัปเกรดเป็น PRO เพื่อเพิ่มได้ไม่จำกัดและปลดล็อกฟีเจอร์พรีเมียมอื่นๆ!</p>
                </div>
              </div>
            )}

            <form onSubmit={handleAddLink} className="flex flex-col gap-3">
              {/* Type Switcher grid (Compact) */}
              <div className="grid grid-cols-2 gap-1.5 bg-stone-50 p-1 rounded-xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => { setNewType('link'); setIsNewVideoEmbed(false); setLinksMessage(null); }}
                  className={`py-1.5 px-2 text-[10px] font-black rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    newType === 'link' && !isNewVideoEmbed
                      ? 'bg-white shadow-3xs text-[#3e2723]' 
                      : 'text-stone-400 hover:text-[#3e2723]'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" /> ทั่วไป
                </button>
                
                <button
                  type="button"
                  onClick={() => { setNewType('line'); setIsNewVideoEmbed(false); setLinksMessage(null); }}
                  className={`py-1.5 px-2 text-[10px] font-black rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    newType === 'line' 
                      ? 'bg-emerald-50 text-emerald-600 shadow-3xs' 
                      : 'text-stone-400 hover:text-[#3e2723]'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" /> ไลน์
                </button>

                <button
                  type="button"
                  onClick={() => { setNewType('bank'); setIsNewVideoEmbed(false); setLinksMessage(null); }}
                  className={`py-1.5 px-2 text-[10px] font-black rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    newType === 'bank' 
                      ? 'bg-indigo-50 text-indigo-600 shadow-3xs' 
                      : 'text-stone-400 hover:text-[#3e2723]'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" /> บัญชีธนาคาร
                </button>

                <button
                  type="button"
                  onClick={handleSelectVideoType}
                  className={`py-1.5 px-2 text-[10px] font-black rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    isNewVideoEmbed
                      ? 'bg-amber-50 text-amber-700 shadow-3xs'
                      : 'text-stone-400 hover:text-[#3e2723]'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-amber-700" /> วิดีโอ
                </button>
              </div>

              {/* Input Forms matching type */}
              <div>
                <label className="block text-[10px] font-black text-stone-600 mb-1">
                  {newType === 'bank' ? 'ชื่อเจ้าของบัญชี (Account Name)' : 'ข้อความบนปุ่ม (Title)'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder={
                    newType === 'bank' 
                      ? 'เช่น นายสมศักดิ์ รักดี, ร้านส้มโอคอฟฟี่' 
                      : isNewVideoEmbed 
                        ? 'เช่น รีวิวสินค้าจากลูกค้า, แนะนำแบรนด์' 
                        : newType === 'line' 
                          ? 'เช่น แอดไลน์ติดต่อ/สั่งซื้อ' 
                          : 'เช่น สั่งซื้อผ่าน Shopee คืนเงิน 10%'
                  }
                  className="w-full px-3 py-2 bg-white border border-stone-250 rounded-lg text-xs font-bold focus:outline-hidden focus:border-pink-500 text-[#3e2723] transition-all"
                />
              </div>

              {newType === 'bank' ? (
                <div className="flex flex-col gap-2.5">
                  <div>
                    <label className="block text-[10px] font-black text-stone-600 mb-1">เลือกธนาคาร (Bank List)</label>
                    <select
                      value={newBankName}
                      onChange={(e) => setNewBankName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-250 rounded-lg text-xs focus:outline-hidden focus:border-pink-500 text-[#3e2723] cursor-pointer transition-all font-bold"
                    >
                      <option value="">-- กรุณาเลือกบัญชีธนาคาร --</option>
                      <option value="กสิกรไทย">กสิกรไทย (KBANK) 🟢</option>
                      <option value="ไทยพาณิชย์">ไทยพาณิชย์ (SCB) 🟣</option>
                      <option value="พร้อมเพย์">พร้อมเพย์ (PromptPay) 🔵</option>
                      <option value="กรุงเทพ">กรุงเทพ (BBL) 🔷</option>
                      <option value="กรุงศรี">กรุงศรีอยุธยา (BAY) 🟡</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-stone-600 mb-1">เลขที่บัญชีโอนเงิน (Account Number)</label>
                    <input
                      type="text"
                      required
                      value={newBankNumber}
                      onChange={e => setNewBankNumber(e.target.value)}
                      placeholder="เช่น 123-4-56789-0"
                      className="w-full px-3 py-2 bg-white border border-stone-250 rounded-lg text-xs font-bold focus:outline-hidden focus:border-pink-500 text-[#3e2723] transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] font-black text-stone-600 mb-1">
                    {newType === 'line' 
                      ? 'ลิงก์หรือไอดี LINE' 
                      : isNewVideoEmbed 
                        ? 'ลิงก์วิดีโอ YouTube หรือ TikTok' 
                        : 'ลิงก์ปลายทาง (URL)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newUrl}
                    onChange={e => setNewUrl(e.target.value)}
                    placeholder={
                      newType === 'line' 
                        ? 'เช่น https://line.me/ti/p/~username หรือไอดี LINE' 
                        : isNewVideoEmbed 
                          ? 'เช่น https://www.youtube.com/watch?v=xxxx หรือ TikTok URL' 
                          : 'เช่น https://shopee.co.th/product-url'
                    }
                    className="w-full px-3 py-2 bg-white border border-stone-250 rounded-lg text-xs font-bold focus:outline-hidden focus:border-pink-500 text-[#3e2723] transition-all"
                  />
                  {newType === 'line' && (
                    <p className="text-[9px] text-emerald-600 font-bold mt-1">
                      💡 ปลายทาง LINE จะถูกเพิ่มระบบนำทางอัตโนมัติ เพื่อป้องกันแชทหลุดจากการเปิดในแอปอื่น!
                    </p>
                  )}
                </div>
              )}

              {/* Toggle "ขยับปุ่มเพื่อเรียกสายตา 🔒" */}
              <div className="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-200 rounded-xl mt-1">
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-[#3e2723] flex items-center gap-1">
                    ขยับปุ่มเพื่อเรียกสายตา 🔒
                  </span>
                  <span className="text-[9px] text-stone-400 font-bold">
                    ทำให้ปุ่มนี้ขยับเพื่อดึงดูดสายตาของผู้เยี่ยมชม (เฉพาะ PRO เท่านั้น)
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isNewAnimated}
                    onChange={(e) => handleAnimatedCheckbox(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-stone-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={addLinkLoading}
                className="w-full bg-[#3e2723] hover:bg-[#54352f] text-white font-black py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer disabled:opacity-50 hover:scale-102 flex items-center justify-center gap-1.5 shadow-md mt-1"
              >
                {addLinkLoading ? (
                  <span>กำลังบันทึก...</span>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    เพิ่มลิงก์ใหม่ ⚡
                  </>
                )}
              </button>

              {linksMessage && (
                <div className={`p-2.5 rounded-lg text-xs font-black text-center ${
                  linksMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {linksMessage.text}
                </div>
              )}
            </form>

            {/* Links List Manager & Sorting Controls (Dense & Compact) */}
            <div className="mt-3 border-t border-stone-100 pt-3 flex flex-col gap-2.5">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-stone-750">
                ช่องทางทั้งหมดของคุณ ({links.length})
              </h3>

              {links.length === 0 ? (
                <div className="text-center py-5 opacity-65 text-xs border border-dashed border-stone-250 rounded-xl flex flex-col items-center justify-center gap-1">
                  <LinkIcon className="w-4 h-4 text-stone-400" />
                  คุณยังไม่ได้เริ่มตั้งลิงก์เลย ลองใช้แบบฟอร์มด้านบนเพิ่มลิงก์แรกได้เลย!
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {links.map((link, index) => {
                    const hasAnimBadge = link.url?.includes('#animated=true') || (link.type === 'bank' && link.url === '#animated=true');
                    const cleanDisplayUrl = link.url ? link.url.replace('#animated=true', '').replace('#video_embed=true', '') : '';
                    const ytId = getYoutubeId(cleanDisplayUrl);
                    const ttId = getTikTokId(cleanDisplayUrl);
                    const hasVideoBadge = link.url?.includes('#video_embed=true') || ytId !== null || ttId !== null;
                    
                    return (
                      <div 
                        key={link.id} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-2 bg-stone-50 border border-stone-200 rounded-lg gap-2 transition-all shadow-3xs"
                      >
                        <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
                          <div className={`p-1.5 rounded-md flex items-center justify-center shrink-0 ${
                            link.type === 'line' 
                              ? 'bg-emerald-50 text-emerald-600 shadow-3xs' 
                              : link.type === 'bank' 
                                ? 'bg-indigo-50 text-indigo-600 shadow-3xs' 
                                : 'bg-stone-200/50 text-[#3e2723] shadow-3xs'
                          }`}>
                            {link.type === 'line' ? (
                              <MessageCircle className="w-3.5 h-3.5 fill-emerald-650 text-emerald-50" />
                            ) : link.type === 'bank' ? (
                              <CreditCard className="w-3.5 h-3.5" />
                            ) : hasVideoBadge ? (
                              <Video className="w-3.5 h-3.5 text-amber-700" />
                            ) : (
                              <LinkIcon className="w-3.5 h-3.5" />
                            )}
                          </div>

                          <div className="overflow-hidden flex flex-col flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                              <h4 className="font-bold text-[11px] text-[#3e2723] truncate min-w-0 flex-1">{link.title}</h4>
                              
                              {/* Small premium detail badges */}
                              {hasAnimBadge && (
                                <span className="text-[7px] bg-pink-100 text-pink-650 px-1 py-0.25 rounded font-black shrink-0 tracking-wide">✨ ขยับ</span>
                              )}
                              {hasVideoBadge && (
                                <span className="text-[7px] bg-amber-100 text-amber-750 px-1 py-0.25 rounded font-black shrink-0 tracking-wide">🎥 ฝัง</span>
                              )}
                            </div>
                            
                            {link.type === 'bank' ? (
                              <div className="flex items-center gap-1.5 mt-0.25 min-w-0">
                                <span className="text-[9px] font-mono font-extrabold text-stone-500 truncate min-w-0">{link.bank_number}</span>
                                <span className="text-[8px] px-1 py-0.25 bg-stone-200 text-stone-700 font-extrabold rounded shrink-0">{link.bank_name}</span>
                              </div>
                            ) : (
                              <p className="text-[9px] text-stone-450 truncate min-w-0 mt-0.25 font-mono">{cleanDisplayUrl}</p>
                            )}
                          </div>
                        </div>

                        {/* Sorting & Action Buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveLink(index, 'up')}
                            disabled={index === 0}
                            className="p-1 border border-stone-200 hover:bg-stone-100 text-stone-500 disabled:opacity-30 rounded-md cursor-pointer transition-colors"
                            title="เลื่อนขึ้น"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveLink(index, 'down')}
                            disabled={index === links.length - 1}
                            className="p-1 border border-stone-200 hover:bg-stone-100 text-stone-500 disabled:opacity-30 rounded-md cursor-pointer transition-colors"
                            title="เลื่อนลง"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteLink(link.id)}
                            className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-md cursor-pointer transition-colors"
                            title="ลบลิงก์"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* COLUMN 3: Real-Time Interactive Live Mobile Preview Mockup (lg:col-span-12 xl:col-span-3) */}
        <section className="lg:col-span-12 xl:col-span-3 flex flex-col gap-4">
          <div className="bg-white border border-[#e4dfd5] rounded-3xl p-4.5 xl:p-6 shadow-xs flex flex-col items-center xl:sticky xl:top-24 w-full">
            <h3 className="text-sm font-black uppercase tracking-wider text-stone-750 flex items-center gap-2 border-b border-stone-100 pb-3 w-full justify-center mb-4.5">
              <Eye className="w-4 h-4 text-pink-500 animate-pulse" /> พรีวิวการแสดงผลสด (Live Simulator)
            </h3>

            {/* Smart Phone Container Bobbing Frame (Sleeker & Compact) */}
            <div className="relative border-[10px] border-stone-800 rounded-[3.25rem] h-[780px] xl:h-[820px] w-[285px] xl:w-[305px] bg-stone-100 shadow-2xl overflow-hidden flex flex-col animate-bobbing shrink-0">
              {/* Dynamic Camera Slit / Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-4 w-28 bg-stone-800 rounded-b-2xl z-50 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-stone-900 rounded-full border border-stone-850" />
              </div>

              {/* Reactive Theme Background Container */}
              <div className={`flex-1 overflow-y-auto px-5 py-10 flex flex-col items-center justify-between relative scrollbar-none ${activeThemeConfig.bgClass}`}>
                
                {/* Simulated Content Area */}
                <div className="w-full flex flex-col items-center gap-4.5 mt-4">
                  {/* User Avatar (Compact) */}
                  <div className="relative">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt="Avatar Mockup"
                        className="w-20 h-20 rounded-full object-cover border-2 border-white/60 shadow-md"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-stone-300 dark:bg-stone-850 flex items-center justify-center text-stone-500 font-bold border-2 border-white/60 shadow-md text-2xl">
                        {displayName.charAt(0) || username.charAt(0) || 'S'}
                      </div>
                    )}
                  </div>

                  {/* Username Display Header (Compact) */}
                  <div className="text-center w-full px-2">
                    <h2 className={`font-black text-sm md:text-base leading-tight ${activeThemeConfig.textClass}`}>
                      {displayName || `@${username || 'yourname'}`}
                    </h2>
                    {bio && (
                      <p className={`text-xs font-bold mt-1.5 max-w-[200px] mx-auto opacity-75 leading-relaxed ${activeThemeConfig.textMutedClass}`}>
                        {bio}
                      </p>
                    )}
                  </div>

                  {/* Interactive Dynamic Links Renderer */}
                  <div className="w-full flex flex-col gap-3">
                    {(() => {
                      const showDraft = newTitle.trim() !== '' || newUrl.trim() !== '' || newBankNumber.trim() !== '' || isNewAnimated || isNewVideoEmbed;
                      
                      const draftLink = showDraft ? {
                        id: 'draft',
                        title: newTitle.trim() || (newType === 'bank' ? 'ชื่อบัญชีจำลองของคุณ' : '✨ หัวข้อปุ่มจำลองของคุณ'),
                        type: isNewVideoEmbed ? 'video' : newType,
                        url: newUrl.trim() || '#',
                        bank_number: newBankNumber.trim() || '123-4-56789-0',
                        bank_name: newBankName.trim() || 'พร้อมเพย์',
                        is_highlighted: isNewAnimated,
                        isDraft: true,
                      } : null;

                      const simulatorLinks = draftLink ? [draftLink, ...links] : links;

                      if (simulatorLinks.length === 0) {
                        return (
                          <div className="text-center py-6 opacity-45 text-xs italic">
                            ยังไม่มีลิงก์จำลอง
                          </div>
                        );
                      }

                      return simulatorLinks.map((link) => {
                        const urlHash = link.url?.split('#')[1] || '';
                        const isAnimated = link.is_highlighted || 
                                           urlHash.includes('animated=true') || 
                                           urlHash.includes('is_highlighted=true') || 
                                           (link.type === 'bank' && (link.url === '#animated=true' || link.url === '#is_highlighted=true'));
                        
                        // Always animate in simulator to let Free users experience Pro features
                        const animClass = isAnimated ? 'animate-wiggle animate-elegant-pulse ring-2 ring-pink-400 shadow-md' : '';
                        
                        const cleanUrl = link.url 
                          ? link.url
                              .replace(/#(animated=true|is_highlighted=true|video_embed=true|type=video)/g, '')
                              .replace(/&?(animated=true|is_highlighted=true|video_embed=true|type=video)/g, '')
                              .replace(/[#&]$/, '')
                              .replace(/#&/, '#')
                          : '#';
                        const ytId = getYoutubeId(cleanUrl);
                        const ttId = getTikTokId(cleanUrl);
                        const isVideoEmbed = link.type === 'video';

                        // A. VIDEO EMBED COMPONENT PREVIEW
                        if (isVideoEmbed) {
                          if (ytId) {
                            return (
                              <div 
                                key={link.id} 
                                className={`w-full flex flex-col gap-1 p-1 bg-white/40 border border-stone-200/50 rounded-xl transition-all ${animClass} ${link.isDraft ? 'border-2 border-dashed border-pink-400 relative' : ''}`}
                              >
                                {link.isDraft && (
                                  <div className="absolute -top-2.5 -right-2 bg-pink-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-md z-10 animate-bounce">
                                    ✨ ตัวอย่างร่าง Pro
                                  </div>
                                )}
                                <div className="w-full aspect-video rounded-lg overflow-hidden shadow-xs">
                                  <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${ytId}`}
                                    title={link.title || "YouTube video"}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                  ></iframe>
                                </div>
                                {link.title && (
                                  <p className={`text-[9px] font-bold text-center opacity-70 py-0.5 ${activeThemeConfig.textClass}`}>{link.title}</p>
                                )}
                              </div>
                            );
                          }

                          if (ttId) {
                            return (
                              <div 
                                key={link.id} 
                                className={`w-full flex flex-col gap-1 p-1 bg-white/40 border border-stone-200/50 rounded-xl transition-all ${animClass} ${link.isDraft ? 'border-2 border-dashed border-pink-400 relative' : ''}`}
                              >
                                {link.isDraft && (
                                  <div className="absolute -top-2.5 -right-2 bg-pink-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-md z-10 animate-bounce">
                                    ✨ ตัวอย่างร่าง Pro
                                  </div>
                                )}
                                <div className="w-full aspect-[9/16] max-h-[220px] rounded-lg overflow-hidden shadow-xs mx-auto">
                                  <iframe
                                    className="w-full h-full"
                                    src={`https://www.tiktok.com/embed/v2/${ttId}`}
                                    allowFullScreen
                                    frameBorder="0"
                                  ></iframe>
                                </div>
                                {link.title && (
                                  <p className={`text-[9px] font-bold text-center opacity-70 py-0.5 ${activeThemeConfig.textClass}`}>{link.title}</p>
                                )}
                              </div>
                            );
                          }

                          // Render a beautiful interactive placeholder if they are typing but haven't entered a valid YouTube/TikTok url yet
                          return (
                            <div 
                              key={link.id} 
                              className={`w-full flex flex-col gap-1 p-3 bg-white/40 border border-stone-200/50 rounded-xl transition-all ${animClass} ${link.isDraft ? 'border-2 border-dashed border-pink-400 relative' : ''}`}
                            >
                              {link.isDraft && (
                                <div className="absolute -top-2.5 -right-2 bg-pink-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-md z-10 animate-bounce">
                                  ✨ ตัวอย่างร่าง Pro
                                </div>
                              )}
                              <div className="w-full aspect-video rounded-lg bg-stone-850 flex flex-col items-center justify-center text-center p-3 text-white shadow-xs">
                                <Video className="w-6 h-6 text-pink-400 animate-pulse mb-1" />
                                <p className="text-[9px] font-black">เครื่องเล่นวิดีโอ SiamLink Pro 🎥</p>
                                <p className="text-[7px] opacity-75 mt-0.5">กรอกลิงก์ YouTube/TikTok ทางซ้ายเพื่อดูสด</p>
                              </div>
                              {link.title && (
                                <p className={`text-[9px] font-bold text-center opacity-70 py-0.5 ${activeThemeConfig.textClass}`}>{link.title}</p>
                              )}
                            </div>
                          );
                        }

                        // B. BANK DETAILS PREVIEW (Compact & Clean spacing)
                        if (link.type === 'bank') {
                          const isCopied = simulatorCopiedId === link.id;
                          return (
                            <button
                              type="button"
                              key={link.id}
                              onClick={() => handleSimulateCopyBank(link.id, link.bank_number || '')}
                              className={`w-full border border-stone-200 p-2.5 rounded-lg flex items-center justify-between text-left cursor-pointer transition-all shadow-3xs bg-white text-stone-900 ${animClass} ${link.isDraft ? 'border-2 border-dashed border-pink-400 relative' : ''}`}
                            >
                              {link.isDraft && (
                                <div className="absolute -top-2.5 -right-2 bg-pink-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-md z-10 animate-bounce">
                                  ✨ ตัวอย่างร่าง Pro
                                </div>
                              )}
                              <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
                                <span className="text-xs shrink-0">💳</span>
                                <div className="overflow-hidden flex-1 min-w-0">
                                  <h4 className="font-bold text-[10px] leading-tight text-stone-900 truncate">{link.title}</h4>
                                  <div className="flex items-center gap-1 mt-0.5 flex-wrap min-w-0">
                                    <span className="text-[9px] font-mono font-bold text-stone-600 truncate min-w-0">{link.bank_number}</span>
                                    <span className="text-[7px] font-black px-1.5 py-0.25 bg-indigo-100 text-indigo-700 rounded shrink-0 uppercase tracking-wide">
                                      {link.bank_name || 'ธนาคาร'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="shrink-0 p-1 bg-stone-50 border border-stone-200 rounded-md text-[8px] font-black">
                                {isCopied ? (
                                  <span className="text-emerald-600 font-black flex items-center gap-0.5">คัดลอกสำเร็จ! ✨</span>
                                ) : (
                                  <span className="text-stone-500 flex items-center gap-0.5">คัดลอกเลขบัญชี</span>
                                )}
                              </div>
                            </button>
                          );
                        }

                        // C. LINE CONVERSATION COMPONENT PREVIEW (Compact & Clean spacing)
                        if (link.type === 'line') {
                          return (
                            <div
                              key={link.id}
                              className={`flex items-center justify-between w-full p-2.5 transition-all cursor-pointer ${activeThemeConfig.cardClass} ${animClass} ${link.isDraft ? 'border-2 border-dashed border-pink-400 relative' : ''}`}
                            >
                              {link.isDraft && (
                                <div className="absolute -top-2.5 -right-2 bg-pink-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-md z-10 animate-bounce">
                                  ✨ ตัวอย่างร่าง Pro
                                </div>
                              )}
                              <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
                                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                                  <MessageCircle className="w-3.5 h-3.5 fill-emerald-650 text-emerald-50" />
                                </div>
                                <div className="overflow-hidden flex-1 min-w-0">
                                  <h4 className="font-bold text-[10px] leading-tight truncate">{link.title}</h4>
                                  <p className="text-[8px] opacity-60 mt-0.5 truncate">แชทติดต่อ LINE</p>
                                </div>
                              </div>
                              <span className="text-xs opacity-40 shrink-0 font-bold ml-1">💬</span>
                            </div>
                          );
                        }

                        // D. STANDARD LINK PREVIEW (Compact & Clean spacing)
                        return (
                          <div
                            key={link.id}
                            className={`flex items-center justify-between w-full p-2.5 transition-all cursor-pointer ${activeThemeConfig.cardClass} ${animClass} ${link.isDraft ? 'border-2 border-dashed border-pink-400 relative' : ''}`}
                          >
                            {link.isDraft && (
                              <div className="absolute -top-2.5 -right-2 bg-pink-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-md z-10 animate-bounce">
                                ✨ ตัวอย่างร่าง Pro
                              </div>
                            )}
                            <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
                              <div className="p-1.5 bg-stone-100 rounded-lg shrink-0">
                                  <ExternalLink className="w-3.5 h-3.5 opacity-65" />
                              </div>
                              <div className="overflow-hidden flex-1 min-w-0">
                                  <h4 className="font-bold text-[10px] leading-tight truncate">{link.title}</h4>
                                  <p className="text-[8px] opacity-50 mt-0.5 truncate">{link.url?.replace(/https?:\/\/(www\.)?/, '')}</p>
                              </div>
                            </div>
                            <span className="text-xs opacity-30 shrink-0 font-bold ml-1">🔗</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Dynamic Footer Watermark Component */}
                {!removeWatermark && (
                  <div className="w-full text-center mt-4">
                    <p className={`text-[9px] font-black uppercase tracking-wider select-none ${activeThemeConfig.textMutedClass} opacity-60`}>
                      สร้างลิงก์ของคุณฟรีด้วย SiamLink
                    </p>
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-stone-400 mt-4 text-center px-4 leading-relaxed">
              💡 แนะนำ: ทดลองกดจำลองการทำงาน เช่น "คัดลอกเลขบัญชี" เพื่อทดสอบระบบได้ทันที!
            </p>
          </div>
        </section>

      </main>

      {/* Elegant glassmorphism Premium Upsell Popup Modal (🔒 PRO ONLY) */}
      {showUpsellModal && (
        <div className="fixed inset-0 z-50 bg-[#3e2723]/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white border border-[#e4dfd5] rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6 text-[#3e2723] animate-scale-up">
            
            {/* Top aesthetic stripe */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />
            
            {/* Close trigger button */}
            <button 
              onClick={() => setShowUpsellModal(false)}
              className="absolute top-5 right-5 p-2 hover:bg-stone-100 rounded-full transition-colors cursor-pointer text-stone-400 hover:text-stone-750"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Icon Header */}
            <div className="flex flex-col items-center text-center mt-2">
              <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-4 shadow-3xs">
                <Lock className="w-8 h-8 text-pink-600" />
              </div>
              <h2 className="text-2xl font-black bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent">
                ปลดล็อกคุณสมบัติ SiamLink Pro 👑
              </h2>
              <p className="text-sm text-stone-400 font-bold mt-2">
                เพื่อรับสิทธิ์เปิดใช้งานฟีเจอร์พรีเมียมทั้งหมดสำหรับครีเอเตอร์
              </p>
            </div>

            {/* Intercept detail box */}
            <div className="p-4 bg-pink-50/50 border border-pink-150 rounded-2xl flex items-start gap-3 shadow-3xs">
              <ShieldAlert className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
              <div className="text-sm text-[#3e2723] leading-relaxed">
                <p className="font-extrabold text-pink-900">ระบบล็อกฟีเจอร์พรีเมียมเนื่องจากบัญชีเป็นแบบฟรี</p>
                <p className="font-bold opacity-80 mt-1">
                  ฟีเจอร์ที่คุณพยายามเข้าถึง: <span className="underline text-pink-600 font-extrabold">{upsellReason}</span>
                </p>
              </div>
            </div>

            {/* List of Pro Features */}
            <div className="flex flex-col gap-3.5 text-sm font-extrabold border-y border-stone-150 py-5">
              <div className="flex items-center gap-2.5">
                <span className="text-emerald-500 font-black text-lg">✓</span>
                <span>ลบลายน้ำท้ายเว็บ: ซ่อนเครดิต "สร้างลิงก์ของคุณฟรีด้วย SiamLink"</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-emerald-500 font-black text-lg">✓</span>
                <span>ธีมตกแต่งพรีเมียม 10 แบบ: Sakura Sweet, Matcha Green, Cyber Neon, Luxury Gold ฯลฯ</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-emerald-500 font-black text-lg">✓</span>
                <span>ปุ่มขยับเรียกร้องสายตา: ดึงดูดนิ้วมือผู้ชมและเพิ่มยอดคลิกได้มากกว่าเดิม 3 เท่า</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-emerald-500 font-black text-lg">✓</span>
                <span>ฝังวิดีโอ YouTube / TikTok: ให้ลูกค้าเปิดดูคลิปรีวิวสินค้าบนหน้าโปรไฟล์ของคุณสดๆ</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-emerald-500 font-black text-lg">✓</span>
                <span>ลิงก์ไม่จำกัดจำนวน: เพิ่มขยายช่องทางติดต่อเพื่อสร้างรายได้โดยไม่มีขีดจำกัด 5 ข้อ</span>
              </div>
            </div>

            {/* Actions & Price */}
            <div className="flex flex-col gap-3">
              <div className="text-center py-1">
                <p className="text-sm font-bold text-stone-500">สมัครวันนี้เพียง</p>
                <p className="text-3xl font-black text-pink-600 mt-1">
                  129 บ. <span className="text-base font-bold text-stone-400">/ เดือน</span>
                </p>
              </div>

              {/* Local sandbox testing one-click action */}
              <button
                onClick={() => { setShowUpsellModal(false); setShowCheckoutModal(true); }}
                className="w-full bg-gradient-to-r from-pink-600 to-indigo-600 text-white font-black py-4 px-6 rounded-xl hover:opacity-95 cursor-pointer shadow-md text-sm flex items-center justify-center gap-2 transition-all hover:scale-101"
              >
                <Sparkles className="w-5 h-5 animate-pulse" />
                อัปเกรดเป็น SiamLink Pro ทันที 👑
              </button>

              <button
                onClick={() => setShowUpsellModal(false)}
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold py-2.5 rounded-xl text-xs md:text-sm transition-all cursor-pointer"
              >
                ย้อนกลับ (ทดลองใช้ต่อ)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Premium Stripe Checkout Modal */}
      {showCheckoutModal && profile && (
        <div className="fixed inset-0 z-50 bg-[#3e2723]/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white border border-[#e4dfd5] rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col gap-5 text-[#3e2723] animate-scale-up">
            
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />
            
            {/* Close button */}
            <button 
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-full transition-colors cursor-pointer text-stone-400 hover:text-stone-750"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center mt-2">
              <h3 className="text-xl font-black bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent flex items-center justify-center gap-1.5">
                อัปเกรดเป็น SiamLink Pro 👑
              </h3>
              <p className="text-xs text-stone-450 font-bold mt-1">
                เริ่มต้นใช้งานฟีเจอร์ระดับโปรอย่างเป็นทางการ
              </p>
            </div>

            {/* Price Description details card */}
            <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col items-center gap-1 shadow-3xs">
              <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider">แพ็กเกจรายเดือน (Monthly Subscription)</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-black text-pink-600">129 บ.</span>
                <span className="text-xs font-bold text-stone-400">/ เดือน</span>
              </div>
              <p className="text-[11px] text-stone-500 font-bold text-center mt-2 leading-relaxed">
                หักค่าบริการอัตโนมัติรายเดือน ยกเลิกได้ตลอดเวลา ไม่มีข้อผูกมัด
              </p>
            </div>

            {/* Feature short list */}
            <div className="flex flex-col gap-2.5 text-xs font-extrabold border-y border-stone-100 py-4 px-2">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 text-sm">✓</span>
                <span>ลบลายน้ำท้ายเว็บ SiamLink</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 text-sm">✓</span>
                <span>ฝังวิดีโอ YouTube และ TikTok ไม่จำกัด</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 text-sm">✓</span>
                <span>ขยับปุ่มเรียกสายตา (Attention Grabber)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 text-sm">✓</span>
                <span>ปลดล็อกธีมตกแต่งพิเศษ 10 แบบ</span>
              </div>
            </div>

            {/* Actual Stripe checkout trigger button integration */}
            <CheckoutButton 
              profileId={profile.id} 
              onError={(msg) => alert(msg)}
            />

          </div>
        </div>
      )}
    </div>
  );
}
