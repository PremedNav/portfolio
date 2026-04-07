'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useGSAP } from '@gsap/react';
import { TiLocationArrow } from 'react-icons/ti';
import { LAB_EXPERIMENTS } from '@/lib/lab';
import { generateLabCardArt } from '@/lib/lab-art';

gsap.registerPlugin(ScrollTrigger);

const PREVIEW_EXPERIMENTS = LAB_EXPERIMENTS.slice(0, 3);

function ArrowIcon({ size = 13, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 8h9M8.5 4l4 4-4 4" />
    </svg>
  );
}

const LabCard = ({ experiment }) => {
  return (
    <Link href={`/lab/${experiment.slug}`}>
      <article
        className="lab-card group relative rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-end transition-all duration-300 hover:scale-[1.012] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
        style={{ minHeight: '380px' }}
      >
        {/* Gradient — 2x wide, slides on hover */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: generateLabCardArt(experiment.slug, experiment.tags) }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 3px)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent pointer-events-none" />
        <div className="relative z-10 p-5 md:p-6">
          <h3
            className="text-[1.15rem] md:text-xl lg:text-[1.3rem] text-white leading-snug tracking-[-0.01em] mb-6 transition-transform duration-300 group-hover:translate-y-[-2px]"
            style={{ fontFamily: "'robert-medium', 'general', 'General Sans', sans-serif" }}
          >
            {experiment.title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {experiment.tags.map((tag) => (
                <span key={tag} className="text-[12px] text-white/60">{tag}</span>
              ))}
              <span className="text-[12px] text-white/40">· Interactive</span>
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/25 transition-all duration-300 group-hover:bg-white group-hover:border-white">
              <ArrowIcon className="text-white group-hover:text-[#181816] transition-all duration-300 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

const Lab = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'restart none none reset',
      },
    });

    tl.fromTo(
      '.lab-block',
      { x: '0%' },
      { x: '101%', duration: 0.7, stagger: 0.12, ease: 'power3.inOut' },
      0.2
    );

    const cards = sectionRef.current.querySelectorAll('.lab-card');
    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'restart none none reset',
          },
        }
      );
    });
  }, { scope: sectionRef });

  return (
    <section id="lab" ref={sectionRef} className="bg-[#f8f8f6] pb-32 pt-10">
      <div className="container mx-auto px-3 md:px-10">
        {/* Dashed divider */}
        <div className="mx-5 mb-20 border-t border-dashed border-[#d0d0c6]" />

        {/* Title — yellow reveal blocks */}
        <div className="px-5 pb-16">
          <div className="relative overflow-hidden inline-block">
            <span className="lab-block absolute -inset-1 bg-yellow-300" />
            <p className="font-circular-web text-lg text-[#181816]">
              The Lab
            </p>
          </div>
          <div className="relative overflow-hidden mt-1 max-w-md">
            <span className="lab-block absolute -inset-1 bg-yellow-300" />
            <p className="font-circular-web text-lg text-[#8a8a7e]">
              Interactive toys I build for fun and to explain concepts to
              others. Click into any to play with it.
            </p>
          </div>

          <Link href="/lab" className="group relative mt-8 inline-block cursor-pointer">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 56" preserveAspectRatio="none">
              <path
                d="M8,2 L170,2 Q185,2 190,10 L198,42 Q200,50 192,54 L24,54 Q10,54 6,46 L2,14 Q0,6 8,2 Z"
                className="fill-yellow-300"
              />
            </svg>
            <span className="relative z-10 flex items-center gap-2 px-7 py-3 font-general text-xs uppercase text-black">
              <TiLocationArrow />
              <span className="relative inline-flex overflow-hidden">
                <span className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
                  Explore all experiments
                </span>
                <span className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                  Explore all experiments
                </span>
              </span>
            </span>
          </Link>
        </div>

        {/* Card grid — 3 preview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 px-5">
          {PREVIEW_EXPERIMENTS.map((experiment) => (
            <LabCard key={experiment.slug} experiment={experiment} />
          ))}
        </div>

        {/* View more — stretched card */}
        <div className="lab-card px-5 mt-4 md:mt-5">
          <Link href="/lab" className="group block">
            <div className="relative rounded-2xl border border-dashed border-[#c8c8bc] overflow-hidden px-6 py-5 flex items-center justify-between transition-all duration-300 hover:border-[#181816]/30 hover:bg-[#f0f0ec]">
              <div className="flex items-center gap-3">
                <span className="font-circular-web text-[15px] text-[#181816]">
                  Explore all experiments
                </span>
                <span className="font-circular-web text-[13px] text-[#8a8a7e]">
                  — {LAB_EXPERIMENTS.length - 3} more to play with
                </span>
              </div>
              <div className="flex items-center justify-center w-8 h-8 rounded-full border border-[#c8c8bc] transition-all duration-300 group-hover:bg-[#181816] group-hover:border-[#181816]">
                <ArrowIcon size={12} className="text-[#8a8a7e] transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Lab;
