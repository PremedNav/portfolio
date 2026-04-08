'use client'

import { useEffect, useRef } from 'react'
import NavBar from '@/components/Navbar'
import Button from '@/components/Button'
import { TiLocationArrow } from 'react-icons/ti'
import gsap from 'gsap'

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null)
  const numberRef = useRef<HTMLHeadingElement>(null)
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
    <div ref={containerRef} className="relative min-h-screen w-screen bg-[#21211f] overflow-hidden">
      <NavBar variant="light" />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#fffffc 1px, transparent 1px), linear-gradient(90deg, #fffffc 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 flex h-screen flex-col items-center justify-center gap-0 px-6">
        {/* 404 number */}
        <h1
          ref={numberRef}
          className="font-fk-screamer font-black leading-none tracking-[-0.04em] select-none"
          style={{
            fontSize: 'clamp(8rem, 25vw, 20rem)',
            color: 'transparent',
            WebkitTextStroke: '2px #3a3a38',
            opacity: 0,
          }}
        >
          404
        </h1>

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
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Button */}
        <div ref={btnRef} className="mt-8" style={{ opacity: 0 }}>
          <a href="/">
            <Button
              title="Back to home"
              leftIcon={<TiLocationArrow />}
              containerClass="cursor-pointer bg-[#edff66] flex-center gap-1"
            />
          </a>
        </div>
      </div>
    </div>
  )
}
