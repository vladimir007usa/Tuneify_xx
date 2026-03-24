'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Music } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push('/');
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password login is currently disabled for this Tuneify instance. Please use Google Auth below.');
      } else {
        setError(err.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Google Auth failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="w-full max-w-[734px] bg-black rounded-lg p-12 sm:p-16 flex flex-col items-center">
        {/* Header Logo */}
        <div className="mb-8 text-white flex justify-center">
          <Music size={46} className="text-white" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-10 text-center">
          {isLogin ? 'Welcome back' : 'Sign up to start listening'}
        </h1>

        {error && (
          <div className="bg-[#e22134] text-white text-[13px] font-bold py-3 px-4 rounded-md w-full max-w-[324px] mb-6 flex items-center gap-x-2">
            <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current"><path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path><path d="M7.25 12.026v-1.5h1.5v1.5h-1.5zm.884-7.096A1.125 1.125 0 0 0 7.25 6v3.224h1.5V5.932a.125.125 0 0 1 .116-.125h.26v-1.5h-.992z"></path></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="w-full max-w-[324px] flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-1.5">
            <label className="text-white text-sm font-bold">Email or username</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email or username"
              className="bg-[#121212] border border-[#727272] hover:border-white focus:border-white focus:ring-0 text-white rounded-[4px] px-3.5 py-3 transition-colors focus:outline-none placeholder:text-gray-400 font-semibold"
            />
          </div>

          <div className="flex flex-col gap-y-1.5">
            <label className="text-white text-sm font-bold">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="bg-[#121212] border border-[#727272] hover:border-white focus:border-white focus:ring-0 text-white rounded-[4px] px-3.5 py-3 transition-colors focus:outline-none placeholder:text-gray-400 font-semibold"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 active:scale-95 text-black font-bold tracking-wide rounded-full py-3.5 mt-4 transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div className="flex items-center gap-x-4 w-full max-w-[324px] mt-8 mb-8">
          <div className="flex-1 h-[1px] bg-[#292929]"></div>
          <span className="text-white flex-shrink-0 font-medium tracking-widest text-[11px] uppercase">or</span>
          <div className="flex-1 h-[1px] bg-[#292929]"></div>
        </div>

        <div className="w-full max-w-[324px] flex flex-col gap-y-3">
          <button 
            onClick={handleGoogleAuth}
            className="w-full border border-[#878787] hover:border-white rounded-full py-2.5 flex items-center justify-center gap-x-2 transition-colors group"
          >
            <svg width="24" height="24" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path fill="none" d="M1 1h22v22H1z"/></svg>
            <span className="text-white font-bold text-[15px]">Continue with Google</span>
          </button>
        </div>

        <div className="mt-8 text-center text-gray-400 font-medium mb-10 w-full max-w-[324px]">
          <div className="bg-[#292929] h-[1px] w-full mb-8"></div>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-white font-bold hover:underline hover:text-[#1ed760] transition-colors"
          >
            {isLogin ? "Sign up for Tuneify" : "Log in here"}
          </button>
        </div>
      </div>
    </div>
  );
}
