'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

interface Announcement {
  id: string
  text: string
  link: string
  linkLabel: string
  active: boolean
  color?: string
}

interface ColorTheme {
  bg: string
  border: string
  text: string
  linkText: string
  linkDecoration: string
  dismiss: string
  shimmer1: string
  shimmer2: string
}

const COLOR_THEMES: Record<string, ColorTheme> = {
  midnight: {
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #16213e 100%)',
    border: 'rgba(100,140,200,0.2)',
    text: '#d0d8e8',
    linkText: '#ffffff',
    linkDecoration: 'rgba(100,140,200,0.5)',
    dismiss: 'rgba(100,140,200,0.8)',
    shimmer1: 'rgba(100,140,200,0.06)',
    shimmer2: 'rgba(100,140,200,0.03)',
  },
  ember: {
    bg: 'linear-gradient(135deg, #2d1810 0%, #4a2318 40%, #6b3020 70%, #4a2318 100%)',
    border: 'rgba(220,140,100,0.2)',
    text: '#f0ddd0',
    linkText: '#ffffff',
    linkDecoration: 'rgba(220,140,100,0.5)',
    dismiss: 'rgba(220,140,100,0.8)',
    shimmer1: 'rgba(220,140,100,0.06)',
    shimmer2: 'rgba(220,140,100,0.03)',
  },
  forest: {
    bg: 'linear-gradient(135deg, #2d4a28 0%, #3a5e34 40%, #4a6741 70%, #3a5e34 100%)',
    border: 'rgba(163,184,152,0.2)',
    text: '#e8f0e4',
    linkText: '#ffffff',
    linkDecoration: 'rgba(163,184,152,0.5)',
    dismiss: 'rgba(163,184,152,0.8)',
    shimmer1: 'rgba(163,184,152,0.06)',
    shimmer2: 'rgba(163,184,152,0.03)',
  },
  violet: {
    bg: 'linear-gradient(135deg, #1e1030 0%, #2d1b4e 40%, #432874 70%, #2d1b4e 100%)',
    border: 'rgba(170,130,220,0.2)',
    text: '#e0d4f0',
    linkText: '#ffffff',
    linkDecoration: 'rgba(170,130,220,0.5)',
    dismiss: 'rgba(170,130,220,0.8)',
    shimmer1: 'rgba(170,130,220,0.06)',
    shimmer2: 'rgba(170,130,220,0.03)',
  },
  slate: {
    bg: 'linear-gradient(135deg, #1c1c1c 0%, #2a2a2a 40%, #383838 70%, #2a2a2a 100%)',
    border: 'rgba(180,180,180,0.15)',
    text: '#d4d4d4',
    linkText: '#ffffff',
    linkDecoration: 'rgba(180,180,180,0.5)',
    dismiss: 'rgba(180,180,180,0.8)',
    shimmer1: 'rgba(255,255,255,0.04)',
    shimmer2: 'rgba(255,255,255,0.02)',
  },
  ocean: {
    bg: 'linear-gradient(135deg, #0a2a3a 0%, #0e3d54 40%, #14506b 70%, #0e3d54 100%)',
    border: 'rgba(80,180,220,0.2)',
    text: '#cce8f4',
    linkText: '#ffffff',
    linkDecoration: 'rgba(80,180,220,0.5)',
    dismiss: 'rgba(80,180,220,0.8)',
    shimmer1: 'rgba(80,180,220,0.06)',
    shimmer2: 'rgba(80,180,220,0.03)',
  },
  rose: {
    bg: 'linear-gradient(135deg, #2d1520 0%, #4a1e30 40%, #6b2840 70%, #4a1e30 100%)',
    border: 'rgba(220,120,160,0.2)',
    text: '#f4d4e0',
    linkText: '#ffffff',
    linkDecoration: 'rgba(220,120,160,0.5)',
    dismiss: 'rgba(220,120,160,0.8)',
    shimmer1: 'rgba(220,120,160,0.06)',
    shimmer2: 'rgba(220,120,160,0.03)',
  },
  gold: {
    bg: 'linear-gradient(135deg, #2a2010 0%, #3d3018 40%, #574420 70%, #3d3018 100%)',
    border: 'rgba(220,190,100,0.2)',
    text: '#f0e8d0',
    linkText: '#ffffff',
    linkDecoration: 'rgba(220,190,100,0.5)',
    dismiss: 'rgba(220,190,100,0.8)',
    shimmer1: 'rgba(220,190,100,0.06)',
    shimmer2: 'rgba(220,190,100,0.03)',
  },
}

// Hardcoded fallback for static export
const FALLBACK: Announcement = {
  id: 'premed-blog-launch-2026',
  text: 'New blog post: Building Medical AI — A Complete Guide to Pathology Slide Analysis.',
  link: '/blog/building-medical-ai',
  linkLabel: 'Read it here',
  active: true,
  color: 'midnight',
}

export { COLOR_THEMES }

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false)
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const barRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    async function load() {
      let data: Announcement | null = null
      try {
        const res = await fetch('/api/admin/announcement')
        if (res.ok) {
          const json = await res.json()
          if (json && json.active) data = json
        }
      } catch {
        data = FALLBACK
      }

      if (!data || !data.active) return

      const dismissed = localStorage.getItem(`announcement-${data.id}`)
      if (dismissed) return

      setAnnouncement(data)
      setVisible(true)
    }
    load()
  }, [])

  useEffect(() => {
    if (!visible) {
      document.documentElement.style.setProperty('--announcement-height', '0px')
    }
    return () => {
      document.documentElement.style.setProperty('--announcement-height', '0px')
    }
  }, [visible])

  useEffect(() => {
    if (!visible || !barRef.current) return
    // Animate bar in and set --announcement-height at the same time
    // so navbar slides down in sync with the bar appearing
    gsap.fromTo(
      barRef.current,
      { y: -50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        delay: 1.8,
        ease: 'power3.out',
        onStart: () => {
          // Navbar shifts down at the same moment the bar starts sliding in
          document.documentElement.style.setProperty('--announcement-height', '44px')
        },
      }
    )
  }, [visible])

  const dismiss = () => {
    if (!barRef.current || !announcement) return
    gsap.to(barRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        localStorage.setItem(`announcement-${announcement.id}`, 'true')
        setVisible(false)
      },
    })
  }

  if (!visible || !announcement) return null

  const theme = COLOR_THEMES[announcement.color || 'midnight'] || COLOR_THEMES.midnight

  return (
    <a
      ref={barRef}
      href={announcement.link || '#'}
      className="group fixed top-0 left-0 right-0 z-[60] flex items-center justify-center px-12 py-3 cursor-pointer no-underline"
      style={{
        opacity: 0,
        background: theme.bg,
        borderBottom: `1px solid ${theme.border}`,
        boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
      }}
    >
      {/* Flowing water shimmer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${theme.shimmer1} 20%, rgba(255,255,255,0.05) 35%, transparent 50%, ${theme.shimmer1} 65%, rgba(255,255,255,0.06) 80%, transparent 100%)`,
            backgroundSize: '200% 100%',
            animation: 'announcementFlow 6s linear infinite',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 30%, transparent 60%, ${theme.shimmer2} 80%, transparent 100%)`,
            backgroundSize: '200% 100%',
            animation: 'announcementFlow 8s linear infinite',
            animationDelay: '-3s',
          }}
        />
      </div>

      <p className="relative text-[13px] sm:text-[14px] font-medium tracking-wide" style={{ color: theme.text }}>
        {announcement.text}
        {announcement.linkLabel && (
          <span className="ml-2.5 inline-flex items-center gap-1 font-semibold" style={{ color: theme.linkText }}>
            <span
              className="announcement-link-label relative"
              style={{ '--link-underline': theme.linkText, '--link-underline-dim': theme.linkDecoration } as React.CSSProperties}
            >
              {announcement.linkLabel}
            </span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="translate-y-[0.5px] transition-transform duration-300 group-hover:translate-x-0.5">
              <path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </p>

      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); dismiss() }}
        className="absolute right-3 sm:right-5 flex items-center justify-center w-8 h-8 hover:text-white transition-colors duration-200"
        style={{ color: theme.dismiss }}
        aria-label="Dismiss announcement"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      <style jsx>{`
        @keyframes announcementFlow {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .announcement-link-label::before,
        .announcement-link-label::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 1.5px;
        }
        .announcement-link-label::before {
          background: var(--link-underline-dim, rgba(255,255,255,0.3));
        }
        .announcement-link-label::after {
          background: var(--link-underline, #fff);
          transform-origin: bottom right;
          transform: scaleX(0);
          transition: transform 0.3s cubic-bezier(0.65, 0.05, 0.36, 1);
        }
        a:hover .announcement-link-label::after {
          transform-origin: bottom left;
          transform: scaleX(1);
        }
      `}</style>
    </a>
  )
}
