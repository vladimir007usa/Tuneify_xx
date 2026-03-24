'use client';

import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat,
  Shuffle, 
  Volume2, 
  VolumeX,
  ListMusic, 
  Laptop2, 
  Maximize2,
  Music 
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import YouTube from 'react-youtube';

export default function Player() {
  const { 
    currentSong, 
    isPlaying, 
    togglePlay, 
    volume, 
    setVolume, 
    progress, 
    setProgress,
    duration, 
    setDuration,
    seek,
    youtubePlayerRef,
    playNext,
    playPrevious,
    isShuffle,
    toggleShuffle,
    isRepeat,
    toggleRepeat
  } = usePlayer();

  const [localProgress, setLocalProgress] = useState(0);
  const prevVolumeRef = useRef<number>(1);
  const [isYTReady, setIsYTReady] = useState(false);

  // Sync local progress with global progress when not scrubbing
  useEffect(() => {
    setLocalProgress(progress);
  }, [progress]);

  // Handle YouTube readiness state reset
  useEffect(() => {
    setIsYTReady(false);
  }, [currentSong?.id, currentSong?.youtubeId]);

  // YouTube Polling Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (currentSong?.youtubeId && isYTReady && youtubePlayerRef.current) {
      interval = setInterval(() => {
        try {
          if (typeof youtubePlayerRef.current.getCurrentTime === 'function') {
            const current = youtubePlayerRef.current.getCurrentTime();
            if (isFinite(current) && current >= 0) {
              setLocalProgress(current);
              setProgress(current);
            }
          }
          
          // Double check duration if it's still 0
          if (duration === 0 || !isFinite(duration)) {
             const d = youtubePlayerRef.current.getDuration();
             if (d && isFinite(d) && d > 0) setDuration(d);
          }
        } catch (e) {
          console.error("YouTube Polling Error:", e);
        }
      }, 500);
    }

    return () => {
       if (interval) clearInterval(interval);
    };
  }, [currentSong?.youtubeId, isYTReady, setProgress, duration, setDuration]);

  const handleMuteToggle = () => {
    if (volume > 0) {
      prevVolumeRef.current = volume;
      setVolume(0);
    } else {
      setVolume(prevVolumeRef.current || 1);
    }
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-2 left-2 right-2 bg-black/90 backdrop-blur-xl border border-white/10 h-20 px-4 flex items-center justify-between z-50 rounded-xl shadow-2xl">
      
      {/* Hidden YouTube Player (Phase 5) */}
      {currentSong?.youtubeId && (
        <div key={currentSong.youtubeId} className="hidden pointer-events-none absolute opacity-0 overflow-hidden w-0 h-0">
          <YouTube 
            videoId={currentSong.youtubeId} 
            opts={{ 
              playerVars: { 
                autoplay: 1,
                controls: 0,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                origin: typeof window !== 'undefined' ? window.location.origin : ''
              } 
            }}
            onReady={(e) => {
              youtubePlayerRef.current = e.target;
              setIsYTReady(true);
              const d = e.target.getDuration();
              if (d && isFinite(d) && d > 0) setDuration(d);
            }}
            onStateChange={(e) => {
              // 0 = Ended, 1 = Playing, 2 = Paused, 3 = Buffering, 5 = Cued
              if (e.data === 1) {
                const d = e.target.getDuration();
                if (d && isFinite(d) && d > 0) setDuration(d);
              }
              if (e.data === 0) {
                playNext();
              }
            }}
            onError={(e) => {
              console.error("YouTube Player Error:", e.data);
              setIsYTReady(false);
            }}
          />
        </div>
      )}

      {/* Left: Song Info */}
      <div className="flex items-center gap-x-4 w-[30%] min-w-[180px]">
        <div className="w-14 h-14 bg-[#282828] rounded-md overflow-hidden shadow-lg border border-white/5 group relative cursor-pointer">
          <img 
            src={currentSong.imageUrl || currentSong.thumbnail || '/placeholder-song.jpg'} 
            alt={currentSong.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Maximize2 size={16} />
          </div>
        </div>
        <div className="flex flex-col justify-center max-w-[150px]">
          <h4 className="text-sm font-bold text-white hover:underline cursor-pointer truncate tracking-tight">{currentSong.title}</h4>
          <p className="text-[11px] text-gray-400 hover:text-white hover:underline cursor-pointer truncate font-medium mt-0.5">{currentSong.artist}</p>
        </div>
      </div>

      {/* Center: Controls */}
      <div className="flex flex-col items-center max-w-[40%] w-full gap-y-2">
        <div className="flex items-center gap-x-6">
          <button onClick={toggleShuffle} className={`transition active:scale-95 ${isShuffle ? 'text-[#1DB954]' : 'text-gray-400 hover:text-white'}`}><Shuffle size={18} /></button>
          <button onClick={playPrevious} className="text-gray-400 hover:text-white transition active:scale-90"><SkipBack size={22} fill="currentColor" /></button>
          <button 
            onClick={togglePlay}
            className="bg-white text-black p-2 rounded-full hover:scale-105 transition active:scale-95 shadow-xl"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-0.5" />}
          </button>
          <button onClick={playNext} className="text-gray-400 hover:text-white transition active:scale-90"><SkipForward size={22} fill="currentColor" /></button>
          <button onClick={toggleRepeat} className={`transition active:scale-95 ${isRepeat ? 'text-[#1DB954]' : 'text-gray-400 hover:text-white'}`}>
            <Repeat size={18} />
          </button>
        </div>
        
        <div className="flex items-center gap-x-2 w-full max-w-[600px]">
          <span className="text-[11px] text-gray-400 min-w-[32px] text-right tabular-nums">{formatTime(localProgress)}</span>
          <div className="flex-1 h-1 bg-[#4d4d4d] rounded-full relative group cursor-pointer">
            <input 
              type="range"
              min={0}
              max={duration || 100}
              value={localProgress}
              onChange={(e) => {
                const val = Number(e.target.value);
                setLocalProgress(val);
                seek(val);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
              style={{ width: `${(localProgress / (duration || 1) || 0) * 100}%` }}
              className="absolute top-0 left-0 h-full bg-white group-hover:bg-[#1DB954] rounded-full transition-colors"
            />
            <div 
              style={{ left: `${(localProgress / (duration || 1) || 0) * 100}%` }}
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-xl"
            />
          </div>
          <span className="text-[11px] text-gray-400 min-w-[32px] tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume & Extra */}
      <div className="flex items-center justify-end gap-x-3 w-[30%] min-w-[180px]">
        <button className="text-gray-400 hover:text-white transition"><ListMusic size={18} /></button>
        <button className="text-gray-400 hover:text-white transition"><Laptop2 size={18} /></button>
        <div className="flex items-center gap-x-2 group">
          <button 
            onClick={handleMuteToggle}
            className="text-gray-400 hover:text-white transition"
          >
            {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <div className="w-24 h-1 bg-[#4d4d4d] rounded-full relative cursor-pointer">
            <input 
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
              style={{ width: `${volume * 100}%` }}
              className="absolute top-0 left-0 h-full bg-white group-hover:bg-[#1DB954] rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
