import React from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Profile, LinkItem, THEMES } from '@/lib/types';
import PublicLinks from '@/components/PublicLinks';

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username).toLowerCase();

  // 1. Fetch Profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', decodedUsername)
    .single();

  if (profileError || !profile) {
    console.error('Error fetching profile or profile not found:', profileError);
    return notFound();
  }

  const typedProfile = profile as Profile;

  // 2. Fetch Links sorted by sort_order
  const { data: linksData, error: linksError } = await supabase
    .from('links')
    .select('*')
    .eq('profile_id', typedProfile.id)
    .order('sort_order', { ascending: true });

  if (linksError) {
    console.error('Error fetching links:', linksError);
  }

  const links = (linksData || []).map((link: any) => {
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
  }) as LinkItem[];
  let activeTheme = THEMES[typedProfile.theme] || THEMES.clean_light;
  if (activeTheme.isPro && typedProfile.plan !== 'pro') {
    activeTheme = THEMES.clean_light;
  }

  // Parse bio config (Remove Watermark feature stored inside Bio text block)
  const rawBio = typedProfile.bio || '';
  const removeWatermark = typedProfile.plan === 'pro' && rawBio.includes('[config:remove_watermark=true]');
  const bioText = rawBio.replace('[config:remove_watermark=true]', '').trim();

  return (
    <main className={`min-h-screen transition-colors duration-500 ${activeTheme.bgClass}`}>
      <div className={activeTheme.containerClass}>
        {/* Profile Header */}
        <div className="w-full flex flex-col items-center text-center mt-8 mb-8 animate-fade-in">
          {typedProfile.avatar_url ? (
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/50 shadow-md mb-4 group hover:scale-105 transition-transform duration-300">
              <img
                src={typedProfile.avatar_url}
                alt={typedProfile.display_name || typedProfile.username}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-neutral-200/50 dark:bg-neutral-800/50 flex items-center justify-center text-3xl font-bold border-2 border-white/50 shadow-sm mb-4">
              {(typedProfile.display_name || typedProfile.username).charAt(0).toUpperCase()}
            </div>
          )}
          
          <h1 className="text-2xl font-extrabold tracking-tight opacity-95">
            {typedProfile.display_name || `@${typedProfile.username}`}
          </h1>
          
          {typedProfile.display_name && (
            <p className="text-xs opacity-60 font-semibold mt-1">
              @{typedProfile.username}
            </p>
          )}

          {bioText && (
            <p className="text-xs font-medium max-w-sm mt-3.5 opacity-75 whitespace-pre-wrap leading-relaxed">
              {bioText}
            </p>
          )}
        </div>

        {/* Links Navigation */}
        <div className="w-full flex-1 mb-12">
          <PublicLinks links={links} theme={activeTheme} plan={typedProfile.plan} />
        </div>

        {/* Footer/Watermark based on Subscription Plan */}
        {typedProfile.plan === 'free' ? (
          <footer className="w-full text-center py-6 animate-pulse shrink-0">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/20 dark:bg-black/20 hover:bg-white/35 dark:hover:bg-black/35 backdrop-blur-xs border border-white/10 dark:border-white/5 rounded-full text-[10px] font-extrabold tracking-wide transition-all duration-300 shadow-2xs hover:shadow-xs text-pink-600 dark:text-pink-400"
            >
              สร้างลิงก์ของคุณฟรีด้วย SiamLink 🇹🇭
            </a>
          </footer>
        ) : (
          <footer className="w-full text-center py-6 shrink-0">
            {!removeWatermark && (
              <p className="text-[9px] opacity-35 font-mono tracking-widest uppercase text-center">
                SiamLink Premium Creator ⚡
              </p>
            )}
          </footer>
        )}
      </div>
    </main>
  );
}
