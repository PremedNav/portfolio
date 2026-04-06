'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import NavBar from '@/components/Navbar'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { generateCardArt, generateHeroArt } from '@/lib/blog-art'

gsap.registerPlugin(ScrollTrigger)

// ─── Types ──────────────────────────────────────────────────────────────────────

interface Post {
  id: number
  title: string
  date: string
  readTime: string
  category: string
  featured?: boolean
  slug: string
}

// ─── Data ───────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: 'All', count: 12 },
  { name: 'Case Studies', count: 2 },
  { name: 'Product', count: 1 },
  { name: 'Research', count: 4 },
  { name: 'Tutorials', count: 2 },
  { name: 'Tips', count: 3 },
]

const POSTS: Post[] = [
  {
    id: 1,
    title: 'Building Medical AI: A Complete Guide To Pathology Slide Analysis',
    date: 'March 28, 2026',
    readTime: '10 min read',
    category: 'Research',
    featured: true,
    slug: 'building-medical-ai',
  },
  {
    id: 2,
    title: 'What Is Prompt Engineering? A Complete Guide From Definition To Production',
    readTime: '10 min read',
    date: 'March 20, 2026',
    category: 'Tips',
    slug: 'prompt-engineering',
  },
  {
    id: 3,
    title: 'LLM Cost Optimization: Token Efficiency, Caching, and Prompt Design',
    readTime: '7 min read',
    date: 'March 15, 2026',
    category: 'Tips',
    slug: 'llm-cost-optimization',
  },
  {
    id: 4,
    title: 'What Is Eval-Driven Development? How to Ship AI Features Without Guessing',
    readTime: '7 min read',
    date: 'March 10, 2026',
    category: 'Tutorials',
    slug: 'eval-driven-development',
  },
  {
    id: 5,
    title: 'Training a 12-Billion Parameter Model: Architecture Decisions and Tradeoffs',
    readTime: '12 min read',
    date: 'March 5, 2026',
    category: 'Case Studies',
    slug: 'training-12b-model',
  },
  {
    id: 6,
    title: 'Biochemical Pathway Discovery: Cross-Referencing Research Papers With AI',
    readTime: '8 min read',
    date: 'February 28, 2026',
    category: 'Research',
    slug: 'biochemical-pathway-discovery',
  },
  {
    id: 7,
    title: 'Building PreMeder: From Personal Frustration to 12,000 Users',
    readTime: '9 min read',
    date: 'February 20, 2026',
    category: 'Case Studies',
    slug: 'building-premeder',
  },
  {
    id: 8,
    title: 'Designing a Programming Language for Machine Learning From Scratch',
    readTime: '11 min read',
    date: 'February 15, 2026',
    category: 'Research',
    slug: 'designing-ml-language',
  },
  {
    id: 9,
    title: 'The Pre-Med Tech Stack: Tools Every Applicant Should Know About',
    readTime: '6 min read',
    date: 'February 10, 2026',
    category: 'Tips',
    slug: 'premed-tech-stack',
  },
  {
    id: 10,
    title: 'Getting Started with Medical Image Classification Using Deep Learning',
    readTime: '8 min read',
    date: 'February 5, 2026',
    category: 'Tutorials',
    slug: 'medical-image-classification',
  },
  {
    id: 11,
    title: 'Phage Therapy and Computational Biology: Where Lab Meets Code',
    readTime: '9 min read',
    date: 'January 28, 2026',
    category: 'Research',
    slug: 'phage-therapy-computational',
  },
  {
    id: 12,
    title: 'Building Real-Time Data Pipelines: From Research to Production',
    readTime: '7 min read',
    date: 'January 20, 2026',
    category: 'Product',
    slug: 'realtime-data-pipelines',
  },
]

// ─── Component ──────────────────────────────────────────────────────────────────

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const pageRef = useRef<HTMLDivElement>(null)
  const featuredLeftRef = useRef<HTMLDivElement>(null)
  const featuredArtRef = useRef<HTMLDivElement>(null)
  const borderRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLElement>(null)

  const featuredPost = POSTS.find((p) => p.featured)
  const gridPosts =
    activeCategory === 'All'
      ? POSTS.filter((p) => !p.featured)
      : POSTS.filter((p) => p.category === activeCategory && !p.featured)

  // GSAP entrance animations
  useGSAP(
    () => {
      // Prevent vertical scrollbar flash during entrance animation
      const page = pageRef.current
      if (page) page.style.overflow = 'clip'

      const tl = gsap.timeline({
        onComplete: () => { if (page) page.style.overflow = '' },
      })

      // 1. Featured left — smooth slide up with gentle blur clear
      tl.fromTo(
        featuredLeftRef.current,
        { opacity: 0, y: 50, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out' },
        0.05
      )

      // 2. Art panel — scale settle with soft reveal
      tl.fromTo(
        featuredArtRef.current,
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' },
        0.1
      )

      // 3. Divider line draws across
      tl.fromTo(
        borderRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: 'power3.inOut' },
        0.4
      )

      // 4. Filter pills — gentle stagger from center
      const pills = filtersRef.current?.querySelectorAll('button')
      if (pills?.length) {
        tl.fromTo(
          pills,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.5,
            stagger: { each: 0.04, from: 'center' },
            ease: 'expo.out' },
          0.55
        )
      }

      // 5. Grid cards — smooth rise with subtle scale
      const cards = gridRef.current?.querySelectorAll('.blog-card')
      if (cards?.length) {
        tl.fromTo(
          cards,
          { opacity: 0, y: 60, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 1,
            stagger: { each: 0.08, grid: [3, 4], from: 'start' },
            ease: 'expo.out' },
          0.65
        )
      }
    },
    { scope: pageRef }
  )

  return (
    <div ref={pageRef} className="relative min-h-screen bg-[#f8f8f6]">
      <NavBar variant="light" />

      <main>
        {/* ── Featured Post ──────────────────────────────────────────────── */}
        {featuredPost && (
          <Link href={`/blog/${featuredPost.slug}`}>
            <section className="flex flex-col md:flex-row group cursor-pointer overflow-hidden pt-24">
              <div ref={featuredLeftRef} className="flex-1 flex flex-col justify-between px-8 md:px-14 lg:px-16 pt-10 pb-10 md:pt-14 md:pb-14" style={{ opacity: 0 }}>
                <div>
                  <div className="flex items-center gap-3 mb-8 md:mb-10">
                    <span className="text-[13px] font-semibold tracking-wide text-[#4a6741]">
                      Featured
                    </span>
                    <span className="text-[13px] text-[#8a8a7e]">
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <h1
                    className="text-[2rem] md:text-[2.75rem] lg:text-[3.25rem] leading-[1.08] tracking-[-0.025em] text-[#181816] max-w-[580px] group-hover:text-[#3a3a2e] transition-colors"
                    style={{ fontFamily: "'robert-medium', 'general', 'General Sans', sans-serif" }}
                  >
                    {featuredPost.title}
                  </h1>
                </div>
                <div className="flex items-center justify-between mt-14 md:mt-0 pt-8">
                  <span className="text-[13px] text-[#8a8a7e]">
                    Posted {featuredPost.date}
                  </span>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#d0d0c6] group-hover:bg-[#181816] group-hover:border-[#181816] transition-all duration-300">
                    <ArrowIcon className="text-[#181816] group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>

              <div
                ref={featuredArtRef}
                className="flex-[1.2] min-h-[280px] md:min-h-[480px] relative overflow-hidden"
                style={{ background: generateHeroArt(featuredPost.slug, featuredPost.category), opacity: 0 }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,255,255,0.035) 3px, rgba(255,255,255,0.035) 4px)',
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'repeating-linear-gradient(90deg, transparent 0px, transparent 60px, rgba(0,0,0,0.012) 60px, rgba(0,0,0,0.012) 62px)',
                  }}
                />
              </div>
            </section>
          </Link>
        )}

        {/* Animated divider line */}
        <div ref={borderRef} className="h-px bg-[#d0d0c6] origin-left" style={{ transform: 'scaleX(0)' }} />

        {/* ── Category Filters ───────────────────────────────────────────── */}
        <nav ref={filtersRef} className="px-8 md:px-14 lg:px-16 py-5">
          <div className="flex items-center gap-1 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat.name
                    ? 'bg-[#181816] text-white'
                    : 'text-[#5a5a50] hover:text-[#181816]'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[11px] ${
                    activeCategory === cat.name ? 'text-white/50' : 'text-[#aaa89c]'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </nav>

        {/* ── Post Grid ──────────────────────────────────────────────────── */}
        <section ref={gridRef} className="px-8 md:px-14 lg:px-16 py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {gridPosts.map((post, i) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <article
                  className="blog-card group relative rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-end transition-all duration-300 hover:scale-[1.012] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
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
                    <h2
                      className="text-[1.15rem] md:text-xl lg:text-[1.3rem] text-white leading-snug tracking-[-0.01em] mb-6 transition-transform duration-300 group-hover:translate-y-[-2px]"
                      style={{ fontFamily: "'robert-medium', 'general', 'General Sans', sans-serif" }}
                    >
                      {post.title}
                    </h2>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-white/60">{post.readTime}</span>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/25 transition-all duration-300 group-hover:bg-white group-hover:border-white">
                        <ArrowIcon
                          size={13}
                          className="text-white group-hover:text-[#181816] transition-all duration-300 group-hover:translate-x-0.5"
                        />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Newsletter ──────────────────────────────────────────────────── */}
        <NewsletterSection />
      </main>

      <BlogFooter heroArt={generateHeroArt(featuredPost?.slug ?? 'blog', featuredPost?.category ?? 'Research')} />
    </div>
  )
}

// ─── Newsletter Section ─────────────────────────────────────────────────────────

function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [shake, setShake] = useState(false)
  const successRef = useRef<HTMLDivElement>(null)
  const checkRef = useRef<SVGPathElement>(null)

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const triggerError = (msg: string) => {
    setStatus('error')
    setErrorMsg(msg)
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()

    if (!trimmed) {
      triggerError('Enter your email to subscribe.')
      return
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      triggerError('That doesn\u2019t look like a valid email.')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setStatus('success')
        setEmail('')
      } else {
        triggerError(data.error || 'Something went wrong.')
      }
    } catch {
      triggerError('Connection failed. Try again.')
    }
  }

  // Animate success state
  useGSAP(() => {
    if (status !== 'success' || !successRef.current) return
    const tl = gsap.timeline()
    tl.fromTo(successRef.current, { opacity: 0, scale: 0.95, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' })
    if (checkRef.current) {
      const len = checkRef.current.getTotalLength()
      tl.fromTo(checkRef.current, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' }, 0.2)
    }
  }, { dependencies: [status] })

  return (
    <section className="px-8 md:px-14 lg:px-16 pb-16 pt-4">
      <div className="border-t border-dashed border-[#d0d0c6] pt-14">
        <div className="max-w-xl mx-auto text-center">
          <h2
            className="text-[1.6rem] md:text-[2rem] tracking-[-0.03em] text-[#181816] mb-3"
            style={{ fontFamily: "'robert-medium', 'general', sans-serif" }}
          >
            Stay in the loop
          </h2>
          <p className="text-[14px] text-[#8a8a7e] mb-8">
            Follow along as I explore the intersection of medicine, AI, and engineering.
          </p>

          {status === 'success' ? (
            <div ref={successRef} className="flex flex-col items-center gap-3 py-4" style={{ opacity: 0 }}>
              <div className="w-12 h-12 rounded-full bg-[#4a6741]/10 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a6741" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path ref={checkRef} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[15px] font-medium text-[#181816]">You&apos;re in!</p>
              <p className="text-[13px] text-[#8a8a7e]">I&apos;ll send you a note when something new drops.</p>
            </div>
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex gap-3 max-w-md mx-auto"
                style={shake ? { animation: 'headShake 0.4s ease-in-out' } : undefined}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status === 'error') { setStatus('idle'); setErrorMsg('') } }}
                  placeholder="your@email.com"
                  className={`flex-1 px-4 py-3 rounded-xl border bg-white text-[14px] text-[#181816] placeholder:text-[#b0b0a4] outline-none transition-all duration-200 ${
                    status === 'error' ? 'border-[#c4544d]/40 bg-[#fdf8f8]' : 'border-[#d0d0c6] focus:border-[#181816]'
                  }`}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-6 py-3 rounded-xl bg-[#181816] text-white text-[13px] font-medium tracking-wide hover:bg-[#2a2a24] active:scale-[0.97] transition-all duration-150 disabled:opacity-50 min-w-[105px] flex items-center justify-center"
                >
                  {status === 'loading' ? (
                    <span className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
              <div
                className={`overflow-hidden transition-all duration-250 ease-out ${
                  status === 'error' && errorMsg ? 'max-h-8 opacity-100 mt-2.5' : 'max-h-0 opacity-0 mt-0'
                }`}
              >
                <p className="text-[13px] text-[#c4544d]">{errorMsg}</p>
              </div>
              <p className="text-[12px] text-[#b0b0a4] mt-4">Just honest writing, straight from me. Unsubscribe anytime.</p>
            </>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes headShake {
          0% { transform: translateX(0); }
          15% { transform: translateX(-5px); }
          40% { transform: translateX(4px); }
          65% { transform: translateX(-2px); }
          85% { transform: translateX(1px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  )
}

// ─── Arrow Icon ─────────────────────────────────────────────────────────────────

function ArrowIcon({
  size = 15,
  className = '',
}: {
  size?: number
  className?: string
}) {
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
  )
}

// ─── Blog Footer ────────────────────────────────────────────────────────────────

const blogNavItems = ['Projects', 'Blog', 'Contact', 'Recommendation Letter']

function BlogFooter({ heroArt }: { heroArt: string }) {
  const footerRef = useRef<HTMLElement>(null)
  const logoRef = useRef<SVGSVGElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const loopRef = useRef<gsap.core.Timeline | null>(null)

  useGSAP(
    () => {
      const paths = logoRef.current?.querySelectorAll('.blog-footer-logo-path')
      if (!paths?.length) return

      const sorted = Array.from(paths).sort((a, b) => (a as SVGPathElement).getBBox().x - (b as SVGPathElement).getBBox().x)

      sorted.forEach((path) => {
        const len = (path as SVGPathElement).getTotalLength()
        gsap.set(path, {
          strokeDasharray: len,
          strokeDashoffset: len,
          fill: 'transparent',
          stroke: '#FFFFFF',
          strokeWidth: 12,
        })
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        onComplete: () => {
          const loop = gsap.timeline({ repeat: -1 })
          loop.to({}, { duration: 1.5 })
          loop.to(sorted, { opacity: 0, duration: 0.5, stagger: 0.04, ease: 'power2.in' })
          loop.to({}, { duration: 0.3 })
          loop.to(sorted, { opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power2.out' })
          loopRef.current = loop
        },
      })

      tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power3.inOut' }, 0)

      tl.to(sorted, {
        strokeDashoffset: 0,
        duration: 1,
        stagger: 0.04,
        ease: 'power2.inOut',
      }, 0.2)

      tl.to(sorted, {
        fill: '#FFFFFF',
        strokeWidth: 0,
        duration: 0.4,
        ease: 'power1.inOut',
      }, '-=0.2')

      tl.fromTo(contentRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')

      return () => {
        if (loopRef.current) loopRef.current.kill()
      }
    },
    { scope: footerRef }
  )

  return (
    <footer ref={footerRef} className="relative w-screen bg-[#f8f8f6] px-8 md:px-14 lg:px-16 pb-8 pt-4">
      <div
        className="mx-auto max-w-7xl rounded-2xl overflow-hidden relative px-6 pt-20 pb-8"
        style={{ background: heroArt }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 4px)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(220,215,200,0.3) 0%, transparent 60%)' }} />

        <div className="relative z-10">
          <div ref={lineRef} className="mb-14 h-px w-full origin-left bg-white/15" />

          <div className="flex justify-center">
            <svg
              ref={logoRef}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="250 1300 3550 700"
              fill="none"
              className="w-[280px] sm:w-[360px] md:w-[440px]"
            >
              <path className="blog-footer-logo-path" style={{ fill: 'none', stroke: 'none' }} d="M512.24 1564.06C530 1574.9 574.581 1611.12 592.507 1625.08L748.821 1746.89L889.945 1855.92C909.669 1871.18 947.692 1898.97 964.116 1915.04C949.944 1919.73 938.55 1924.51 924.907 1930.19C897.435 1942.41 870.983 1952.59 842.648 1963.53C733.978 1881.03 627.579 1794.6 518.336 1713.03C518.41 1664.72 513.29 1613.16 512.24 1564.06Z" />
              <path className="blog-footer-logo-path" style={{ fill: 'none', stroke: 'none' }} d="M471.978 1334.04C482.356 1339.12 540.027 1385.34 552.6 1395.05L699.421 1508.05C730.927 1532.41 765.217 1560.36 797.867 1583.28C800.833 1633.78 804.26 1684.26 808.15 1734.72C787.56 1719.87 768.809 1704.02 747.979 1689.09L479.055 1480.76C436.791 1448.15 392.158 1414.75 351.195 1381.37C391.357 1365.08 431.715 1350.04 471.978 1334.04Z" />
              <path className="blog-footer-logo-path" style={{ fill: 'none', stroke: 'none' }} d="M353.922 1442.17C392.245 1469.88 432.089 1502.9 470.268 1531.85L470.143 1865.03C451.092 1877.87 429.783 1895.69 412.204 1909.99C392.058 1925.6 372.897 1941.23 352.425 1956.73C354.905 1833.16 352.906 1703.41 352.765 1579.4L352.243 1494.39C352.151 1482.47 351.251 1452.54 353.922 1442.17Z" />
              <path className="blog-footer-logo-path" style={{ fill: 'none', stroke: 'none' }} d="M962.201 1345.4C965.042 1349.45 963.332 1456.16 963.284 1468.26C962.418 1596.83 962.857 1725.41 964.6 1853.97L908.732 1810.89C889.138 1795.08 867.859 1779.14 847.742 1763.69L847.723 1433.45C885.626 1403.89 923.786 1374.54 962.201 1345.4Z" />
              <path className="blog-footer-logo-path" style={{ fill: 'none', stroke: 'none' }} d="M1274.05 1345.03L1401.39 1344.98C1418.62 1391 1448.48 1453.32 1468.91 1500.28L1617.22 1838.88C1634.27 1878.26 1651.96 1916.46 1668.19 1956.16C1625.97 1940.56 1576.21 1918.85 1534.4 1901.22C1526.04 1897.52 1518.71 1893.59 1510.72 1889.42C1499.41 1864.66 1488.29 1839.84 1477.36 1814.97L1230.09 1815.42C1248.75 1776.96 1262.98 1737.15 1281.7 1698.12C1330.46 1698.44 1379.22 1698.41 1427.98 1698.02C1408.99 1658.92 1391.7 1614.16 1374.31 1574.3C1340.3 1498.04 1306.88 1421.62 1274.05 1345.03Z" />
              <path className="blog-footer-logo-path" style={{ fill: 'none', stroke: 'none' }} d="M1254.67 1385.26C1258.63 1388.25 1312.98 1515.02 1319.26 1529.02C1302.82 1559.69 1281.21 1616.39 1267.01 1649.74L1164.06 1889.78C1137.05 1904.77 1080.73 1925.02 1048.72 1939.34C1035.07 1945.51 1018.79 1951.09 1004.36 1956.34C1018.25 1929.12 1031.91 1895.13 1044.01 1867.01L1097.75 1743.73L1254.67 1385.26Z" />
              <path className="blog-footer-logo-path" style={{ fill: 'none', stroke: 'none' }} d="M1545.24 1344.49C1564.74 1349.33 1595.47 1364.17 1614.3 1372.16C1643.96 1384.74 1675.16 1397.08 1703.89 1410.76C1728.8 1464.46 1754.03 1528.71 1777.19 1583.73L1871.29 1802.6C1891.07 1848.92 1915.05 1910.39 1937.93 1954.69L1809.49 1955C1718.64 1753.32 1636.63 1546.14 1545.24 1344.49Z" />
              <path className="blog-footer-logo-path" style={{ fill: 'none', stroke: 'none' }} d="M2199.38 1345.47L2201.64 1345.8L2202.67 1347.47C2197.03 1363.17 2188.65 1379.79 2181.99 1395.6L2128.1 1521.33L1956.26 1919.96C1951.95 1907.59 1947.5 1897.63 1941.98 1885.52C1925.88 1847.78 1909.49 1810.12 1892.81 1772.54C1932.85 1685.45 1967.01 1594.66 2005.86 1507.08C2018.09 1479.51 2032.39 1435.38 2047.95 1410.22C2067.74 1399.81 2094.71 1389.85 2115.85 1380.72C2143.34 1368.85 2171.17 1355.93 2199.38 1345.47Z" />
              <path className="blog-footer-logo-path" style={{ fill: 'none', stroke: 'none' }} d="M2573.36 1344.53C2631.39 1345.74 2703.55 1345.78 2761.66 1344.65C2737.82 1383.88 2709.63 1424.53 2683.94 1463.25L2549.82 1462.71L2549.86 1870.26L2530.66 1883.56C2497.02 1906.86 2464.28 1933.56 2430.55 1955.66L2430.09 1486.61C2443.63 1470.57 2563.48 1349.1 2573.36 1344.53Z" />
              <path className="blog-footer-logo-path" style={{ fill: 'none', stroke: 'none' }} d="M2521.87 1344.69L2523.18 1345.15C2523.15 1350.26 2422.37 1449.15 2408.22 1463.51C2347.74 1461.95 2281.15 1462.84 2220.32 1462.72L2218.9 1462.01L2218.09 1459.22C2241.9 1428.13 2270.36 1378.84 2293.62 1344.88C2369.7 1345.22 2445.79 1345.15 2521.87 1344.69Z" />
              <path className="blog-footer-logo-path" style={{ fill: 'none', stroke: 'none' }} d="M2921.35 1345.01C3031.62 1342.09 3158.5 1345.54 3270.43 1344.88C3247.73 1383.55 3220.2 1424.61 3195.9 1463.06L2923.06 1462.89L2922.65 1492.02L2922.52 1560.92C2883.14 1601.05 2841.64 1641.3 2801.53 1681.06C2802.84 1609.37 2801.82 1535.41 2801.9 1463.54C2842.05 1424.25 2881.87 1384.74 2921.35 1345.01Z" />
              <path className="blog-footer-logo-path" style={{ fill: 'none', stroke: 'none' }} d="M2938.03 1590.47C3023.85 1591.65 3112.59 1590.66 3198.72 1590.52C3177.2 1627.47 3146.58 1672.21 3123.02 1709.05L2922.76 1709.44C2922.47 1751.83 2922.49 1794.22 2922.82 1836.61C3012.59 1835.39 3106.39 1836.47 3196.44 1836.57C3205.83 1850.88 3215.08 1866.21 3224.16 1880.73C3236.7 1902.97 3256.48 1930.99 3270.66 1954.76C3156.97 1953.27 3037.47 1954.83 2923.22 1954.63C2908.08 1941.48 2888.72 1920.81 2874.28 1906.49C2850.23 1882.63 2825.01 1858.17 2801.68 1833.95C2802.29 1798.7 2801.78 1762.36 2801.79 1727.03C2838.96 1685.26 2896.53 1631.59 2938.03 1590.47Z" />
              <path className="blog-footer-logo-path" style={{ fill: 'none', stroke: 'none' }} d="M3375.27 1345.04L3714.12 1344.94L3714.53 1345.15L3715.08 1347.39C3686.9 1379.81 3632.03 1431.44 3600.25 1463.48C3551.8 1462.72 3503.34 1462.64 3454.89 1463.23C3445.82 1450.09 3436.95 1436.86 3428.29 1423.55C3417.33 1403.97 3389.01 1363.81 3375.27 1345.04Z" />
              <path className="blog-footer-logo-path" style={{ fill: 'none', stroke: 'none' }} d="M3417.56 1738.45C3420.54 1740.72 3421.38 1781.8 3422.95 1789.88C3441.75 1806.48 3462.51 1831.79 3490.28 1834.48C3527.52 1838.08 3563.41 1842.7 3595.39 1826.16C3594.97 1849.91 3594.88 1873.65 3595.13 1897.39C3575.27 1915.79 3555.81 1935.81 3536.77 1954.86L3500.19 1954.82C3475.55 1954.84 3450.91 1954.55 3426.27 1953.94C3418.27 1948.74 3410.6 1943.22 3403.29 1937.4C3376.09 1915.77 3324.5 1872.98 3309.76 1844.46C3305.3 1835.83 3305.69 1815.14 3305.61 1805.27C3343.57 1783.71 3380.9 1761.43 3417.56 1738.45Z" />
              <path className="blog-footer-logo-path" style={{ fill: 'none', stroke: 'none' }} d="M3740.89 1364.44C3746.55 1372.58 3743.86 1787.45 3743.16 1836.15C3735.74 1843.21 3726.65 1850.99 3718.66 1857.66C3681.52 1888.7 3647.47 1924.56 3609.1 1954.36L3584.6 1954.63L3583.22 1952.09C3596.72 1935.58 3610.8 1924.13 3625.09 1908.51C3627.31 1859.85 3624.27 1803.05 3623.89 1754.11L3623.63 1484.45C3659.34 1445.38 3703.46 1403.54 3740.89 1364.44Z" />
            </svg>
          </div>

          <div ref={contentRef} className="mt-14" style={{ opacity: 0 }}>
            <div className="flex items-center justify-center gap-8 mb-10">
              {blogNavItems.map((item) => (
                <a
                  key={item}
                  href={item === 'Recommendation Letter' ? '/recommendation' : item === 'Blog' ? '/blog' : `/#${item.toLowerCase()}`}
                  className="nav-hover-btn !ms-0 !text-[10px] tracking-[0.2em] text-white/40 hover:text-white/70 transition-colors duration-300"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <a
                href="mailto:navmainemail@gmail.com"
                className="font-robert-regular text-xs tracking-wider text-white/25 transition-colors duration-300 hover:text-white/50"
              >
                navmainemail@gmail.com
              </a>
              <p className="font-robert-regular text-xs tracking-wider text-white/25">
                &copy; {new Date().getFullYear()} Navtej Singh
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
