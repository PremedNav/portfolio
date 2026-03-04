'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import { TiLocationArrow } from 'react-icons/ti';

export default function RecommendationPage() {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Thankyou!') {
      setError(false);
      setUnlocked(true);
    } else {
      setError(true);
      setToast(true);
    }
  };

  if (!unlocked) {
    return (
      <div className="relative min-h-screen w-screen bg-black">
        <NavBar />
        <div
          className={`fixed bottom-8 left-1/2 z-[200] -translate-x-1/2 rounded-lg bg-red-500/90 px-5 py-3 font-robert-regular text-sm text-white shadow-lg backdrop-blur-sm transition-all duration-300 ${toast ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}
        >
          Incorrect password. Please try again.
        </div>
        <div className="flex h-screen items-center justify-center px-6">
          <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col items-center gap-6">
            <h1 className="font-fk-screamer text-3xl font-black uppercase text-white">
              Password Required
            </h1>
            <p className="font-robert-regular text-sm text-white/40 text-center">
              Enter the password to view the material.
            </p>
            <input
              type="text"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter password"
              className={`w-full rounded-lg bg-white/5 px-4 py-3 font-robert-regular text-sm text-white outline-none ring-1 transition-all duration-200 placeholder:text-white/20 ${error ? 'ring-red-500 focus:ring-red-500' : 'ring-white/10 focus:ring-yellow-300/50'}`}
              autoFocus
            />
            <Button
              title="Unlock"
              containerClass="w-full !rounded-lg bg-yellow-300 flex-center gap-1"
            />
          </form>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-screen flex-col bg-black">
      <NavBar />
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-20">
        <h1 className="font-fk-screamer text-4xl font-black uppercase text-white mb-10">
          Recommendation Letter Material
        </h1>
        <div className="w-full max-w-2xl rounded-lg bg-white/5 p-8 font-robert-regular text-sm leading-relaxed text-white/70 ring-1 ring-white/10">
          <p>Recommendation letter content goes here.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
