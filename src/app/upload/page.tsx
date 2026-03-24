'use client';

import { useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Link as LinkIcon, Music, Image as ImageIcon, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artist || !audioUrl || !imageUrl) {
      alert('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Save Metadata to Firestore
      await addDoc(collection(db, 'songs'), {
        title,
        artist,
        audioUrl,
        imageUrl,
        uploadedBy: auth.currentUser?.uid || 'anonymous',
        createdAt: serverTimestamp(),
        duration: 0 // Default duration
      });

      alert('Song added successfully!');
      router.push('/');
    } catch (error) {
      console.error('Failed to add song:', error);
      alert('Failed to add song. Check console.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center relative">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-x-2 text-gray-400 hover:text-white transition group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold">Back to Home</span>
      </Link>

      <div className="max-w-xl w-full bg-[#121212] p-8 rounded-2xl border border-gray-800 shadow-2xl">
        <div className="flex items-center gap-x-3 mb-8">
          <div className="bg-[#1DB954] p-2 rounded-lg">
            <LinkIcon className="text-black" size={24} />
          </div>
          <h1 className="text-3xl font-bold">Add New Song Link</h1>
        </div>

        <p className="text-gray-400 text-sm mb-8">
          Paste direct links to your .mp3 file and cover image. Ensure the links are publicly accessible.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Song Title</label>
            <input 
              required
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Blinding Lights"
              className="w-full bg-[#242424] border border-transparent focus:border-[#1DB954] rounded-md p-3 outline-none transition text-sm shadow-inner"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Artist</label>
            <input 
              required
              type="text" 
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="e.g. The Weeknd"
              className="w-full bg-[#242424] border border-transparent focus:border-[#1DB954] rounded-md p-3 outline-none transition text-sm shadow-inner"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-x-2">
              <Music size={14} /> Audio URL (.mp3 link)
            </label>
            <input 
              required
              type="url" 
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              placeholder="https://example.com/song.mp3"
              className="w-full bg-[#242424] border border-transparent focus:border-[#1DB954] rounded-md p-3 outline-none transition text-sm shadow-inner"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-x-2">
              <ImageIcon size={14} /> Cover Image URL
            </label>
            <input 
              required
              type="url" 
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/cover.jpg"
              className="w-full bg-[#242424] border border-transparent focus:border-[#1DB954] rounded-md p-3 outline-none transition text-sm shadow-inner"
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1DB954] text-black font-bold py-4 rounded-full hover:scale-[1.02] transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-x-2 shadow-xl mt-4"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Save Song to Tuneify'}
          </button>
        </form>
      </div>
      
      <div className="mt-8 text-center text-gray-500 text-xs max-w-md">
        Tip: You can use direct links from Cloudinary, Imgur, or any public file host. 
        Make sure the audio link ends in <span className="text-white italic">.mp3</span>.
      </div>
    </div>
  );
}
