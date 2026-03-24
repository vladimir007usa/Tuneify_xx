'use client';

import { createContext, useContext, useState, useRef, useEffect, useMemo, useCallback } from 'react';

interface Song {
  id: string;
  title: string;
  artist: string;
  audioUrl?: string;
  imageUrl?: string;
  youtubeId?: string; // Phase 5: YouTube Support
  thumbnail?: string;
  previewUrl?: string;
}

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  playSong: (song: Song, queue?: Song[], index?: number) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  youtubePlayerRef: React.MutableRefObject<any>;
  playNext: () => void;
  playPrevious: () => void;
  isShuffle: boolean;
  toggleShuffle: () => void;
  isRepeat: boolean;
  toggleRepeat: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(1);
  const [progress, setProgressState] = useState(0);
  const [duration, setDurationState] = useState(0);
  
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const youtubePlayerRef = useRef<any>(null);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    
    if (isRepeat && currentIndex >= 0) {
      if (currentSong?.audioUrl && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      } else if (currentSong?.youtubeId && youtubePlayerRef.current?.seekTo) {
        youtubePlayerRef.current.seekTo(0, true);
        youtubePlayerRef.current.playVideo();
      }
      return;
    }

    let nextIndex;
    if (isShuffle) {
      const currentShufflePos = shuffledIndices.indexOf(currentIndex);
      if (currentShufflePos >= 0 && currentShufflePos < shuffledIndices.length - 1) {
        nextIndex = shuffledIndices[currentShufflePos + 1];
      } else {
        // End of shuffled queue
        setIsPlaying(false); return;
      }
    } else {
      if (currentIndex < queue.length - 1) {
        nextIndex = currentIndex + 1;
      } else {
        setIsPlaying(false); return;
      }
    }
    setCurrentIndex(nextIndex);
    loadSong(queue[nextIndex]);
  }, [queue, currentIndex, isShuffle, isRepeat, shuffledIndices, currentSong]);

  const playPrevious = useCallback(() => {
    if (queue.length === 0) return;
    if (progress > 3) {
      // If we are more than 3 sec in, just seek to 0
       if (currentSong?.audioUrl && audioRef.current) audioRef.current.currentTime = 0;
       else if (currentSong?.youtubeId && youtubePlayerRef.current?.seekTo) youtubePlayerRef.current.seekTo(0, true);
       return;
    }

    let prevIndex;
    if (isShuffle) {
      const currentShufflePos = shuffledIndices.indexOf(currentIndex);
      if (currentShufflePos > 0) prevIndex = shuffledIndices[currentShufflePos - 1];
      else prevIndex = shuffledIndices[shuffledIndices.length - 1]; // Loop around
    } else {
      if (currentIndex > 0) prevIndex = currentIndex - 1;
      else prevIndex = queue.length - 1;
    }
    setCurrentIndex(prevIndex);
    loadSong(queue[prevIndex]);
  }, [queue, currentIndex, isShuffle, shuffledIndices, currentSong, progress]);

  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (audio.currentTime) setProgressState(audio.currentTime);
    };
    const handleDurationChange = () => {
      if (audio.duration && isFinite(audio.duration)) setDurationState(audio.duration);
    };
    const handleLoadedMetadata = () => {
      if (audio.duration && isFinite(audio.duration)) setDurationState(audio.duration);
    };
    const handleEnded = () => {
      // Only trigger next on audio end, youtube handles its own (in Player.tsx)
      playNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [playNext]);

  const loadSong = async (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setProgressState(0);
    setDurationState(0);

    let playableSong = song;

    // If song has previewUrl, use it immediately as primary audio source
    // This works reliably on all environments (Vercel, localhost, etc.)
    if (!playableSong.youtubeId && !playableSong.audioUrl) {
      if (song.previewUrl) {
        // Use iTunes 30s preview immediately — reliable on all environments
        playableSong = { ...song, audioUrl: song.previewUrl };
      } else {
        // Try YouTube as a last resort with a short timeout
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
          const res = await fetch(`/api/yt-search?q=${encodeURIComponent(`${song.title} ${song.artist} official audio`)}`, { signal: controller.signal });
          clearTimeout(timeoutId);
          const data = await res.json();
          if (data.videoId) playableSong = { ...song, youtubeId: data.videoId };
        } catch (e) {
          console.warn('yt-search failed or timed out:', e);
        }
      }
      setCurrentSong(playableSong);
    }

    if (playableSong.audioUrl) {
      if (audioRef.current) {
        audioRef.current.src = playableSong.audioUrl;
        audioRef.current.play().catch(e => console.error("Audio playback error:", e));
        if (youtubePlayerRef.current?.pauseVideo) youtubePlayerRef.current.pauseVideo();
      }
    } else if (playableSong.youtubeId) {
      if (audioRef.current) audioRef.current.pause();
    }
  };

  const playSong = useCallback((song: Song, newQueue: Song[] = [], index: number = 0) => {
    if (newQueue.length > 0) {
      setQueue(newQueue);
      setCurrentIndex(index);
      
      // Setup shuffle queue if needed
      if (isShuffle) {
        const indices = newQueue.map((_, i) => i).filter(i => i !== index);
        // Fisher-Yates shuffle
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        setShuffledIndices([index, ...indices]);
      }
    } else {
      setQueue([song]);
      setCurrentIndex(0);
      if (isShuffle) setShuffledIndices([0]);
    }

    loadSong(song);
  }, [isShuffle]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => {
      const newState = !prev;
      if (newState && queue.length > 0) {
        const indices = queue.map((_, i) => i).filter(i => i !== currentIndex);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        setShuffledIndices([currentIndex, ...indices]);
      }
      return newState;
    });
  }, [queue, currentIndex]);

  const toggleRepeat = useCallback(() => {
    setIsRepeat(prev => !prev);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => {
      const newState = !prev;
      if (currentSong?.audioUrl && audioRef.current) {
        if (newState) audioRef.current.play();
        else audioRef.current.pause();
      } else if (currentSong?.youtubeId && youtubePlayerRef.current) {
        if (newState) youtubePlayerRef.current.playVideo();
        else youtubePlayerRef.current.pauseVideo();
      }
      return newState;
    });
  }, [currentSong]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
    if (youtubePlayerRef.current?.setVolume) {
      youtubePlayerRef.current.setVolume(v * 100);
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (currentSong?.audioUrl && audioRef.current) {
      audioRef.current.currentTime = time;
    } else if (currentSong?.youtubeId && youtubePlayerRef.current?.seekTo) {
      youtubePlayerRef.current.seekTo(time, true);
    }
  }, [currentSong]);

  const setProgress = useCallback((p: number) => setProgressState(p), []);
  const setDuration = useCallback((d: number) => setDurationState(d), []);

  const value = useMemo(() => ({
    currentSong,
    isPlaying,
    volume,
    progress,
    duration,
    playSong,
    togglePlay,
    setVolume,
    seek,
    setProgress,
    setDuration,
    youtubePlayerRef,
    playNext,
    playPrevious,
    isShuffle,
    toggleShuffle,
    isRepeat,
    toggleRepeat
  }), [currentSong, isPlaying, volume, progress, duration, playSong, togglePlay, setVolume, seek, setProgress, setDuration, playNext, playPrevious, isShuffle, toggleShuffle, isRepeat, toggleRepeat]);

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
