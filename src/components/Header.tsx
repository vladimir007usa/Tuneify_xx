'use client';

import { useState, useEffect, useRef } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Home as HomeIcon, 
  ArrowDownCircle, 
  Bell, 
  User as UserIcon,
  SearchIcon,
  Loader2,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { searchYouTube, YouTubeSearchResult } from '@/lib/youtube';

import { t } from '@/lib/i18n';

interface HeaderProps {
  onSearchResults?: (results: YouTubeSearchResult[]) => void;
  onSearchLoading?: (loading: boolean) => void;
  lang?: string;
}

export default function Header({ onSearchResults, onSearchLoading, lang = 'English' }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Debounced Search Effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      onSearchResults?.([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      onSearchLoading?.(true);
      try {
        const { fetchITunesData } = await import('@/lib/itunes');
        const results = await fetchITunesData(searchQuery, 'song', 20);
        // Map iTunes results to the UI-compatible format
        const mappedResults: YouTubeSearchResult[] = results.map(r => ({
          id: r.id,
          title: r.title,
          artist: r.artist,
          thumbnail: r.thumbnail,
          previewUrl: r.previewUrl
        }));
        onSearchResults?.(mappedResults);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
        onSearchLoading?.(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearchResults, onSearchLoading]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="h-16 bg-black/60 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40 select-none border-b border-transparent">
      {/* Left: Navigation Arrows */}
      <div className="flex gap-x-2">
        <button className="bg-black/40 p-1.5 rounded-full text-gray-400 hover:text-white transition-all">
          <ChevronLeft size={22} />
        </button>
        <button className="bg-black/40 p-1.5 rounded-full text-gray-400 hover:text-white transition-all">
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Center: Search Bar & Home */}
      <div className="flex-1 max-w-[500px] flex items-center gap-x-2 mx-4">
        <Link href="/" className="bg-[#1f1f1f] p-3 rounded-full hover:scale-105 transition active:scale-95">
          <HomeIcon size={24} className="text-white" />
        </Link>
        <div className="flex-1 relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors">
            {isSearching ? <Loader2 size={20} className="animate-spin text-[#1DB954]" /> : <SearchIcon size={20} />}
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t(lang, 'search')} 
            className="w-full bg-[#1f1f1f] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] border-2 border-transparent focus:border-white transition-all rounded-full py-3 px-12 text-sm text-white outline-none placeholder:text-gray-400 font-medium"
          />
        </div>
      </div>

      {/* Right: Utility Links & Profile */}
      <div className="flex items-center gap-x-2">
        <div className="hidden lg:flex items-center gap-x-4 mr-4">
          <button className="text-[13px] font-bold text-gray-400 hover:text-white hover:scale-105 transition cursor-not-allowed">Premium</button>
          <button className="text-[13px] font-bold text-gray-400 hover:text-white hover:scale-105 transition cursor-not-allowed">Support</button>
          <button className="text-[13px] font-bold text-gray-400 hover:text-white hover:scale-105 transition cursor-not-allowed">Download</button>
          <div className="w-[1px] h-6 bg-gray-800 mx-2" />
        </div>

        {!loading && (
          user ? (
            <div className="flex items-center gap-x-3">
              <button title="Install App" className="flex items-center gap-x-1 border border-gray-600 rounded-full px-3 py-1.5 text-xs font-bold text-white hover:border-white transition">
                <ArrowDownCircle size={14} />
                <span>Install App</span>
              </button>
              <button className="text-gray-400 hover:text-white transition-all">
                <Bell size={20} />
              </button>
              <div className="relative" ref={dropdownRef}>
                <div 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  title="Profile"
                  className="w-8 h-8 rounded-full overflow-hidden border border-[#282828] cursor-pointer hover:scale-105 transition shadow-lg bg-[#282828]"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserIcon size={16} className="text-gray-400" />
                    </div>
                  )}
                </div>

                {isProfileOpen && (
                  <div className="absolute top-12 right-0 w-60 bg-[#282828] rounded-md shadow-2xl py-1 z-50 text-sm font-medium border border-white/10">
                    <button className="w-full px-4 py-3 flex items-center justify-between text-gray-200 hover:bg-white/10 transition">
                      <span>Account</span>
                      <ExternalLink size={16} className="text-gray-400" />
                    </button>
                    <button className="w-full px-4 py-3 text-left text-gray-200 hover:bg-white/10 transition">
                      Profile
                    </button>
                    <button className="w-full px-4 py-3 flex items-center justify-between text-gray-200 hover:bg-white/10 transition">
                      <span>Upgrade to Premium</span>
                      <ExternalLink size={16} className="text-gray-400" />
                    </button>
                    <button className="w-full px-4 py-3 flex items-center justify-between text-gray-200 hover:bg-white/10 transition">
                      <span>Support</span>
                      <ExternalLink size={16} className="text-gray-400" />
                    </button>
                    <button className="w-full px-4 py-3 flex items-center justify-between text-gray-200 hover:bg-white/10 transition">
                      <span>Download</span>
                      <ExternalLink size={16} className="text-gray-400" />
                    </button>
                    <button className="w-full px-4 py-3 text-left text-gray-200 hover:bg-white/10 transition">
                      Settings
                    </button>
                    <div className="h-[1px] bg-white/10 my-1 mx-2" />
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-gray-200 hover:bg-white/10 transition"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-x-4">
              <>
                <Link 
                  href="/login"
                  className="text-gray-400 font-bold hover:text-white transition hover:scale-105 active:scale-95 px-4 py-2 inline-block"
                >
                  {t(lang, 'signUp')}
                </Link>
                <Link 
                  href="/login" 
                  className="bg-white text-black font-bold px-8 py-3 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-xl inline-block"
                >
                  {t(lang, 'logIn')}
                </Link>
              </>
            </div>
          )
        )}
      </div>
    </header>
  );
}
