'use client';

import { useState, useEffect, useRef } from 'react';

const BARS = [4, 18, 32, 12, 44, 6, 38, 22, 48, 8, 36, 14, 28, 6, 20, 40, 10, 30, 4];

const TEXT =
  'Patient John Doe, 34, presents with persistent headaches, fatigue, and intermittent dizziness over the past two weeks.';

export default function ZoovAnimation() {
  const [phase, setPhase] = useState(0); // 0 = wave, 1 = shimmer, 2 = typewriter
  const [charCount, setCharCount] = useState(0);
  const timers = useRef([]);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;

    const clear = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };

    const t = (fn, ms) => {
      const id = setTimeout(() => alive.current && fn(), ms);
      timers.current.push(id);
    };

    const cycle = () => {
      clear();
      setPhase(0);
      setCharCount(0);

      // wave → shimmer
      t(() => setPhase(1), 3000);

      // shimmer → typewriter
      t(() => {
        setPhase(2);
        for (let i = 0; i <= TEXT.length; i++) {
          t(() => setCharCount(i), i * 25);
        }
      }, 4600);

      // hold → restart
      t(cycle, 4600 + TEXT.length * 25 + 2000);
    };

    cycle();
    return () => {
      alive.current = false;
      clear();
    };
  }, []);

  return (
    <div className="size-full bg-black relative overflow-hidden">
      <div className="absolute bottom-5 right-5 flex flex-col items-end">
        {/* Waveform */}
        <div
          className="flex items-end gap-[2.5px]"
          style={{
            opacity: phase === 0 ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          {BARS.map((h, i) => (
            <div
              key={i}
              className="zoov-bar rounded-full"
              style={{
                '--bar-h': `${h}px`,
                '--i': `${i * 0.06}s`,
                width: h <= 6 ? '3px' : '3.5px',
                animationPlayState: phase === 0 ? 'running' : 'paused',
              }}
            />
          ))}
        </div>

        {/* Shimmer */}
        <div
          className="absolute bottom-0 right-0"
          style={{
            opacity: phase === 1 ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          <span className="shimmer-text text-[11px] tracking-[0.15em] font-medium uppercase">
            Transcribing
          </span>
        </div>

        {/* Typewriter */}
        <div
          className="absolute bottom-0 right-0 w-[60vw] max-w-[320px] text-right"
          style={{
            opacity: phase === 2 ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        >
          <p className="text-[11px] leading-relaxed text-white/60 font-mono whitespace-normal">
            {TEXT.slice(0, charCount)}
          </p>
        </div>
      </div>
    </div>
  );
}
