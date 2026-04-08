'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useGSAP } from '@gsap/react';
import { TiLocationArrow } from 'react-icons/ti';
import { generateCardArt } from '@/lib/blog-art';

gsap.registerPlugin(ScrollTrigger);

const PREVIEW_POSTS = [
  {
    title: 'Building Medical AI: A Complete Guide To Pathology Slide Analysis',
    category: 'Research',
    readTime: '10 min read',
    slug: 'building-medical-ai',
  },
  {
    title: 'What Is Prompt Engineering? A Complete Guide From Definition To Production',
    category: 'Tips',
    readTime: '10 min read',
    slug: 'prompt-engineering',
  },
  {
    title: 'LLM Cost Optimization: Token Efficiency, Caching, and Prompt Design',
    category: 'Tips',
    readTime: '7 min read',
    slug: 'llm-cost-optimization',
  },
];

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

const BlogPreview = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // Title block-wipe reveal — identical to Features pattern
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'restart none none reset',
      },
    });

    tl.fromTo(
      '.bp-block',
      { x: '0%' },
      { x: '101%', duration: 0.7, stagger: 0.12, ease: 'power3.inOut' },
      0.2
    );

    // Cards fade / rise
    const cards = sectionRef.current.querySelectorAll('.bp-card');
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
    <section ref={sectionRef} className="pb-32 pt-10">
      <div className="container mx-auto px-3 md:px-10">
        {/* Dashed divider */}
        <div className="mx-5 mb-20 border-t border-dashed border-[#262624]" />

        {/* Title — yellow reveal blocks, same structure as Features */}
        <div className="px-5 pb-16">
          <div className="relative overflow-hidden inline-block">
            <span className="bp-block absolute -inset-1 bg-yellow-300" />
            <p className="font-circular-web text-lg text-[#fffffc]">
              From the Blog
            </p>
          </div>
          <div className="relative overflow-hidden mt-1 max-w-md">
            <span className="bp-block absolute -inset-1 bg-yellow-300" />
            <p className="font-circular-web text-lg text-[#7f7f73]">
              Writing about medical AI, ML infrastructure, and lessons from
              building things that matter.
            </p>
          </div>

          <Link href="/blog" className="group relative mt-8 inline-block cursor-pointer">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 56" preserveAspectRatio="none">
              <path
                d="M8,2 L170,2 Q185,2 190,10 L198,42 Q200,50 192,54 L24,54 Q10,54 6,46 L2,14 Q0,6 8,2 Z"
                className="fill-yellow-300"
              />
            </svg>
            <span className="relative z-10 flex items-center gap-2 px-7 py-3 font-general text-xs uppercase text-black">
              <TiLocationArrow />
              <span className="relative inline-flex overflow-hidden leading-tight py-px">
                <span className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
                  View all posts
                </span>
                <span className="absolute inset-0 translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                  View all posts
                </span>
              </span>
            </span>
          </Link>
        </div>

        {/* Cards — matches blog main page */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 px-5">
          {PREVIEW_POSTS.map((post, i) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article
                className="bp-card group relative rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-end transition-all duration-300 hover:scale-[1.012] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                style={{
                  background: generateCardArt(post.slug, post.category),
                  minHeight: '380px',
                }}
              >
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
                    className="text-[1.15rem] md:text-xl lg:text-[1.3rem] text-white leading-snug tracking-[-0.01em] mb-6 transition-all duration-300 group-hover:translate-y-[-2px] group-hover:text-[#c0c0b4]"
                    style={{ fontFamily: "'robert-medium', 'general', 'General Sans', sans-serif" }}
                  >
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-white/60">{post.readTime}</span>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/25 transition-all duration-300 group-hover:bg-white group-hover:border-white">
                      <ArrowIcon className="text-white group-hover:text-[#21211f] transition-all duration-300 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* View more — stretched card */}
        <div className="bp-card px-5 mt-4 md:mt-5">
          <Link href="/blog" className="group block">
            <div className="relative rounded-2xl border border-dashed border-[#262624] overflow-hidden px-6 py-5 flex items-center justify-between transition-all duration-300 hover:border-[#fffffc]/30 hover:bg-[#2a2a28]">
              <div className="flex items-center gap-3">
                <span className="font-circular-web text-[15px] text-[#fffffc]">
                  Read all posts
                </span>
                <span className="font-circular-web text-[13px] text-[#7f7f73]">
                  — deep dives, breakdowns, and things I've learned
                </span>
              </div>
              <div className="flex items-center justify-center w-8 h-8 rounded-full border border-[#262624] transition-all duration-300 group-hover:bg-[#fffffc] group-hover:border-[#fffffc]">
                <ArrowIcon size={12} className="text-[#7f7f73] transition-all duration-300 group-hover:text-[#21211f] group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default BlogPreview;
