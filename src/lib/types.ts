// Type definitions for SiamLink

export type ThemeName = 
  | 'cafe_minimal' 
  | 'clean_light' 
  | 'soft_slate' 
  | 'sand_dune' 
  | 'midnight_ink'
  | 'pastel_pink' 
  | 'matcha_green' 
  | 'lavender_dream' 
  | 'lemon_tart' 
  | 'ocean_breeze' 
  | 'cyber_neon' 
  | 'luxury_gold';

export type LinkType = 'link' | 'bank' | 'line' | 'video';

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  theme: ThemeName;
  plan: 'free' | 'pro';
  created_at: string;
}

export interface LinkItem {
  id: string;
  profile_id: string;
  type: LinkType;
  title: string;
  url: string | null;
  bank_number: string | null;
  bank_name: string | null;
  sort_order: number;
  created_at: string;
  is_highlighted?: boolean;
  isDraft?: boolean;
}

export interface ClickLog {
  id: string;
  link_id: string;
  clicked_at: string;
}

export interface ThemeConfig {
  name: ThemeName;
  label: string;
  isPro: boolean;
  bgClass: string;
  containerClass: string;
  cardClass: string;
  textClass: string;
  textMutedClass: string;
  accentClass: string;
  primaryButtonClass: string;
}

export const THEMES: Record<ThemeName, ThemeConfig> = {
  // 🆓 FREE TIER THEMES
  cafe_minimal: {
    name: 'cafe_minimal',
    label: '☕ คาเฟ่มินิมอล (Cafe Minimal)',
    isPro: false,
    bgClass: 'bg-[#fdfbf7] text-[#3e2723]',
    containerClass: 'max-w-md mx-auto min-h-screen px-6 py-12 flex flex-col items-center justify-between',
    cardClass: 'w-full bg-[#f5ebe0] border border-[#d5bdaf] rounded-xl p-4 hover:bg-[#ebd5c7] transition-all duration-300 transform hover:-translate-y-0.5',
    textClass: 'text-[#3e2723]',
    textMutedClass: 'text-[#7f5539]',
    accentClass: 'text-[#8f7663]',
    primaryButtonClass: 'w-full bg-[#8f7663] text-white font-medium py-3.5 px-6 rounded-xl transition-all duration-300 shadow-xs',
  },
  clean_light: {
    name: 'clean_light',
    label: '✨ คลีนไวท์ (Clean Light)',
    isPro: false,
    bgClass: 'bg-[#ffffff] text-[#1f2937]',
    containerClass: 'max-w-md mx-auto min-h-screen px-6 py-12 flex flex-col items-center justify-between',
    cardClass: 'w-full bg-white border border-[#e5e7eb] rounded-2xl p-4 shadow-xs hover:shadow-sm transition-all duration-300 transform hover:-translate-y-0.5',
    textClass: 'text-[#1f2937]',
    textMutedClass: 'text-[#4b5563]',
    accentClass: 'text-[#111827]',
    primaryButtonClass: 'w-full bg-[#111827] hover:bg-[#1f2937] text-white font-medium py-3.5 px-6 rounded-2xl transition-all duration-300 shadow-xs',
  },
  soft_slate: {
    name: 'soft_slate',
    label: '💻 ซอฟต์สเลท (Soft Slate)',
    isPro: true,
    bgClass: 'bg-[#f4f4f5] text-[#18181b]',
    containerClass: 'max-w-md mx-auto min-h-screen px-6 py-12 flex flex-col items-center justify-between',
    cardClass: 'w-full bg-[#e4e4e7] border border-[#d4d4d8] rounded-2xl p-4 hover:bg-[#d4d4d8] transition-all duration-300 transform hover:-translate-y-0.5',
    textClass: 'text-[#18181b]',
    textMutedClass: 'text-[#71717a]',
    accentClass: 'text-[#09090b]',
    primaryButtonClass: 'w-full bg-[#09090b] text-white font-medium py-3.5 px-6 rounded-2xl transition-all duration-300 shadow-xs',
  },
  sand_dune: {
    name: 'sand_dune',
    label: '🏜️ แซนด์ดูน (Sand Dune)',
    isPro: true,
    bgClass: 'bg-[#f4f1ea] text-[#4e342e]',
    containerClass: 'max-w-md mx-auto min-h-screen px-6 py-12 flex flex-col items-center justify-between',
    cardClass: 'w-full bg-[#ede8dc] border border-[#d7ccc8] rounded-xl p-4 hover:bg-[#e0d7c3] transition-all duration-300 transform hover:-translate-y-0.5',
    textClass: 'text-[#4e342e]',
    textMutedClass: 'text-[#6d4c41]',
    accentClass: 'text-[#5d4037]',
    primaryButtonClass: 'w-full bg-[#5d4037] text-white font-medium py-3.5 px-6 rounded-xl transition-all duration-300 shadow-xs',
  },
  midnight_ink: {
    name: 'midnight_ink',
    label: '🖋️ มิดไนท์อิงค์ (Midnight Ink)',
    isPro: true,
    bgClass: 'bg-[#121212] text-[#ffffff]',
    containerClass: 'max-w-md mx-auto min-h-screen px-6 py-12 flex flex-col items-center justify-between',
    cardClass: 'w-full bg-[#1e1e1e] border border-[#2e2e2e] rounded-2xl p-4 hover:border-[#3e3e3e] transition-all duration-300 transform hover:-translate-y-0.5',
    textClass: 'text-[#ffffff]',
    textMutedClass: 'text-[#a3a3a3]',
    accentClass: 'text-[#f5f5f5]',
    primaryButtonClass: 'w-full bg-[#f5f5f5] text-black font-semibold py-3.5 px-6 rounded-2xl transition-all duration-300 shadow-xs',
  },

  // 🔒 PRO TIER THEMES
  pastel_pink: {
    name: 'pastel_pink',
    label: '🌸 พาสเทลชมพู (Pastel Pink)',
    isPro: true,
    bgClass: 'bg-gradient-to-b from-[#FFF0F5] via-[#FFE4E1] to-[#FFF5EE] text-[#4A2E35]',
    containerClass: 'max-w-md mx-auto min-h-screen px-6 py-12 flex flex-col items-center justify-between',
    cardClass: 'w-full bg-white/70 backdrop-blur-md border border-[#FFD1DC] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5',
    textClass: 'text-[#4A2E35]',
    textMutedClass: 'text-[#7D646A]',
    accentClass: 'text-[#FF69B4]',
    primaryButtonClass: 'w-full bg-[#FFB7C5] hover:bg-[#FFA4B4] text-white font-medium py-3.5 px-6 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md',
  },
  matcha_green: {
    name: 'matcha_green',
    label: '🍵 มัทฉะกรีน (Matcha Green)',
    isPro: true,
    bgClass: 'bg-[#f0f4f1] text-[#1b4332]',
    containerClass: 'max-w-md mx-auto min-h-screen px-6 py-12 flex flex-col items-center justify-between',
    cardClass: 'w-full bg-white/80 backdrop-blur-xs border border-[#adc1b5] rounded-2xl p-4 shadow-xs hover:bg-[#e1eae4] transition-all duration-300 transform hover:-translate-y-0.5',
    textClass: 'text-[#1b4332]',
    textMutedClass: 'text-[#40916c]',
    accentClass: 'text-[#2d6a4f]',
    primaryButtonClass: 'w-full bg-[#2d6a4f] text-white font-medium py-3.5 px-6 rounded-2xl transition-all duration-300 shadow-xs',
  },
  lavender_dream: {
    name: 'lavender_dream',
    label: '🪻 ลาเวนเดอร์ดรีม (Lavender Dream)',
    isPro: true,
    bgClass: 'bg-[#f5f3ff] text-[#4c1d95]',
    containerClass: 'max-w-md mx-auto min-h-screen px-6 py-12 flex flex-col items-center justify-between',
    cardClass: 'w-full bg-white/80 backdrop-blur-xs border border-[#ddd6fe] rounded-2xl p-4 shadow-xs hover:bg-[#ede9fe] transition-all duration-300 transform hover:-translate-y-0.5',
    textClass: 'text-[#4c1d95]',
    textMutedClass: 'text-[#7c3aed]',
    accentClass: 'text-[#6d28d9]',
    primaryButtonClass: 'w-full bg-[#6d28d9] text-white font-medium py-3.5 px-6 rounded-2xl transition-all duration-300 shadow-xs',
  },
  lemon_tart: {
    name: 'lemon_tart',
    label: '🍋 เลมอนทาร์ต (Lemon Tart)',
    isPro: true,
    bgClass: 'bg-[#fefce8] text-[#78350f]',
    containerClass: 'max-w-md mx-auto min-h-screen px-6 py-12 flex flex-col items-center justify-between',
    cardClass: 'w-full bg-white/80 backdrop-blur-xs border border-[#fef08a] rounded-2xl p-4 shadow-xs hover:bg-[#fef9c3] transition-all duration-300 transform hover:-translate-y-0.5',
    textClass: 'text-[#78350f]',
    textMutedClass: 'text-[#ca8a04]',
    accentClass: 'text-[#b45309]',
    primaryButtonClass: 'w-full bg-[#b45309] text-white font-medium py-3.5 px-6 rounded-2xl transition-all duration-300 shadow-xs',
  },
  ocean_breeze: {
    name: 'ocean_breeze',
    label: '🌊 โอเชียนบรีซ (Ocean Breeze)',
    isPro: true,
    bgClass: 'bg-gradient-to-b from-[#f0f9ff] to-[#e0f2fe] text-[#1e3a8a]',
    containerClass: 'max-w-md mx-auto min-h-screen px-6 py-12 flex flex-col items-center justify-between',
    cardClass: 'w-full bg-white/80 backdrop-blur-xs border border-[#bae6fd] rounded-2xl p-4 shadow-xs hover:bg-[#e0f2fe] transition-all duration-300 transform hover:-translate-y-0.5',
    textClass: 'text-[#1e3a8a]',
    textMutedClass: 'text-[#0284c7]',
    accentClass: 'text-[#0369a1]',
    primaryButtonClass: 'w-full bg-[#0369a1] text-white font-medium py-3.5 px-6 rounded-2xl transition-all duration-300 shadow-xs',
  },
  cyber_neon: {
    name: 'cyber_neon',
    label: '🌐 ไซเบอร์นีออน (Cyber Neon)',
    isPro: true,
    bgClass: 'bg-[#030712] text-[#10b981]',
    containerClass: 'max-w-md mx-auto min-h-screen px-6 py-12 flex flex-col items-center justify-between',
    cardClass: 'w-full bg-[#111827] border-2 border-[#10b981]/50 rounded-xl p-4 shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:border-[#06b6d4] hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:text-[#06b6d4] transition-all duration-300 transform hover:-translate-y-0.5',
    textClass: 'text-[#10b981]',
    textMutedClass: 'text-[#06b6d4]',
    accentClass: 'text-[#06b6d4]',
    primaryButtonClass: 'w-full bg-[#10b981] text-black font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-sm',
  },
  luxury_gold: {
    name: 'luxury_gold',
    label: '🏆 ลักชูรีโกลด์ (Luxury Gold)',
    isPro: true,
    bgClass: 'bg-[#09090b] text-[#d4af37]',
    containerClass: 'max-w-md mx-auto min-h-screen px-6 py-12 flex flex-col items-center justify-between',
    cardClass: 'w-full bg-[#18181b] border-2 border-[#d4af37]/40 rounded-xl p-4 shadow-[0_0_10px_rgba(212,175,55,0.05)] hover:border-[#d4af37] hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300 transform hover:-translate-y-0.5',
    textClass: 'text-[#d4af37]',
    textMutedClass: 'text-[#a1a1aa]',
    accentClass: 'text-[#d4af37]',
    primaryButtonClass: 'w-full bg-[#d4af37] text-black font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-sm',
  },
};

