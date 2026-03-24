import { Home, Search, Library, Plus, Heart, Upload, List } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { mockArtists } from '@/app/page';
import LanguageModal from '@/components/LanguageModal';
import { t } from '@/lib/i18n';

interface SidebarProps {
  lang: string;
  onLanguageChange: (lang: string) => void;
  isLangOpen: boolean;
  setIsLangOpen: (open: boolean) => void;
}

export default function Sidebar({ lang, onLanguageChange, isLangOpen, setIsLangOpen }: SidebarProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);
  return (
    <aside className="w-[280px] bg-black p-2 flex flex-col gap-y-2 h-full hidden lg:flex select-none">
      {/* Home/Search Section */}
      <div className="bg-[#121212] rounded-lg p-4 flex flex-col gap-y-4">
        <Link href="/" className="flex items-center gap-x-4 text-gray-400 hover:text-white transition-all duration-300 group">
          <Home className="group-hover:text-white transition-colors" size={26} strokeWidth={2.5} />
          <span className="font-bold text-base">{t(lang, 'home')}</span>
        </Link>
        <Link href="/" className="flex items-center gap-x-4 text-gray-400 hover:text-white transition-all duration-300 group">
          <Search className="group-hover:text-white transition-colors" size={26} strokeWidth={2.5} />
          <span className="font-bold text-base">{t(lang, 'search')}</span>
        </Link>
        <Link href="/upload" className="flex items-center gap-x-4 text-gray-400 hover:text-[#1DB954] transition-all duration-300 group">
          <Upload className="group-hover:text-[#1DB954] transition-colors" size={26} strokeWidth={2.5} />
          <span className="font-bold text-base">Upload Music</span>
        </Link>
      </div>

      {/* Library Section */}
      <div className="bg-[#121212] rounded-lg flex-1 flex flex-col overflow-hidden">
        <div className="p-4 flex items-center justify-between text-gray-400">
          <button className="flex items-center gap-x-3 hover:text-white transition-all duration-300 group">
            <Library size={26} strokeWidth={2.5} className="group-hover:text-white" />
            <span className="font-bold text-base">{t(lang, 'library')}</span>
          </button>
          <button className="hover:bg-white/10 p-1.5 rounded-full text-gray-400 hover:text-white transition-all">
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>

        {user && (
          <div className="flex flex-col gap-y-2 mt-2">
            <div className="px-4 flex gap-x-2">
              <span className="bg-[#2a2a2a] text-white px-3 py-1.5 rounded-full text-[13px] font-medium cursor-pointer hover:bg-[#333] transition">
                Artists
              </span>
            </div>
            <div className="flex items-center justify-between px-4 mt-2">
              <button className="p-1.5 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white">
                <Search size={18} />
              </button>
              <button className="text-[13px] text-gray-400 flex items-center gap-x-1 font-bold hover:text-white transition hover:scale-105">
                Recents <List size={16}/>
              </button>
            </div>
          </div>
        )}

        <div className="px-2 overflow-y-auto flex-1 flex flex-col gap-y-2 pb-4 mt-2">
          {!user ? (
            <>
              {/* Action Cards */}
              <div className="bg-[#242424] rounded-lg p-4 flex flex-col gap-y-4 mx-2">
                <div className="flex flex-col gap-y-1">
                  <span className="text-sm font-bold text-white">{t(lang, 'createPlaylist')}</span>
                  <span className="text-xs font-medium text-white/80">{t(lang, 'helpPlaylist')}</span>
                </div>
                <button className="bg-white text-black text-xs font-bold py-2 px-4 rounded-full w-fit hover:scale-105 transition-transform active:scale-95">
                  {t(lang, 'createBtn')}
                </button>
              </div>

              <div className="bg-[#242424] rounded-lg p-4 flex flex-col gap-y-4 mx-2">
                <div className="flex flex-col gap-y-1">
                  <span className="text-sm font-bold text-white">Let's find some podcasts to follow</span>
                  <span className="text-xs font-medium text-white/80">We'll keep you updated on new episodes</span>
                </div>
                <button className="bg-white text-black text-xs font-bold py-2 px-4 rounded-full w-fit hover:scale-105 transition-transform active:scale-95">
                  Browse podcasts
                </button>
              </div>
            </>
          ) : (
             <div className="flex flex-col gap-y-1 mt-1">
               {mockArtists.map(a => (
                 <div key={a.name} className="flex items-center gap-x-3 p-2 hover:bg-[#1a1a1a] rounded-md cursor-pointer transition">
                    <img src={a.image} className="w-12 h-12 rounded-full object-cover shadow-md" />
                    <div className="flex flex-col justify-center">
                      <span className="text-white font-medium text-[15px]">{a.name}</span>
                      <span className="text-gray-400 text-[13px] font-medium mt-0.5">Artist</span>
                    </div>
                 </div>
               ))}
             </div>
          )}
        </div>

        {/* Legal/Footer Links */}
        <div className="p-6 flex flex-wrap gap-x-4 gap-y-2 opacity-60">
          <span className="text-[11px] text-gray-400 hover:underline cursor-pointer">Legal</span>
          <span className="text-[11px] text-gray-400 hover:underline cursor-pointer">Safety & Privacy Center</span>
          <span className="text-[11px] text-gray-400 hover:underline cursor-pointer">Privacy Policy</span>
          <span className="text-[11px] text-gray-400 hover:underline cursor-pointer">Cookies</span>
          <span className="text-[11px] text-gray-400 hover:underline cursor-pointer">About Ads</span>
          <span className="text-[11px] text-gray-400 hover:underline cursor-pointer">Accessibility</span>
        </div>
        
        <div className="px-6 mb-8 flex flex-col items-start gap-y-4">
          <button 
            onClick={() => setIsLangOpen(true)}
            className="border border-gray-500 rounded-full px-4 py-1.5 flex items-center gap-x-1.5 text-white hover:border-white transition-all hover:scale-105"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM11 19.931C7.05369 19.4371 4 16.0759 4 12C4 11.6565 4.0242 11.3186 4.07095 10.9881L7 13.9172V15C7 16.1046 7.89543 17 9 17V18.8945C9.64205 18.9639 10.3 19 11 19V19.931ZM17.9034 16.925C17.4789 16.3621 16.7628 16 16 16H15V13C15 12.4477 14.5523 12 14 12H9V10H11C11.5523 10 12 9.55228 12 9V7H14C15.1046 7 16 6.10457 16 5V4.58818C18.4239 5.75059 20 8.19013 20 11C20 13.3831 18.2325 15.352 16 15.89241L17.9034 16.925Z" /></svg>
            <span className="text-xs font-bold">{lang}</span>
          </button>
          <span className="text-[11px] text-gray-500 ml-1">© 2026 Tuneify</span>
        </div>
      </div>
      
      <LanguageModal 
        isOpen={isLangOpen}
        onClose={() => setIsLangOpen(false)}
        onSelect={onLanguageChange}
      />
    </aside>
  );
}
