'use client';

import React, { useState } from 'react';
import { Copy, Check, ExternalLink, MessageCircle, CreditCard, Send, Video } from 'lucide-react';
import { LinkItem, ThemeConfig } from '@/lib/types';

interface PublicLinksProps {
  links: LinkItem[];
  theme: ThemeConfig;
  plan?: string;
}

const getBankStyles = (bankName: string | null) => {
  const name = bankName || '';
  if (name.includes('กสิกร') || name.toLowerCase().includes('kbank')) {
    return {
      bg: 'bg-emerald-50/90 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50',
      badge: 'bg-[#00a950] text-white',
      text: 'text-emerald-800 dark:text-emerald-400',
      name: 'กสิกรไทย',
      logo: '🟢'
    };
  }
  if (name.includes('ไทยพาณิชย์') || name.toLowerCase().includes('scb')) {
    return {
      bg: 'bg-purple-50/90 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/50',
      badge: 'bg-[#4e2a84] text-white',
      text: 'text-purple-800 dark:text-purple-400',
      name: 'ไทยพาณิชย์',
      logo: '🟣'
    };
  }
  if (name.includes('พร้อมเพย์') || name.toLowerCase().includes('promptpay')) {
    return {
      bg: 'bg-sky-50/90 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900/50',
      badge: 'bg-[#003e6b] text-white',
      text: 'text-sky-850 dark:text-sky-400',
      name: 'พร้อมเพย์',
      logo: '🔵'
    };
  }
  if (name.includes('กรุงเทพ') || name.toLowerCase().includes('bbl')) {
    return {
      bg: 'bg-blue-50/90 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50',
      badge: 'bg-[#1e3a8a] text-white',
      text: 'text-blue-800 dark:text-blue-400',
      name: 'กรุงเทพ',
      logo: '🔷'
    };
  }
  if (name.includes('กรุงศรี') || name.toLowerCase().includes('bay')) {
    return {
      bg: 'bg-amber-50/90 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50',
      badge: 'bg-[#fbb03b] text-stone-900',
      text: 'text-amber-800 dark:text-amber-400',
      name: 'กรุงศรีอยุธยา',
      logo: '🟡'
    };
  }
  // Fallback default
  return {
    bg: 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800',
    badge: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    text: 'text-zinc-800 dark:text-zinc-200',
    name: bankName || 'ธนาคาร',
    logo: '💳'
  };
};

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

export default function PublicLinks({ links, theme, plan = 'free' }: PublicLinksProps) {
  const [copiedBankId, setCopiedBankId] = useState<string | null>(null);

  const handleLinkClick = async (linkId: string) => {
    try {
      fetch('/api/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ linkId }),
      });
    } catch (err) {
      console.error('Failed to log click', err);
    }
  };

  const handleCopyBank = async (link: LinkItem) => {
    if (!link.bank_number) return;
    
    // Log the click
    handleLinkClick(link.id);

    try {
      await navigator.clipboard.writeText(link.bank_number);
      setCopiedBankId(link.id);
      setTimeout(() => {
        setCopiedBankId(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy bank number: ', err);
    }
  };

  const processLineUrl = (url: string | null) => {
    if (!url) return '';
    // Append LINE bypass if missing
    if (url.includes('line.me') && !url.includes('openExternalBrowser')) {
      return url.includes('?') ? `${url}&openExternalBrowser=1` : `${url}?openExternalBrowser=1`;
    }
    return url;
  };

  if (links.length === 0) {
    return (
      <div className="text-center py-8 opacity-60 text-sm italic">
        ยังไม่มีลิงก์ในขณะนี้
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {links.map((link) => {
        const urlHash = link.url?.split('#')[1] || '';
        // Evaluate custom settings stored as URL hashes or direct properties
        const isAnimated = link.is_highlighted || 
                           urlHash.includes('animated=true') || 
                           urlHash.includes('is_highlighted=true') || 
                           (link.type === 'bank' && (link.url === '#animated=true' || link.url === '#is_highlighted=true'));
        
        // Strip out the customization hash tags for raw href targets
        const cleanUrl = link.url 
          ? link.url
              .replace(/#(animated=true|is_highlighted=true|video_embed=true|type=video)/g, '')
              .replace(/&?(animated=true|is_highlighted=true|video_embed=true|type=video)/g, '')
              .replace(/[#&]$/, '')
              .replace(/#&/, '#')
          : '#';

        const ytId = getYoutubeId(cleanUrl);
        const ttId = getTikTokId(cleanUrl);
        const isVideoEmbed = link.type === 'video' && plan === 'pro';

        const animationClass = (isAnimated && plan === 'pro') ? 'animate-wiggle animate-elegant-pulse' : '';

        // 1. RENDER VIDEO EMBED IFRAME COMPONENT (Pro/Free gated Video)
        if (isVideoEmbed && link.url) {
          if (ytId) {
            return (
              <div 
                key={link.id} 
                className={`w-full flex flex-col gap-1.5 p-1 bg-white/40 dark:bg-black/20 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl transition-all duration-300 ${animationClass}`}
              >
                <div className="w-full aspect-video rounded-xl overflow-hidden shadow-sm">
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
                  <p className="text-xs font-bold text-center opacity-70 py-1">{link.title}</p>
                )}
              </div>
            );
          }

          if (ttId) {
            return (
              <div 
                key={link.id} 
                className={`w-full flex flex-col gap-1.5 p-1 bg-white/40 dark:bg-black/20 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl transition-all duration-300 ${animationClass}`}
              >
                <div className="w-full aspect-[9/16] max-h-[480px] rounded-xl overflow-hidden shadow-sm mx-auto">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.tiktok.com/embed/v2/${ttId}`}
                    allowFullScreen
                    frameBorder="0"
                  ></iframe>
                </div>
                {link.title && (
                  <p className="text-xs font-bold text-center opacity-70 py-1">{link.title}</p>
                )}
              </div>
            );
          }

          // Fallback standard link render if video id parser failed
        }

        // 2. RENDER BANK DETAILS TRANSFER CARD (Dynamic Accent Theming)
        if (link.type === 'bank') {
          const isCopied = copiedBankId === link.id;
          const bankStyle = getBankStyles(link.bank_name);
          
          return (
            <button
              key={link.id}
              onClick={() => handleCopyBank(link)}
              className={`w-full border p-4 rounded-2xl flex items-center justify-between text-left cursor-pointer transition-all duration-300 hover:scale-101 active:scale-99 group focus:outline-hidden focus:ring-2 focus:ring-pink-300 shadow-2xs ${bankStyle.bg} ${animationClass}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 font-bold text-md flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200/30 shadow-2xs group-hover:scale-105 transition-transform duration-300 ${bankStyle.text}`}>
                  {bankStyle.logo}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-extrabold text-sm opacity-90 text-[#3e2723] dark:text-zinc-150 leading-tight">{link.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono font-bold tracking-wide opacity-80 text-zinc-700 dark:text-zinc-300">
                      {link.bank_number}
                    </span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${bankStyle.badge} uppercase tracking-wider`}>
                      {bankStyle.name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/30 shadow-2xs group-hover:bg-pink-50 dark:group-hover:bg-zinc-800 transition-colors duration-300 shrink-0 ml-2">
                {isCopied ? (
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> คัดลอกสำเร็จ! ✨
                  </span>
                ) : (
                  <span className="text-[10px] font-black text-zinc-500 group-hover:text-pink-600 flex items-center gap-1 transition-colors">
                    <Copy className="w-3.5 h-3.5" /> คัดลอกเลขบัญชี
                  </span>
                )}
              </div>
            </button>
          );
        }

        // 3. RENDER LINE CONVERSATION ESCAPE COMPONENT
        if (link.type === 'line') {
          const processedUrl = processLineUrl(cleanUrl);
          return (
            <a
              key={link.id}
              href={processedUrl}
              onClick={() => handleLinkClick(link.id)}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between group w-full transition-all duration-300 hover:scale-101 active:scale-99 ${theme.cardClass} ${animationClass}`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <MessageCircle className="w-5 h-5 fill-emerald-600 text-emerald-50" />
                </div>
                <div>
                  <h4 className="font-bold text-sm opacity-90 leading-tight">{link.title}</h4>
                  <p className="text-[10px] opacity-60 mt-0.5">แชทติดต่อผ่าน LINE</p>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-neutral-100/50 group-hover:bg-emerald-50 transition-colors duration-300 shrink-0 ml-2">
                <Send className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:text-emerald-600 transition-all animate-pulse" />
              </div>
            </a>
          );
        }

        // 4. RENDER STANDARD LINK (MUST ALWAYS render as a button, even if YouTube/TikTok)
        return (
          <a
            key={link.id}
            href={cleanUrl}
            onClick={() => handleLinkClick(link.id)}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-between group w-full transition-all duration-300 hover:scale-101 active:scale-99 ${theme.cardClass} ${animationClass}`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl group-hover:scale-105 transition-transform duration-300 shrink-0">
                <ExternalLink className="w-5 h-5 opacity-70" />
              </div>
              <div>
                <h4 className="font-bold text-sm opacity-90 leading-tight">{link.title}</h4>
                {cleanUrl !== '#' && (
                  <p className="text-[10px] opacity-50 truncate max-w-[200px] mt-0.5">
                    {cleanUrl.replace(/https?:\/\/(www\.)?/, '')}
                  </p>
                )}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-neutral-100/50 group-hover:bg-neutral-200/50 transition-colors duration-300 shrink-0 ml-2">
              <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
          </a>
        );
      })}
    </div>
  );
}
