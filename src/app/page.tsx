'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Player from '@/components/Player';
import Footer from '@/components/Footer';
import { Music, Play, ExternalLink, Youtube } from 'lucide-react';
import { useState, useEffect, useRef, memo, useMemo } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { usePlayer } from '@/context/PlayerContext';
import { YouTubeSearchResult } from '@/lib/youtube';
import RightSidebar from '@/components/RightSidebar';

interface Song {
  id: string;
  title: string;
  artist: string;
  audioUrl?: string;
  imageUrl?: string;
  youtubeId?: string;
  thumbnail?: string;
  previewUrl?: string;
}

export const mockArtists = [
  { name: 'Arijit Singh', image: 'https://images.unsplash.com/photo-1544717297-fa95b35c76d5?q=80&w=200&h=200&auto=format&fit=crop' },
  { name: 'Taylor Swift', image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=200&h=200&auto=format&fit=crop' },
  { name: 'The Weeknd', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=200&h=200&auto=format&fit=crop' },
  { name: 'Ed Sheeran', image: 'https://images.unsplash.com/photo-1520190282933-472c74232c91?q=80&w=200&h=200&auto=format&fit=crop' },
  { name: 'Justin Bieber', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=200&h=200&auto=format&fit=crop' },
];

const homeSections = [
  { title: 'Trending songs', term: 'Top Bollywood Hits 2026' },
  { title: 'More like Arijit Singh', term: 'Arijit Singh Hits' },
  { title: 'More like Taylor Swift', term: 'Taylor Swift' },
  { title: 'Sad songs', term: 'Slow Reverb Hindi Sad' },
  { title: 'Workout', term: 'Gym Motivation Hindi' },
  { title: 'Chill', term: 'Lo-fi Hip Hop Hindi' },
  { title: 'Party', term: 'Bollywood Dance Party 2026' },
  { title: 'Sing-along', term: 'Bollywood Karaoke Hits' },
  { title: 'Top picks in new music', term: 'Latest Bollywood Songs 2026' },
  { title: 'Throwback', term: '90s Bollywood Evergreen' },
  { title: 'Today\'s biggest hits', term: 'Bollywood Chartbusters' },
  { title: 'Fresh new musics', term: 'Latest Hindi Pop' },
  { title: 'Heal your heart', term: 'Melodic Hindi Songs' },
  { title: 'Featured charts', term: 'Top Global Charts' },
  { title: 'Workout Energy', term: 'High Bass Gym Hindi' },
  { title: 'Chill Vibes', term: 'Evening Soothing Hindi' },
  { title: 'Happy Moments', term: 'Upbeat Hindi Hits' },
  { title: 'Something else', term: 'Experimental Indie Hindi' },
  { title: 'Instrumental Focus', term: 'Indian Classical Instrumental' },
];

const podcastSections = [
  { title: 'Trending Podcasts', term: 'Podcast' },
  { title: 'True Crime', term: 'True Crime Podcast' },
  { title: 'Comedy', term: 'Comedy Podcast' },
  { title: 'Technology & Business', term: 'Technology Podcast' },
  { title: 'Educational', term: 'Educational Podcast' },
  { title: 'News & Politics', term: 'News Podcast' },
];

// --- Sub-components ---

const Section = memo(function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer tracking-tight">{title}</h2>
        <span className="text-[13px] font-bold text-gray-400 hover:text-white transition cursor-pointer">Show all</span>
      </div>
      {children}
    </div>
  );
});

const SongCard = memo(function SongCard({ song, onPlay, active }: { song: Song, onPlay: () => void, active: boolean }) {
  const displayImage = song.imageUrl || song.thumbnail;
  return (
    <div 
      onClick={onPlay}
      className="bg-white/0 hover:bg-white/5 transition-all duration-300 p-3 rounded-lg group cursor-pointer shadow-lg relative"
    >
      <div className="relative aspect-square mb-3 shadow-2xl overflow-hidden rounded-md flex items-center justify-center bg-[#282828]">
        {displayImage ? (
          <img src={displayImage} alt={song.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <Music size={48} className="text-gray-600" />
        )}
        <button className={`absolute bottom-2 right-2 bg-[#1ed760] p-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-90 flex items-center justify-center shadow-xl ${active ? 'opacity-100 translate-y-0' : 'opacity-0 group-hover:opacity-100 translate-y-2'}`}>
          <Play fill="black" className="text-black ml-0.5" size={20} />
        </button>
      </div>
      <h3 className="font-bold text-white truncate text-sm leading-tight line-clamp-1">{song.title}</h3>
      <p className="text-[13px] text-gray-400 mt-1 line-clamp-1 font-medium">{song.artist}</p>
    </div>
  );
});

const YouTubeResultCard = memo(function YouTubeResultCard({ result, onPlay, active }: { result: YouTubeSearchResult, onPlay: () => void, active: boolean }) {
  return (
    <div 
      onClick={onPlay}
      className="bg-white/0 hover:bg-white/5 transition-all duration-300 p-3 rounded-lg group cursor-pointer shadow-lg relative"
    >
      <div className="relative aspect-square mb-3 shadow-2xl overflow-hidden rounded-md flex items-center justify-center bg-[#282828]">
        <img src={result.thumbnail} alt={result.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-2 left-2 bg-black/60 p-1 rounded-md">
           <Youtube size={14} className="text-[#ff0000]" />
        </div>
        <button className={`absolute bottom-2 right-2 bg-[#1ed760] p-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-90 flex items-center justify-center shadow-xl ${active ? 'opacity-100 translate-y-0' : 'opacity-0 group-hover:opacity-100 translate-y-2'}`}>
          <Play fill="black" className="text-black ml-0.5" size={20} />
        </button>
      </div>
      <h3 className="font-bold text-white truncate text-sm leading-tight line-clamp-1">{result.title}</h3>
      <p className="text-[13px] text-gray-400 mt-1 line-clamp-1 font-medium">{result.artist}</p>
    </div>
  );
});

const MockCard = memo(function MockCard() {
  return (
    <div className="bg-white/0 hover:bg-white/5 transition-all duration-300 p-3 rounded-lg group cursor-pointer animate-pulse">
      <div className="aspect-square mb-3 rounded-md bg-[#282828]" />
      <div className="h-4 bg-[#282828] w-3/4 rounded mb-2" />
      <div className="h-3 bg-[#282828] w-1/2 rounded" />
    </div>
  );
});

const MusicSection = memo(function MusicSection({ title, term, entity = 'song', onPlay, currentSong, isPlaying }: { 
  title: string, 
  term: string, 
  entity?: 'song' | 'podcastEpisode',
  onPlay: (song: Song, queue: Song[], index: number) => void,
  currentSong: any,
  isPlaying: boolean 
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasLoaded = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasLoaded.current) {
        hasLoaded.current = true;
        loadData();
      }
    }, { rootMargin: '400px' });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [term]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { fetchITunesData } = await import('@/lib/itunes');
      const results = await fetchITunesData(term, entity as any);
      setItems(results || []);
    } catch (e) {
      console.error(`Failed to load ${title}:`, e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={sectionRef}>
      <Section title={title}>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <MockCard key={i} />)
          ) : (
            items.map((s, index) => (
              <SongCard 
                key={s.id} 
                song={{ ...s, youtubeId: s.youtubeId }} 
                onPlay={() => onPlay(s, items, index)} 
                active={currentSong?.id === s.id && isPlaying} 
              />
            ))
          )}
        </div>
      </Section>
    </div>
  );
});

import { t } from '@/lib/i18n';

// --- Main Page ---

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchResults, setSearchResults] = useState<YouTubeSearchResult[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Music' | 'Podcasts' | 'Following'>('All');
  const [lang, setLang] = useState('English');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { playSong, currentSong, isPlaying } = usePlayer();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, setUser);
    
    // Basic Firestore fetch for 'My Uploads'
    const q = query(collection(db, 'songs'), orderBy('createdAt', 'desc'));
    const unsubscribeDb = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Song[];
      setSongs(docs);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeDb();
    };
  }, []);

  return (
    <div className="flex h-screen bg-black overflow-hidden p-2 gap-x-2">
      <Sidebar 
        lang={lang} 
        onLanguageChange={setLang} 
        isLangOpen={isLangOpen} 
        setIsLangOpen={setIsLangOpen} 
      />
      <div className="flex-1 flex flex-col bg-[#121212] rounded-lg overflow-hidden relative border border-white/5 shadow-inner">
        <Header 
          onSearchResults={setSearchResults} 
          onSearchLoading={setIsSearchLoading} 
          lang={lang}
        />
        
        {/* Category Filters */}
        <div className="sticky top-16 z-30 bg-[#121212]/95 backdrop-blur-md px-6 py-3 flex gap-x-2 border-b border-white/5">
          {['All', 'Music', 'Podcasts', 'Following'].map((filter) => {
            const translationKey = filter.toLowerCase();
            const translatedText = translationKey === 'following' ? filter : t(lang, translationKey);
            return (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter as any)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeFilter === filter ? 'bg-white text-black' : 'bg-[#2a2a2a] text-white hover:bg-[#333]'}`}
              >
                {translatedText}
              </button>
            );
          })}
        </div>

        <main className="flex-1 overflow-y-auto scrollbar-hide pb-32 bg-gradient-to-b from-[#1a1a1a] to-[#121212]">
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <Section title="Search Results from YouTube">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {searchResults.map((r, index) => (
                  <YouTubeResultCard 
                    key={r.id} 
                    result={r} 
                    onPlay={() => playSong(
                      { id: r.id, title: r.title, artist: r.artist, thumbnail: r.thumbnail }, 
                      searchResults.map(res => ({ id: res.id, title: res.title, artist: res.artist, thumbnail: res.thumbnail })), 
                      index
                    )} 
                    active={currentSong?.youtubeId === r.id && isPlaying} 
                  />
                ))}
              </div>
            </Section>
          )}

          {/* My Uploads */}
          {songs.length > 0 && (activeFilter === 'All' || activeFilter === 'Music') && (
            <Section title="My Uploads">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {songs.map((s, index) => (
                  <SongCard key={s.id} song={s} onPlay={() => playSong(s, songs, index)} active={currentSong?.id === s.id && isPlaying} />
                ))}
              </div>
            </Section>
          )}

          {/* Dynamic Music Sections */}
          {(activeFilter === 'All' || activeFilter === 'Music') && homeSections.map((sec) => (
            <MusicSection 
              key={sec.title} 
              title={sec.title} 
              term={sec.term} 
              entity="song"
              onPlay={playSong} 
              currentSong={currentSong} 
              isPlaying={isPlaying} 
            />
          ))}

          {/* Dynamic Podcast Sections */}
          {(activeFilter === 'All' || activeFilter === 'Podcasts') && podcastSections.map((sec) => (
            <MusicSection 
              key={sec.title} 
              title={sec.title} 
              term={sec.term} 
              entity="podcastEpisode"
              onPlay={playSong} 
              currentSong={currentSong} 
              isPlaying={isPlaying} 
            />
          ))}

          {/* Static Artists Section */}
          {(activeFilter === 'All' || activeFilter === 'Music') && (
            <Section title="Popular artists">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {mockArtists.map((a) => (
                <div key={a.name} className="flex flex-col items-center p-4 bg-white/0 hover:bg-white/5 transition-all duration-300 rounded-lg group cursor-pointer">
                  <div className="w-full aspect-square mb-4 shadow-2xl overflow-hidden rounded-full font-circular">
                    <img src={a.image} alt={a.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <h3 className="font-bold text-white text-sm">{a.name}</h3>
                  <p className="text-gray-400 text-xs mt-1">Artist</p>
                </div>
              ))}
            </div>
          </Section>
          )}

          <Footer />
        </main>
      </div>
      {user && <RightSidebar />}
      <Player />
    </div>
  );
}
