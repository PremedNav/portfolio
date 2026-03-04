'use client';

import NavBar from '@/components/Navbar';
import Button from '@/components/Button';
import { TiLocationArrow } from 'react-icons/ti';

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-screen bg-black">
      <NavBar />
      <div className="flex h-screen flex-col items-center justify-center gap-6 px-6">
        <h1
          className="font-fk-screamer font-black uppercase text-white leading-none"
          style={{ fontSize: 'clamp(6rem, 20vw, 16rem)' }}
        >
          404
        </h1>
        <p className="font-robert-regular text-sm text-white/40">
          This page doesn&apos;t exist.
        </p>
        <a href="/">
          <Button
            title="Back to home"
            leftIcon={<TiLocationArrow />}
            containerClass="mt-4 cursor-pointer bg-yellow-300 flex-center gap-1"
          />
        </a>
      </div>
    </div>
  );
}
