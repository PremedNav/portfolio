'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import NavBar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { TiLocationArrow } from 'react-icons/ti'
import gsap from 'gsap'

const ContourBackground = dynamic(() => import('@/components/ContourBackground'), { ssr: false })

export default function ContactPage() {
  const titleRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [organization, setOrganization] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1 },
      0.2
    )
    tl.fromTo(
      lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.6 },
      0.6
    )
    tl.fromTo(
      contentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      0.8
    )
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setStatus('error')
      setErrorMsg('Please fill in all required fields.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus('error')
      setErrorMsg('Please enter a valid email address.')
      return
    }

    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          organization: organization.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setName('')
        setEmail('')
        setOrganization('')
        setSubject('')
        setMessage('')
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <>
      <ContourBackground />
      <div className="relative z-[2] min-h-screen w-screen overflow-hidden">
        <NavBar variant="light" />

        <div className="flex min-h-screen flex-col items-center justify-center px-6 pb-0 pt-32">
          {/* Title */}
          <div ref={titleRef} className="text-center" style={{ opacity: 0 }}>
            <p className="mb-6 font-general text-[10px] uppercase text-[#7f7f73]">
              Get In Touch
            </p>
            <h1
              className="special-font font-fk-screamer font-black leading-[.9] text-[#fffffc]"
              style={{ fontSize: 'clamp(3rem, 10vw, 6.2rem)' }}
            >
              g<b>o</b>t a n<b>o</b>vel <br /> chall<b>e</b>nge?
            </h1>
          </div>

          {/* Divider */}
          <div
            ref={lineRef}
            className="my-8 w-[120px] origin-center border-t border-dashed border-[#262624]"
            style={{ transform: 'scaleX(0)' }}
          />

          {/* Email + Form */}
          <div ref={contentRef} className="w-full max-w-[600px]" style={{ opacity: 0 }}>
            {/* Email link */}
            <div className="mb-10 text-center">
              <a
                href="mailto:navmainemail@gmail.com"
                className="font-robert-regular text-sm tracking-wider text-[#b0b0a4] transition-colors duration-300 hover:text-[#fffffc]"
              >
                navmainemail@gmail.com
              </a>
            </div>

            {/* Contact form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Row 1: Name + Email */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block font-general text-[10px] uppercase tracking-[0.2em] text-[#7f7f73]">
                    Name <span className="text-[#555]">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={200}
                    disabled={status === 'submitting'}
                    className="w-full border border-[#262624] bg-transparent px-4 py-3 font-robert-regular text-sm text-[#fffffc] outline-none transition-colors duration-300 placeholder:text-[#7f7f73] focus:border-[#3a3a38]"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-general text-[10px] uppercase tracking-[0.2em] text-[#7f7f73]">
                    Email <span className="text-[#555]">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={254}
                    disabled={status === 'submitting'}
                    className="w-full border border-[#262624] bg-transparent px-4 py-3 font-robert-regular text-sm text-[#fffffc] outline-none transition-colors duration-300 placeholder:text-[#7f7f73] focus:border-[#3a3a38]"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Row 2: Organization + Subject */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block font-general text-[10px] uppercase tracking-[0.2em] text-[#7f7f73]">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    maxLength={200}
                    disabled={status === 'submitting'}
                    className="w-full border border-[#262624] bg-transparent px-4 py-3 font-robert-regular text-sm text-[#fffffc] outline-none transition-colors duration-300 placeholder:text-[#7f7f73] focus:border-[#3a3a38]"
                    placeholder="Company or organization"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-general text-[10px] uppercase tracking-[0.2em] text-[#7f7f73]">
                    Subject <span className="text-[#555]">*</span>
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    maxLength={200}
                    disabled={status === 'submitting'}
                    className="w-full border border-[#262624] bg-transparent px-4 py-3 font-robert-regular text-sm text-[#fffffc] outline-none transition-colors duration-300 placeholder:text-[#7f7f73] focus:border-[#3a3a38]"
                    placeholder="What is this regarding?"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="mb-2 block font-general text-[10px] uppercase tracking-[0.2em] text-[#7f7f73]">
                  Message <span className="text-[#555]">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={5000}
                  rows={6}
                  disabled={status === 'submitting'}
                  className="w-full resize-none border border-[#262624] bg-transparent px-4 py-3 font-robert-regular text-sm text-[#fffffc] outline-none transition-colors duration-300 placeholder:text-[#7f7f73] focus:border-[#3a3a38]"
                  placeholder="Tell me about your project or idea..."
                />
              </div>

              {/* Submit button */}
              <div className="mt-2 flex justify-center">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="group relative inline-block cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 56" preserveAspectRatio="none">
                    <path
                      d="M8,2 L170,2 Q185,2 190,10 L198,42 Q200,50 192,54 L24,54 Q10,54 6,46 L2,14 Q0,6 8,2 Z"
                      className="fill-yellow-300"
                    />
                  </svg>
                  <span className="relative z-10 flex items-center gap-2 px-7 py-3 font-general text-xs uppercase text-black">
                    <TiLocationArrow />
                    <span className="relative inline-flex overflow-hidden leading-tight py-px">
                      <span className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
                        {status === 'submitting' ? 'Sending...' : 'Send message'}
                      </span>
                      <span className="absolute inset-0 translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                        {status === 'submitting' ? 'Sending...' : 'Send message'}
                      </span>
                    </span>
                  </span>
                </button>
              </div>

              {/* Status messages */}
              {status === 'success' && (
                <p className="text-center font-robert-regular text-sm text-green-400">
                  Message sent! I&apos;ll get back to you soon.
                </p>
              )}
              {status === 'error' && errorMsg && (
                <p className="text-center font-robert-regular text-sm text-red-400">
                  {errorMsg}
                </p>
              )}
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
