'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { TiLocationArrow, TiLocation } from 'react-icons/ti';
import Button from '@/components/Button';

const WIDGETS = [
  { src: '/widgets/dna.html', title: 'DNA Helix', label: 'Game of Life' },
  { src: '/widgets/quantum.html', title: 'Quantum Network', label: 'Quantum Network' },
  { src: '/widgets/blackhole.html', title: 'Black Hole', label: 'Black Hole' },
  { src: '/widgets/neuron.html', title: 'Neuron', label: 'Neural Synapse' },
  { src: '/widgets/morphology.html', title: 'Particle Morphology', label: 'Morphology' },
] as const;

const HelmetReveal = dynamic(() => import('@/components/HelmetReveal'), {
  ssr: false,
});

export default function TestHeroPage() {
  const [coloradoTime, setColoradoTime] = useState('');
  const [dark, setDark] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      setColoradoTime(
        new Date().toLocaleTimeString('en-US', {
          timeZone: 'America/Denver',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Animate in hero text
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    gsap.set('.th-heading', { opacity: 1 });
    tl.fromTo(
      '.th-heading',
      { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)', y: 20 },
      { clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)', y: 0, duration: 0.8, stagger: 0.1, ease: 'power4.out' }
    );

    tl.fromTo(
      '.th-sub',
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' },
      '-=0.3'
    );
  }, []);


  // Broadcast theme to widget iframes + respond to late-loading widgets
  useEffect(() => {
    const msg = { theme: dark ? 'dark' : 'light' };

    // Send to all already-loaded iframes
    const iframes = document.querySelectorAll<HTMLIFrameElement>('iframe[data-widget]');
    iframes.forEach((f) => f.contentWindow?.postMessage(msg, '*'));

    // Listen for widgets that finish loading their JS later
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'widget-ready' && e.source) {
        (e.source as WindowProxy).postMessage(msg, '*');
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [dark]);

  return (
    <div
      ref={heroRef}
      className={`relative h-dvh w-screen overflow-hidden transition-colors duration-700 ${
        dark ? 'bg-[#1c1f26]' : 'bg-[#f0ede6]'
      }`}
    >
      {/* Theme toggle — top left */}
      <button
        onClick={() => setDark((d) => !d)}
        className={`absolute left-5 top-5 z-[20] flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-500 ${
          dark
            ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
            : 'border-[#1a1a1a]/15 bg-[#1a1a1a]/5 text-[#1a1a1a] hover:bg-[#1a1a1a]/10'
        }`}
        aria-label="Toggle theme"
      >
        {dark ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>

      {/* Three.js Helmet Reveal */}
      <HelmetReveal dark={dark} />

      {/* 5 Static 3D Widgets — arc above the head */}
      {WIDGETS.map((w, i) => {
        const positions = [
          { top: '50%', left: '-2%',  ty: '-50%' },  // left side
          { top: '8%',  left: '10%' },                // top-left
          { top: '-2%', left: '50%', tx: '-50%' },    // top center
          { top: '8%',  right: '10%' },               // top-right
          { top: '50%', right: '-2%', ty: '-50%' },   // right side
        ];
        const p = positions[i];
        return (
          <div
            key={w.title}
            className="group absolute z-[12] pointer-events-auto w-[180px] h-[180px] sm:w-[280px] sm:h-[280px]"
            style={{
              top: p.top,
              left: p.left,
              right: p.right,
              transform: `translate(${p.tx || '0'}, ${p.ty || '0'})`,
            }}
          >
            <iframe
              src={w.src}
              data-widget
              className="absolute inset-0 w-full h-full"
              style={{
                background: 'transparent',
                border: 'none',
                WebkitMaskImage: 'radial-gradient(circle at center, black 25%, transparent 65%)',
                maskImage: 'radial-gradient(circle at center, black 25%, transparent 65%)',
              }}
              title={w.title}
              loading="lazy"
              allowTransparency
              onLoad={(e) => {
                (e.target as HTMLIFrameElement).contentWindow?.postMessage(
                  { theme: dark ? 'dark' : 'light' }, '*'
                );
              }}
            />
            {/* Curved arc label on hover */}
            <svg
              className="absolute left-0 w-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ top: '70%', height: '40px' }}
              viewBox="0 0 200 40"
              overflow="visible"
            >
              <defs>
                <path
                  id={`arc-${i}`}
                  d="M 20,5 A 100,100 0 0,0 180,5"
                  fill="none"
                />
              </defs>
              <text
                className="select-none"
                fill={dark ? 'rgba(232,230,225,0.7)' : 'rgba(26,26,26,0.7)'}
                fontSize="11"
                fontWeight="600"
                letterSpacing="0.15em"
                textAnchor="middle"
              >
                <textPath href={`#arc-${i}`} startOffset="50%">
                  {w.label.toUpperCase()}
                </textPath>
              </text>
            </svg>
          </div>
        );
      })}

      {/* Hero content overlay */}
      <div className="absolute bottom-8 left-0 z-[15] px-5 sm:px-10">
        <h1
          className={`th-heading special-font hero-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl transition-colors duration-700 ${
            dark ? 'text-[#e8e6e1]' : 'text-[#1a1a1a]'
          }`}
          style={{ opacity: 0 }}
        >
          Navtej Singh
        </h1>

        <p
          className={`th-sub mt-3 text-sm font-semibold uppercase tracking-[0.2em] transition-colors duration-700 ${
            dark ? 'text-[#e8e6e1]/60' : 'text-[#1a1a1a]/60'
          }`}
          style={{ opacity: 0 }}
        >
          Software Architect &nbsp;|&nbsp; Pre-Med
        </p>

        <p
          className={`th-sub mt-2 flex items-center gap-3 text-xs transition-colors duration-700 ${
            dark ? 'text-[#e8e6e1]/50' : 'text-[#1a1a1a]/50'
          }`}
          style={{ opacity: 0 }}
        >
          <span className="flex items-center gap-1.5">
            <TiLocation className="text-sm" />
            Colorado, USA
          </span>
          {coloradoTime && <span>{coloradoTime}</span>}
        </p>

        <p
          className={`th-sub mt-5 max-w-sm font-robert-regular text-sm leading-relaxed transition-colors duration-700 ${
            dark ? 'text-[#e8e6e1]/50' : 'text-[#1a1a1a]/50'
          }`}
          style={{ opacity: 0 }}
        >
          Hi! I&apos;m a 20-year-old pre-med student and software architect,
          programming since I was 6. I build medical AI platforms, ML
          infrastructure, and distributed systems.
        </p>

        <div className="th-sub mt-5" style={{ opacity: 0 }}>
          <a href="mailto:navmainemail@gmail.com">
            <Button
              id="test-hero-cta"
              title="Get in touch"
              leftIcon={<TiLocationArrow />}
              containerClass="bg-yellow-300 flex-center gap-1"
            />
          </a>
        </div>
      </div>

      {/* Hint text */}
      <div
        className="th-sub absolute bottom-8 right-8 z-[15] hidden sm:block"
        style={{ opacity: 0 }}
      >
        <p
          className={`text-right text-[10px] font-medium uppercase tracking-[0.25em] transition-colors duration-700 ${
            dark ? 'text-[#e8e6e1]/25' : 'text-[#1a1a1a]/25'
          }`}
        >
          Move your cursor to reveal
        </p>
      </div>

    </div>
  );
}
