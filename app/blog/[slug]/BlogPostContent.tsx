'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import NavBar from '@/components/Navbar'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { generateCardArt, generateHeroArt } from '@/lib/blog-art'
import { getBaseCount } from '@/lib/likes'

gsap.registerPlugin(ScrollTrigger)

// ─── Types ──────────────────────────────────────────────────────────────────────

interface PostMeta {
  title: string
  subtitle: string
  date: string
  readTime: string
  category: string
  author: string
  slug: string
  featured?: boolean
}

interface BlogPostContentProps {
  meta: PostMeta
  toc: string[]
  allPosts: PostMeta[]
  children: React.ReactNode
}

// ─── Component ──────────────────────────────────────────────────────────────────

export default function BlogPostContent({ meta, toc, allPosts, children }: BlogPostContentProps) {
  const slug = meta.slug
  const heroArt = generateHeroArt(slug, meta.category)
  const [activeSection, setActiveSection] = useState(toc[0])
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const pageRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const articleRef = useRef<HTMLDivElement>(null)
  const relatedRef = useRef<HTMLDivElement>(null)

  // Load like count: base (deterministic client-side) + real (from Cloudflare KV)
  useEffect(() => {
    const savedLiked = localStorage.getItem(`blog-likes-${slug}-liked`) === 'true'
    setLiked(savedLiked)

    // Deterministic base count — identical for all visitors
    const base = getBaseCount(slug)
    setLikeCount(base)

    // Fetch real likes from Cloudflare KV and add on top
    fetch(`/api/likes?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.count != null) setLikeCount(base + data.count)
      })
      .catch(() => {})
  }, [slug])

  const toggleLike = () => {
    const newLiked = !liked
    setLiked(newLiked)
    setLikeCount((c) => newLiked ? c + 1 : c - 1)
    localStorage.setItem(`blog-likes-${slug}-liked`, String(newLiked))
    fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, action: newLiked ? 'like' : 'unlike' }),
    }).catch(() => {})
  }

  // Get related posts (same category first, then others, exclude current)
  const relatedPosts = (() => {
    const sameCategory = allPosts.filter(p => p.category === meta.category && p.slug !== slug)
    const otherPosts = allPosts.filter(p => p.category !== meta.category && p.slug !== slug)
    return [...sameCategory, ...otherPosts].slice(0, 3)
  })()

  // GSAP entrance animations
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // Breadcrumb + author row
      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.1
      )

      // Hero image
      tl.fromTo(
        heroRef.current,
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9 },
        0.45
      )

      // Article body (opacity only - no transform, which would break sticky)
      tl.fromTo(
        articleRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        0.65
      )

      // Related posts scroll-triggered animation
      const relatedCards = relatedRef.current?.querySelectorAll('.related-card')
      if (relatedCards?.length) {
        gsap.fromTo(
          relatedCards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: relatedRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    },
    { scope: pageRef }
  )

  const [tocVisible, setTocVisible] = useState(false)
  const [readProgress, setReadProgress] = useState(0)
  const articleTopRef = useRef<HTMLDivElement>(null)
  const articleBottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Lenis smooth-scrolls via rAF, so native scroll events fire out of sync.
    // Use a rAF loop reading getBoundingClientRect() directly — stays frame-perfect.
    let rafId: number
    let prevSection = toc[0]
    let prevVisible = false
    let prevProgress = 0

    const update = () => {
      // Update active section
      const sections = document.querySelectorAll('[data-section]')
      let current = toc[0]
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= 140) {
          current = section.getAttribute('data-section') || current
        }
      })
      if (current !== prevSection) {
        prevSection = current
        setActiveSection(current)
      }

      // Show TOC only while article is in view (hide before and after)
      const topIn = articleTopRef.current ? articleTopRef.current.getBoundingClientRect().top < 120 : false
      const bottomIn = articleBottomRef.current ? articleBottomRef.current.getBoundingClientRect().top > 200 : false
      const visible = topIn && bottomIn
      if (visible !== prevVisible) {
        prevVisible = visible
        setTocVisible(visible)
      }

      // Calculate read progress
      if (articleTopRef.current && articleBottomRef.current) {
        const topRect = articleTopRef.current.getBoundingClientRect()
        const bottomRect = articleBottomRef.current.getBoundingClientRect()
        const totalHeight = bottomRect.top - topRect.top
        const scrolled = -topRect.top + 120
        const progress = Math.min(1, Math.max(0, scrolled / totalHeight))
        if (Math.abs(progress - prevProgress) > 0.005) {
          prevProgress = progress
          setReadProgress(progress)
        }
      }

      rafId = requestAnimationFrame(update)
    }

    rafId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafId)
  }, [toc])

  const scrollToSection = (name: string) => {
    const el = document.querySelector(`[data-section="${name}"]`)
    if (el) {
      // Works with both Lenis (window) and OverlayScrollbars (custom viewport)
      const scrollEl = document.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement | null
      const container = scrollEl || document.documentElement
      const top = el.getBoundingClientRect().top + container.scrollTop - 100
      container.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div ref={pageRef} className="relative min-h-screen bg-[#21211f]">
      <NavBar variant="light" />

      <main className="font-robert-regular">
        {/* ── Header: Two-column with continuous vertical dashed border ── */}
        <div ref={headerRef} className="px-8 md:px-14 lg:px-16 pt-36 pb-10" style={{ opacity: 0 }}>
          <div className="flex">
            {/* Left column: breadcrumb, share icons, title, subtitle */}
            <div className="flex-1 lg:pr-12">
              {/* Breadcrumb row */}
              <div className="flex items-center mb-8">
                <div className="flex items-center gap-2 text-[13px]">
                  <Link href="/blog" className="text-[#9a9a8e] hover:text-[#fffffc] transition-colors">
                    Blog
                  </Link>
                  <span className="text-[#3a3a38]">/</span>
                  <span className="text-[#c0c0b4]">{meta.category}</span>
                </div>
              </div>

              {/* Title */}
              <h1
                className="text-[2.2rem] md:text-[3rem] lg:text-[3.5rem] leading-[1.06] tracking-[-0.03em] text-[#fffffc] mb-8"
                style={{ fontFamily: "'robert-medium', 'general', 'General Sans', sans-serif" }}
              >
                {meta.title}
              </h1>

              {/* Subtitle */}
              <p className="text-[1.05rem] leading-relaxed text-[#b0b0a4] max-w-[620px]">
                {meta.subtitle}
              </p>
            </div>

            {/* Right column: meta info (continuous dashed border) */}
            <div className="hidden lg:block w-[240px] flex-shrink-0 border-l border-dashed border-[#262624] pl-10 text-[13px]">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="text-[#7f7f73]">By </span>
                  <span className="text-[#fffffc] font-medium">{meta.author}</span>
                </div>
                <span className="text-[#7f7f73]">{meta.date}</span>
              </div>
              <div className="space-y-3 border-t border-dashed border-[#262624] pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-[#7f7f73]">Category</span>
                  <span className="text-[#fffffc] font-medium">{meta.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7f7f73]">Reading time</span>
                  <span className="text-[#fffffc] font-medium">{meta.readTime}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-dashed border-[#262624]">
                  <span className="text-[#7f7f73]">Share</span>
                  <button onClick={copyLink} className="text-[#fffffc] font-medium hover:text-[#9a9a8e] transition-colors underline underline-offset-2 decoration-[#3a3a38]">
                    {copied ? 'Copied!' : 'Copy link'}
                  </button>
                </div>
                {/* Heart / Like counter */}
                <div className="flex items-center justify-between pt-3 border-t border-dashed border-[#262624]">
                  <span className="text-[#7f7f73]">Like</span>
                  <button
                    onClick={toggleLike}
                    className="flex items-center gap-1.5 group transition-colors"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      className={`transition-all duration-300 ${liked ? 'scale-110' : 'scale-100 group-hover:scale-105'}`}
                      fill={liked ? '#e05252' : 'none'}
                      stroke={liked ? '#e05252' : '#7f7f73'}
                      strokeWidth="1.8"
                    >
                      <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className={`text-[13px] font-medium tabular-nums transition-colors duration-200 ${liked ? 'text-[#e05252]' : 'text-[#fffffc]'}`}>
                      {likeCount}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Hero Image ───────────────────────────────────────────────── */}
        <div ref={heroRef} className="px-8 md:px-14 lg:px-16 pb-16" style={{ opacity: 0 }}>
          <div
            className="w-full h-[300px] md:h-[440px] lg:h-[520px] rounded-2xl overflow-hidden relative"
            style={{ background: heroArt }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 4px)' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(220,215,200,0.3) 0%, transparent 60%)' }} />
          </div>
        </div>

        {/* ── Article Body ─────────────────────────────────────────────── */}
        <div ref={articleTopRef} />
        <div ref={articleRef} className="px-8 md:px-14 lg:px-20 pb-24" style={{ opacity: 0 }}>
          <div className="max-w-[700px] mx-auto">
            <article>{children}</article>
          </div>
          <div ref={articleBottomRef} />
        </div>
      </main>

      {/* ── Fixed Table of Contents (right side) ─────────────────────── */}
      <nav
        className={`hidden lg:block fixed right-12 xl:right-16 2xl:right-24 top-28 w-[180px] transition-all duration-500 ${
          tocVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
        style={{ zIndex: 30 }}
      >
        <div className="space-y-3">
          {toc.map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className={`block text-left text-[13px] leading-snug transition-all duration-200 ${
                activeSection === item
                  ? 'text-[#fffffc] font-semibold translate-x-1'
                  : 'text-[#9a9a8e] hover:text-[#fffffc]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Radial progress ring */}
        <div className="mt-6 pt-5 border-t border-dashed border-[#262624] flex items-center gap-3">
          <div className="relative w-[44px] h-[44px] flex-shrink-0">
            <svg width="44" height="44" viewBox="0 0 44 44" className="rotate-[-90deg]">
              {/* Background ring */}
              <circle cx="22" cy="22" r="18" fill="none" stroke="#e8e8e2" strokeWidth="2.5" />
              {/* Progress ring with gradient */}
              <circle
                cx="22" cy="22" r="18"
                fill="none"
                stroke="url(#progressGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 18}`}
                strokeDashoffset={`${2 * Math.PI * 18 * (1 - readProgress)}`}
                style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
              />
              <defs>
                <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fffffc" />
                  <stop offset="100%" stopColor="#6a6a5e" />
                </linearGradient>
              </defs>
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[11px] font-semibold text-[#fffffc] tabular-nums leading-none">
                {Math.round(readProgress * 100)}%
              </span>
            </div>
          </div>
          <span className="text-[11px] text-[#9a9a8e] leading-tight">
            {readProgress >= 0.95
              ? 'Finished!'
              : `${Math.max(1, Math.round(parseInt(meta.readTime) * (1 - readProgress)))} ${Math.max(1, Math.round(parseInt(meta.readTime) * (1 - readProgress))) === 1 ? 'min' : 'mins'} left`}
          </span>
        </div>
      </nav>

      {/* ── Related Posts ────────────────────────────────────────────── */}
      <section ref={relatedRef} className="relative bg-[#21211f] px-8 md:px-14 lg:px-16 pb-16 pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2
              className="text-[1.6rem] md:text-[2rem] tracking-[-0.03em] text-[#fffffc]"
              style={{ fontFamily: "'robert-medium', 'general', sans-serif" }}
            >
              More posts
            </h2>
            <Link
              href="/blog"
              className="text-[13px] text-[#7f7f73] hover:text-[#fffffc] transition-colors underline underline-offset-2 decoration-[#3a3a38]"
            >
              View all posts
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rp, i) => (
              <Link
                key={rp.slug}
                href={`/blog/${rp.slug}`}
                className="related-card group block"
              >
                {/* Card art */}
                <div
                  className="w-full h-[180px] md:h-[200px] rounded-xl overflow-hidden relative mb-5 transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                  style={{ background: generateCardArt(rp.slug, rp.category) }}
                >
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 4px)' }} />
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(220,215,200,0.3) 0%, transparent 60%)' }} />
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 mb-3 text-[12px] text-[#7f7f73]">
                  <span className="px-2.5 py-0.5 rounded-full border border-[#262624]">
                    {rp.category}
                  </span>
                  <span>{rp.readTime} read</span>
                </div>

                {/* Title */}
                <h3
                  className="text-[1.05rem] leading-[1.35] text-[#fffffc] group-hover:text-[#b0b0a4] transition-colors duration-300"
                  style={{ fontFamily: "'robert-medium', 'general', sans-serif" }}
                >
                  {rp.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ──────────────────────────────────────────────── */}
      <NewsletterSection />

      {/* ── Blog Footer (original layout, light theme, GSAP animation) ── */}
      <BlogFooter heroArt={heroArt} />
    </div>
  )
}

// ─── Newsletter Section ──────────────────────────────────────────────────────

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
    <section className="relative bg-[#21211f] px-8 md:px-14 lg:px-16 pb-16 pt-4">
      <div className="border-t border-dashed border-[#262624] pt-14">
        <div className="max-w-xl mx-auto text-center">
          <h2
            className="text-[1.6rem] md:text-[2rem] tracking-[-0.03em] text-[#fffffc] mb-3"
            style={{ fontFamily: "'robert-medium', 'general', sans-serif" }}
          >
            Stay in the loop
          </h2>
          <p className="text-[14px] text-[#7f7f73] mb-8">
            Follow along as I explore the intersection of medicine, AI, and engineering.
          </p>

          {status === 'success' ? (
            <div ref={successRef} className="flex flex-col items-center gap-3 py-4" style={{ opacity: 0 }}>
              <div className="w-12 h-12 rounded-full bg-[#4a6741]/10 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a6741" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path ref={checkRef} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[15px] font-medium text-[#fffffc]">You&apos;re in!</p>
              <p className="text-[13px] text-[#7f7f73]">I&apos;ll send you a note when something new drops.</p>
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
                  className={`flex-1 px-4 py-3 rounded-xl border bg-[#2a2a28] text-[14px] text-[#fffffc] placeholder:text-[#b0b0a4] outline-none transition-all duration-200 ${
                    status === 'error' ? 'border-[#c4544d]/40 bg-[#3a2020]' : 'border-[#262624] focus:border-[#fffffc]'
                  }`}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-6 py-3 rounded-xl bg-[#fffffc] text-[#21211f] text-[13px] font-medium tracking-wide hover:bg-[#e0e0d8] active:scale-[0.97] transition-all duration-150 disabled:opacity-50 min-w-[105px] flex items-center justify-center"
                >
                  {status === 'loading' ? (
                    <span className="w-4 h-4 border-2 border-[#21211f]/25 border-t-[#21211f] rounded-full animate-spin" />
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

// ─── Blog Footer (original layout + GSAP animation, light theme) ─────────────

const blogNavItems = ['Projects', 'Blog', 'Contact', 'Recommendation Letter']

function BlogFooter({ heroArt }: { heroArt: string }) {
  const footerRef = useRef<HTMLElement>(null)
  const logoRef = useRef<SVGSVGElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
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
    <footer ref={footerRef} className="relative w-screen bg-[#21211f] px-8 md:px-14 lg:px-16 pb-8 pt-4">
      <div
        className="mx-auto max-w-7xl rounded-2xl overflow-hidden relative px-6 pt-20 pb-8"
        style={{ background: heroArt }}
      >
        {/* Scan-line texture overlays (matching hero) */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 4px)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(220,215,200,0.3) 0%, transparent 60%)' }} />

        {/* Content (relative z-10 to sit above overlays) */}
        <div className="relative z-10">
        {/* Logo */}
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

        {/* Nav + info */}
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
