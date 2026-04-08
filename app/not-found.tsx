'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import NavBar from '@/components/Navbar'
import { TiLocationArrow } from 'react-icons/ti'
import gsap from 'gsap'

const ContourBackground = dynamic(() => import('@/components/ContourBackground'), { ssr: false })

export default function NotFound() {
  const numberRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.fromTo(
      numberRef.current,
      { opacity: 0, y: 60, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1 },
      0.2
    )
    tl.fromTo(
      lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.6 },
      0.6
    )
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      0.8
    )
    tl.fromTo(
      btnRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5 },
      1.1
    )
  }, [])

  return (
    <>
      <ContourBackground />
      <div className="relative z-[2] min-h-screen w-screen overflow-hidden">
        <NavBar variant="light" />

        <div className="flex h-screen flex-col items-center justify-center gap-0 px-6">
          {/* 404 — spaced out letters */}
          <div
            ref={numberRef}
            className="flex items-center gap-4 sm:gap-6 md:gap-10 select-none"
            style={{ opacity: 0 }}
          >
            {['4', '0', '4'].map((char, i) => (
              <span
                key={i}
                className="font-fk-screamer font-black leading-none text-[#3a3a38]"
                style={{ fontSize: 'clamp(6rem, 20vw, 16rem)' }}
              >
                {char}
              </span>
            ))}
          </div>

          {/* Dashed divider */}
          <div
            ref={lineRef}
            className="w-[120px] border-t border-dashed border-[#262624] my-6 origin-center"
            style={{ transform: 'scaleX(0)' }}
          />

          {/* Message */}
          <div ref={textRef} className="text-center" style={{ opacity: 0 }}>
            <p
              className="text-[1.1rem] md:text-[1.3rem] text-[#fffffc] tracking-[-0.02em] mb-2"
              style={{ fontFamily: "'robert-medium', 'general', sans-serif" }}
            >
              Page not found
            </p>
            <p className="font-robert-regular text-[13px] text-[#7f7f73] max-w-[320px]">
              This page doesn&apos;t exist.
            </p>
          </div>

          {/* Button — same custom skewed shape as landing page */}
          <div ref={btnRef} className="mt-8" style={{ opacity: 0 }}>
            <a href="/" className="group relative inline-block cursor-pointer">
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
                    Back to home
                  </span>
                  <span className="absolute inset-0 translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                    Back to home
                  </span>
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
