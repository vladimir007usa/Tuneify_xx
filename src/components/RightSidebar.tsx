'use client';

import { usePlayer } from '@/context/PlayerContext';
import { PlusCircle, X } from 'lucide-react';

export default function RightSidebar({ onClose }: { onClose?: () => void }) {
  const { currentSong } = usePlayer();

  return (
    <aside className="w-[320px] bg-[#121212] rounded-lg p-5 hidden xl:flex flex-col gap-y-6 overflow-y-auto pb-32">
      <div className="flex items-center justify-between">
        <span className="font-bold text-white text-[15px] truncate pr-4">
          {currentSong ? "Now Playing View" : "Now Playing View"}
        </span>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors bg-white/5 p-1.5 rounded-full hover:bg-white/10 mt-0">
            <X size={16} />
          </button>
        )}
      </div>

      {currentSong ? (
        <div className="flex flex-col gap-y-6">
          <div className="w-full aspect-square rounded-lg shadow-2xl overflow-hidden bg-[#282828]">
            {(currentSong.thumbnail || currentSong.imageUrl) ? (
              <img 
                src={currentSong.thumbnail || currentSong.imageUrl} 
                alt={currentSong.title} 
                className="w-full h-full object-cover shadow-2xl" 
              />
            ) : null}
          </div>
          
          <div className="flex items-start justify-between">
            <div className="flex flex-col pr-4">
              <h2 className="text-[22px] font-bold text-white hover:underline cursor-pointer leading-tight mb-1 line-clamp-2">
                {currentSong.title}
              </h2>
              <p className="text-[15px] pb-1 font-bold text-gray-400 hover:text-white hover:underline cursor-pointer line-clamp-1">
                {currentSong.artist}
              </p>
            </div>
            <button className="text-gray-400 hover:text-white mt-1 hover:scale-105 transition-transform">
              <PlusCircle size={22} fill="currentColor" className="text-gray-400/20 stroke-gray-400 hover:stroke-white hover:text-white/20" />
            </button>
          </div>
          
          <div className="bg-[#242424] rounded-xl p-4 cursor-pointer hover:bg-[#2a2a2a] transition-colors relative overflow-hidden group shadow-lg">
            <h3 className="font-bold text-white mb-2 relative z-10 text-[15px]">About the artist</h3>
            <p className="text-sm font-medium text-white/80 line-clamp-4 relative z-10 leading-relaxed">
              {currentSong.artist} is an incredible talent bringing fresh sounds to the industry. Their latest releases 
              have captivated millions. More biographical information, tour dates, and merch will be available soon.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 opacity-50 space-y-4 pb-20">
           <div className="w-full aspect-square border border-dashed border-gray-600 rounded-lg flex items-center justify-center bg-black/20">
             <span className="text-gray-500 font-bold text-sm">No track playing</span>
           </div>
        </div>
      )}
    </aside>
  );
}
