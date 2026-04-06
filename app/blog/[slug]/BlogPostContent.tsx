'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import NavBar from '@/components/Navbar'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { generateCardArt, generateHeroArt } from '@/lib/blog-art'

gsap.registerPlugin(ScrollTrigger)

// ─── Post Data ──────────────────────────────────────────────────────────────────

interface PostData {
  title: string
  subtitle: string
  date: string
  readTime: string
  category: string
  author: string
  slug: string
}

const POSTS: Record<string, PostData> = {
  'building-medical-ai': {
    title: 'Building Medical AI: A Complete Guide To Pathology Slide Analysis',
    subtitle: 'The architectures, datasets, evaluation methods, and deployment challenges every team building medical imaging AI needs to understand.',
    date: 'March 28, 2026',
    readTime: '10 min',
    category: 'Research',
    author: 'Navtej Singh',
    slug: 'building-medical-ai',
  },
  'prompt-engineering': {
    title: 'What Is Prompt Engineering? A Complete Guide From Definition To Production',
    subtitle: 'The techniques, trade-offs, token constraints, and 2026 changes every team building with LLMs needs to know.',
    date: 'March 20, 2026',
    readTime: '10 min',
    category: 'Tips',
    author: 'Navtej Singh',
    slug: 'prompt-engineering',
  },
}

const DEFAULT_POST = POSTS['building-medical-ai']

// ─── All Posts (for related posts) ──────────────────────────────────────────────

const ALL_POSTS = [
  { title: 'Building Medical AI: A Complete Guide To Pathology Slide Analysis', slug: 'building-medical-ai', date: 'March 28, 2026', readTime: '10 min', category: 'Research' },
  { title: 'What Is Prompt Engineering? A Complete Guide From Definition To Production', slug: 'prompt-engineering', date: 'March 20, 2026', readTime: '10 min', category: 'Tips' },
  { title: 'LLM Cost Optimization: Token Efficiency, Caching, and Prompt Design', slug: 'llm-cost-optimization', date: 'March 15, 2026', readTime: '7 min', category: 'Tips' },
  { title: 'What Is Eval-Driven Development? How to Ship AI Features Without Guessing', slug: 'eval-driven-development', date: 'March 10, 2026', readTime: '7 min', category: 'Tutorials' },
  { title: 'Training a 12-Billion Parameter Model: Architecture Decisions and Tradeoffs', slug: 'training-12b-model', date: 'March 5, 2026', readTime: '12 min', category: 'Case Studies' },
  { title: 'Biochemical Pathway Discovery: Cross-Referencing Research Papers With AI', slug: 'biochemical-pathway-discovery', date: 'February 28, 2026', readTime: '8 min', category: 'Research' },
  { title: 'Building PreMeder: From Personal Frustration to 12,000 Users', slug: 'building-premeder', date: 'February 20, 2026', readTime: '9 min', category: 'Case Studies' },
  { title: 'Designing a Programming Language for Machine Learning From Scratch', slug: 'designing-ml-language', date: 'February 15, 2026', readTime: '11 min', category: 'Research' },
  { title: 'The Pre-Med Tech Stack: Tools Every Applicant Should Know About', slug: 'premed-tech-stack', date: 'February 10, 2026', readTime: '6 min', category: 'Tips' },
  { title: 'Getting Started with Medical Image Classification Using Deep Learning', slug: 'medical-image-classification', date: 'February 5, 2026', readTime: '8 min', category: 'Tutorials' },
  { title: 'Phage Therapy and Computational Biology: Where Lab Meets Code', slug: 'phage-therapy-computational', date: 'January 28, 2026', readTime: '9 min', category: 'Research' },
  { title: 'Building Real-Time Data Pipelines: From Research to Production', slug: 'realtime-data-pipelines', date: 'January 20, 2026', readTime: '7 min', category: 'Product' },
]

// ─── Table of Contents ──────────────────────────────────────────────────────────

const TOC = [
  'Introduction',
  'How Medical AI Analyzes Pathology Slides',
  'The Core Pipeline Architecture',
  'Approaches to Medical Image Analysis',
  'Key Technical Challenges',
  'What Changed in 2025-2026',
  'Conclusion',
]

// ─── Component ──────────────────────────────────────────────────────────────────

export default function BlogPostContent({ slug }: { slug: string }) {
  const post = POSTS[slug] || DEFAULT_POST
  const heroArt = generateHeroArt(slug, post.category)
  const [activeSection, setActiveSection] = useState(TOC[0])
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const pageRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const articleRef = useRef<HTMLDivElement>(null)
  const relatedRef = useRef<HTMLDivElement>(null)

  // Load like count from server + liked state from localStorage
  useEffect(() => {
    const savedLiked = localStorage.getItem(`blog-likes-${slug}-liked`) === 'true'
    setLiked(savedLiked)
    fetch(`/api/likes?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => { if (data.count != null) setLikeCount(data.count) })
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
    const sameCategory = ALL_POSTS.filter(p => p.category === post.category && p.slug !== slug)
    const otherPosts = ALL_POSTS.filter(p => p.category !== post.category && p.slug !== slug)
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
    let prevSection = TOC[0]
    let prevVisible = false
    let prevProgress = 0

    const update = () => {
      // Update active section
      const sections = document.querySelectorAll('[data-section]')
      let current = TOC[0]
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
  }, [])

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
    <div ref={pageRef} className="relative min-h-screen bg-[#f8f8f6]">
      <NavBar variant="light" />

      <main className="font-robert-regular">
        {/* ── Header: Two-column with continuous vertical dashed border ── */}
        <div ref={headerRef} className="px-8 md:px-14 lg:px-16 pt-24 pb-10" style={{ opacity: 0 }}>
          <div className="flex">
            {/* Left column: breadcrumb, share icons, title, subtitle */}
            <div className="flex-1 lg:pr-12">
              {/* Breadcrumb row */}
              <div className="flex items-center mb-8">
                <div className="flex items-center gap-2 text-[13px]">
                  <Link href="/blog" className="text-[#7a7a6e] hover:text-[#181816] transition-colors">
                    Blog
                  </Link>
                  <span className="text-[#c0c0b4]">/</span>
                  <span className="text-[#3a3a2e]">{post.category}</span>
                </div>
              </div>

              {/* Title */}
              <h1
                className="text-[2.2rem] md:text-[3rem] lg:text-[3.5rem] leading-[1.06] tracking-[-0.03em] text-[#181816] mb-8"
                style={{ fontFamily: "'robert-medium', 'general', 'General Sans', sans-serif" }}
              >
                {post.title}
              </h1>

              {/* Subtitle */}
              <p className="text-[1.05rem] leading-relaxed text-[#4a4a40] max-w-[620px]">
                {post.subtitle}
              </p>
            </div>

            {/* Right column: meta info (continuous dashed border) */}
            <div className="hidden lg:block w-[240px] flex-shrink-0 border-l border-dashed border-[#d0d0c6] pl-10 text-[13px]">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="text-[#8a8a7e]">By </span>
                  <span className="text-[#181816] font-medium">{post.author}</span>
                </div>
                <span className="text-[#8a8a7e]">{post.date}</span>
              </div>
              <div className="space-y-3 border-t border-dashed border-[#d0d0c6] pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-[#8a8a7e]">Category</span>
                  <span className="text-[#181816] font-medium">{post.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8a8a7e]">Reading time</span>
                  <span className="text-[#181816] font-medium">{post.readTime}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-dashed border-[#d0d0c6]">
                  <span className="text-[#8a8a7e]">Share</span>
                  <button onClick={copyLink} className="text-[#181816] font-medium hover:text-[#5a5a50] transition-colors underline underline-offset-2 decoration-[#c0c0b4]">
                    {copied ? 'Copied!' : 'Copy link'}
                  </button>
                </div>
                {/* Heart / Like counter */}
                <div className="flex items-center justify-between pt-3 border-t border-dashed border-[#d0d0c6]">
                  <span className="text-[#8a8a7e]">Like</span>
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
                      stroke={liked ? '#e05252' : '#8a8a7e'}
                      strokeWidth="1.8"
                    >
                      <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className={`text-[13px] font-medium tabular-nums transition-colors duration-200 ${liked ? 'text-[#e05252]' : 'text-[#181816]'}`}>
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

            {/* ── Main content (centered) ──────────────────────────────── */}
            <article>

              {/* Introduction */}
              <Section name="Introduction">
                <P>Medical imaging AI sits at one of the most promising intersections of deep learning and clinical practice. The core task is deceptively simple: given a digitized pathology slide, identify and classify regions of diagnostic interest. The execution is <Highlight>not simple at all</Highlight>.</P>
                <P>A single whole-slide image can exceed <IC>100,000 x 100,000 pixels</IC>. Standard convolutional networks cannot process inputs at this scale. The field has converged on a set of architectural patterns to handle this, and understanding them is prerequisite to building anything that works in production.</P>

                <Figure
                  src="/img/blog/pathology-slide.jpg"
                  alt="Microscopic view of tissue under laboratory analysis"
                  caption="Microscopy at the cellular level — medical AI processes thousands of tiles like this from a single slide"
                  source="Photo by CDC on Unsplash"
                />
              </Section>

              <Divider />

              {/* How Medical AI Analyzes Pathology Slides */}
              <Section name="How Medical AI Analyzes Pathology Slides">
                <P>Understanding how medical AI works begins with understanding the data it processes. A digitized pathology slide is not a photograph. It is a <B>pyramidal image</B>, stored at multiple resolution levels, with the highest resolution capturing cellular-level detail across an area that may span several square centimeters of tissue.</P>
                <P>The model never sees the full slide at once. Instead, the slide is divided into overlapping tiles, typically <IC>256x256</IC> or <IC>512x512</IC> pixels at 20x or 40x magnification. Each tile is processed independently through a feature extractor, producing a fixed-length embedding vector. The collection of embeddings is then aggregated using an <B>attention mechanism</B> to produce a slide-level prediction.</P>
                <P>This mechanism explains two things that otherwise feel arbitrary.</P>

                <ConnectedList items={[
                  <>It explains why <B>tile-level labels are not required</B> for training. The attention mechanism learns which tiles are diagnostically relevant. This is critical because pathologists annotate at the slide level, not the tile level.</>,
                  <>It explains why two slides that look similar to a human observer can produce meaningfully different model outputs. The model attends to spatial patterns in the embedding space that may not correspond to visually obvious features. A complete breakdown of <A>attention-based MIL architectures</A> covers the full mechanism in depth.</>,
                ]} />
              </Section>

              <Divider />

              {/* The Core Pipeline Architecture */}
              <Section name="The Core Pipeline Architecture">
                <P>With the mechanism in place, the pipeline taxonomy becomes intelligible. Each stage is a structured transformation of the raw slide data into a clinically actionable prediction.</P>

                <ConnectedList items={[
                  <><B>Tissue detection and segmentation.</B> Before any analysis begins, background regions must be separated from tissue. This is typically handled by color-space thresholding in <IC>HSV</IC> or Otsu binarization, though learned segmentation models perform better on staining artifacts.</>,
                  <><B>Tile extraction and normalization.</B> Tissue regions are divided into tiles at the target magnification. Stain normalization (<IC>Macenko</IC> or <IC>Vahadane</IC> methods) standardizes color distributions across slides from different scanners and labs.</>,
                  <><B>Feature extraction.</B> A pretrained encoder (<IC>ResNet-50</IC>, <IC>ViT</IC>, or increasingly, pathology-specific foundation models like <Highlight>UNI</Highlight> or <Highlight>CONCH</Highlight>) maps each tile to a dense embedding vector.</>,
                  <><B>Aggregation and classification.</B> An attention-based pooling layer combines tile embeddings into a single slide-level representation, which is fed to a classifier for the target task (cancer detection, grading, molecular subtyping).</>,
                ]} />
              </Section>

              <Divider />

              {/* Approaches to Medical Image Analysis */}
              <Section name="Approaches to Medical Image Analysis">
                <H3>Medical AI vs. Alternatives: The Diagnostic Guide</H3>

                <div className="overflow-x-auto my-8">
                  <table className="w-full text-[0.88rem] leading-[1.7] border-collapse">
                    <thead>
                      <tr>
                        <TH first>Approach</TH>
                        <TH>Root cause it solves</TH>
                        <TH>When to use it</TH>
                        <TH last>The signal that it&apos;s time</TH>
                      </tr>
                    </thead>
                    <tbody>
                      <TR>
                        <TD first bold>Multiple Instance Learning</TD>
                        <TD>Slide-level labels only, no tile annotations available</TD>
                        <TD>Always start here for whole-slide classification</TD>
                        <TD last>You have slide diagnoses but no pixel-level masks</TD>
                      </TR>
                      <TR>
                        <TD first bold>Supervised segmentation</TD>
                        <TD>Need precise spatial localization of pathology</TD>
                        <TD>After pathologist-annotated masks are available</TD>
                        <TD last>Clinical workflow requires tumor boundary delineation</TD>
                      </TR>
                      <TR>
                        <TD first bold>Foundation model fine-tuning</TD>
                        <TD>Limited labeled data for rare pathologies</TD>
                        <TD>When pretrained pathology encoders are available</TD>
                        <TD last>Small dataset but high performance requirements</TD>
                      </TR>
                      <TR last>
                        <TD first bold>Graph neural networks</TD>
                        <TD>Spatial relationships between cells matter for diagnosis</TD>
                        <TD>When tissue microenvironment drives the prediction</TD>
                        <TD last>Tile-level features alone miss inter-cellular context</TD>
                      </TR>
                    </tbody>
                  </table>
                </div>

                <P>In practice, the tile extraction step is straightforward to implement. Here&apos;s a simplified version of the core loop:</P>

                <CodeBlock language="python" code={`import openslide
import numpy as np

def extract_tiles(slide_path, tile_size=256, level=0):
    slide = openslide.OpenSlide(slide_path)
    w, h = slide.level_dimensions[level]

    tiles = []
    for y in range(0, h, tile_size):
        for x in range(0, w, tile_size):
            tile = slide.read_region((x, y), level, (tile_size, tile_size))
            tile_np = np.array(tile.convert("RGB"))

            # Skip background tiles (mostly white)
            if tile_np.mean() < 220:
                tiles.append((x, y, tile_np))

    return tiles`} />

                <Figure
                  src="/img/blog/microscope-lab.jpg"
                  alt="Research laboratory with microscope and tissue samples"
                  caption="The wet lab side of computational pathology — digitized slides begin here before any model touches them"
                  source="Photo by National Cancer Institute on Unsplash"
                />

                <P><A>Foundation model fine-tuning vs. training from scratch</A> covers the decision in full. The core rule is that you should not train from scratch until you have thoroughly evaluated pretrained encoders. Because training on a dataset you haven&apos;t benchmarked against existing models rarely yields the expected result and makes the underlying failure harder to see.</P>
              </Section>

              <Divider />

              {/* Key Technical Challenges */}
              <Section name="Key Technical Challenges">
                <P>Medical AI has a defined set of failure modes. Three technical challenges — <Highlight>distribution shift</Highlight>, <Highlight>label noise</Highlight>, and <Highlight>computational scale</Highlight> — account for the majority of deployment failures.</P>

                <Callout label="Key takeaway">Distribution shift is the silent killer. A model trained at one hospital can drop 15-20% in accuracy when deployed at another — even on the same cancer type — purely due to differences in scanners and staining protocols.</Callout>

                <P>Distribution shift occurs when a model trained on slides from one institution encounters slides from another. Different scanners, staining protocols, and tissue preparation methods produce systematic visual differences that can degrade model performance dramatically. Stain normalization reduces but does not eliminate this problem.</P>
                <P>Label noise is endemic to pathology datasets. Inter-observer agreement among pathologists for certain diagnoses (particularly grading) can be <Highlight>surprisingly low</Highlight>. Training with noisy labels requires either robust loss functions or consensus-based label refinement, both of which add complexity to the training pipeline.</P>

                <Figure
                  src="/img/blog/medical-research.jpg"
                  alt="Medical researcher analyzing samples in a clinical laboratory"
                  caption="Clinical validation requires pathologist review — the human side of the evaluation pipeline that no model can skip"
                  source="Photo by National Cancer Institute on Unsplash"
                />
              </Section>

              <Divider />

              {/* What Changed in 2025-2026 */}
              <Section name="What Changed in 2025-2026">
                <P>The most significant shift in computational pathology over the past year has been the emergence of <B>pathology foundation models</B>. Models like <IC>UNI</IC>, <IC>CONCH</IC>, and <IC>Virchow</IC> were trained on hundreds of thousands to millions of pathology slides using self-supervised learning. They produce tile embeddings that transfer effectively to downstream tasks with minimal fine-tuning.</P>

                <Callout label="Why this matters">Foundation models have fundamentally changed the economics: you need hundreds of labeled slides instead of thousands, making clinical AI feasible for smaller research groups and rare pathologies.</Callout>

                <P>This changes the economics of medical AI development. Previously, building a competitive pathology model required access to large, well-annotated datasets and significant compute for training. Foundation models reduce the data requirement to <Highlight>hundreds rather than thousands</Highlight> of labeled slides, making it feasible for smaller research groups to develop clinically useful models.</P>
              </Section>

              <Divider />

              {/* Conclusion */}
              <Section name="Conclusion">
                <P>Building medical AI for pathology is a <Highlight>systems problem</Highlight>, not just a modeling problem. The pipeline from raw whole-slide images to clinically validated predictions involves tissue detection, tile extraction, feature encoding, attention-based aggregation, and careful evaluation against distribution shift and label noise.</P>
                <P>The arrival of foundation models has simplified the feature extraction stage considerably, but the surrounding infrastructure — the data pipelines, evaluation frameworks, and deployment considerations — remains the hard part. The teams that get this right will define the next generation of diagnostic tools.</P>

                <Callout label="Get involved">This is an active area of my research. If you&apos;re working on medical imaging AI or want to collaborate, feel free to reach out.</Callout>
              </Section>

            </article>

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
          {TOC.map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className={`block text-left text-[13px] leading-snug transition-all duration-200 ${
                activeSection === item
                  ? 'text-[#181816] font-semibold translate-x-1'
                  : 'text-[#9a9a8e] hover:text-[#181816]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Radial progress ring */}
        <div className="mt-6 pt-5 border-t border-dashed border-[#d0d0c6] flex items-center gap-3">
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
                  <stop offset="0%" stopColor="#181816" />
                  <stop offset="100%" stopColor="#6a6a5e" />
                </linearGradient>
              </defs>
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[11px] font-semibold text-[#181816] tabular-nums leading-none">
                {Math.round(readProgress * 100)}%
              </span>
            </div>
          </div>
          <span className="text-[11px] text-[#9a9a8e] leading-tight">
            {readProgress >= 0.95
              ? 'Finished!'
              : `${Math.max(1, Math.round(parseInt(post.readTime) * (1 - readProgress)))} ${Math.max(1, Math.round(parseInt(post.readTime) * (1 - readProgress))) === 1 ? 'min' : 'mins'} left`}
          </span>
        </div>
      </nav>

      {/* ── Related Posts ────────────────────────────────────────────── */}
      <section ref={relatedRef} className="relative bg-[#f8f8f6] px-8 md:px-14 lg:px-16 pb-16 pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2
              className="text-[1.6rem] md:text-[2rem] tracking-[-0.03em] text-[#181816]"
              style={{ fontFamily: "'robert-medium', 'general', sans-serif" }}
            >
              More posts
            </h2>
            <Link
              href="/blog"
              className="text-[13px] text-[#8a8a7e] hover:text-[#181816] transition-colors underline underline-offset-2 decoration-[#c0c0b4]"
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
                <div className="flex items-center gap-3 mb-3 text-[12px] text-[#8a8a7e]">
                  <span className="px-2.5 py-0.5 rounded-full border border-[#d0d0c6]">
                    {rp.category}
                  </span>
                  <span>{rp.readTime} read</span>
                </div>

                {/* Title */}
                <h3
                  className="text-[1.05rem] leading-[1.35] text-[#181816] group-hover:text-[#4a4a40] transition-colors duration-300"
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

// ─── Reusable Article Components ────────────────────────────────────────────────

function Section({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <section data-section={name} className="mb-14">
      <h2
        className="text-[1.45rem] md:text-[1.7rem] font-semibold text-[#181816] mb-6 tracking-[-0.02em]"
        style={{ fontFamily: "'robert-medium', 'general', sans-serif" }}
      >
        {name}
      </h2>
      {children}
    </section>
  )
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[1.1rem] font-semibold text-[#181816] mb-6 tracking-[-0.01em]" style={{ fontFamily: "'robert-medium', 'general', sans-serif" }}>
      {children}
    </h3>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[1rem] leading-[1.85] text-[#2a2a24] mb-6 last:mb-0">{children}</p>
}

function B({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-[#181816]">{children}</strong>
}

function A({ children }: { children: React.ReactNode }) {
  return <a href="#" className="text-[#181816] underline underline-offset-2 decoration-[#a3b898] hover:decoration-[#6a8a5c] transition-colors">{children}</a>
}

function Highlight({ children }: { children: React.ReactNode }) {
  return <span className="bg-[#eef2e8] text-[#3a5a30] px-1 py-0.5 rounded-[4px] font-medium">{children}</span>
}

function IC({ children }: { children: React.ReactNode }) {
  return <code className="text-[0.9em] font-mono bg-[#f0efe8] text-[#5a4a3a] px-1.5 py-0.5 rounded-md border border-[#e0ddd0]">{children}</code>
}

const CALLOUT_COLORS: Record<string, { border: string; label: string }> = {
  'Key takeaway':     { border: '#c9a08a', label: '#a0674e' },  // terracotta
  'Why this matters': { border: '#88b4b0', label: '#3d7a78' },  // teal
  'Get involved':     { border: '#a8b8c8', label: '#4a6a88' },  // steel blue
}
const CALLOUT_DEFAULT = { border: '#a3b898', label: '#6a8a5c' } // sage green

function Callout({ children, label = 'Insight' }: { children: React.ReactNode; label?: string }) {
  const c = CALLOUT_COLORS[label] || CALLOUT_DEFAULT
  return (
    <div className="my-8 pl-5 border-l border-dashed" style={{ borderColor: c.border }}>
      <span className="text-[11px] uppercase tracking-widest mb-1.5 block" style={{ color: c.label }}>{label}</span>
      <p className="text-[0.95rem] leading-[1.85] text-[#5a5a50] italic">{children}</p>
    </div>
  )
}

function Figure({ src, alt, caption, source }: { src: string; alt: string; caption?: string; source?: string }) {
  return (
    <figure className="my-10">
      <div className="rounded-lg overflow-hidden border border-[#e8e8e0]">
        <img src={src} alt={alt} className="w-full h-auto" loading="lazy" />
      </div>
      {(caption || source) && (
        <figcaption className="mt-3 text-[0.82rem] leading-[1.6] text-[#8a8a7e]">
          {caption}{caption && source && ' — '}{source && <span className="italic">{source}</span>}
        </figcaption>
      )}
    </figure>
  )
}

function Divider() {
  return <div className="border-b border-dashed border-[#d0d0c6] mb-14" />
}

function ConnectedList({ items }: { items: React.ReactNode[] }) {
  return (
    <div className="mt-8 space-y-6">
      {items.map((item, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex-shrink-0 w-6 h-6 rounded-full border border-[#d0d0c6] flex items-center justify-center mt-[10px]">
            <span className="text-[11px] font-medium text-[#8a8a7e] tabular-nums">{i + 1}</span>
          </div>
          <p className="text-[1rem] leading-[1.85] text-[#2a2a24]">{item}</p>
        </div>
      ))}
    </div>
  )
}

function highlightPython(code: string): React.ReactNode[] {
  // Tokenize with regex — order matters (comments/strings first)
  const tokenRegex = /(#[^\n]*)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(\b(?:import|from|def|class|return|if|else|elif|for|in|while|try|except|with|as|and|or|not|is|None|True|False|yield|lambda|pass|break|continue|raise|finally|global|nonlocal|assert|del)\b)|(\b(?:range|len|print|int|float|str|list|dict|tuple|set|type|isinstance|enumerate|zip|map|filter|sorted|open|super|property|staticmethod|classmethod|abs|max|min|sum|round|any|all|next|iter|hasattr|getattr|setattr)\b)|(\b\d+\.?\d*\b)|(\b\w+)(?=\s*\()/g

  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match

  while ((match = tokenRegex.exec(code)) !== null) {
    // Push text before match
    if (match.index > lastIndex) {
      parts.push(code.slice(lastIndex, match.index))
    }

    const [full, comment, str, keyword, builtin, num, funcName] = match

    if (comment) {
      parts.push(<span key={match.index} style={{ color: '#6a6a5e' }}>{full}</span>)
    } else if (str) {
      parts.push(<span key={match.index} style={{ color: '#a8c078' }}>{full}</span>)
    } else if (keyword) {
      parts.push(<span key={match.index} style={{ color: '#d4956a' }}>{full}</span>)
    } else if (builtin) {
      parts.push(<span key={match.index} style={{ color: '#7eb8c9' }}>{full}</span>)
    } else if (num) {
      parts.push(<span key={match.index} style={{ color: '#d4a06a' }}>{full}</span>)
    } else if (funcName) {
      parts.push(<span key={match.index} style={{ color: '#7eb8c9' }}>{full}</span>)
    } else {
      parts.push(full)
    }

    lastIndex = match.index + full.length
  }

  // Push remaining text
  if (lastIndex < code.length) {
    parts.push(code.slice(lastIndex))
  }

  return parts
}

function CodeBlock({ code, language = '' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const highlighted = language === 'python' ? highlightPython(code) : code

  return (
    <div className="relative my-8 rounded-xl overflow-hidden bg-[#1a1a18] group">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#2a2a26] border-b border-white/8">
        <span className="text-[11px] text-white/60 uppercase tracking-wider">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-white/50 hover:text-white/80 transition-colors"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
              Copied
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
              Copy
            </>
          )}
        </button>
      </div>
      {/* Code */}
      <pre className="px-5 py-4 overflow-x-auto text-[13px] leading-[1.75] text-[#c8c8bc] font-mono">
        <code>{highlighted}</code>
      </pre>
    </div>
  )
}

// ─── Table Components ───────────────────────────────────────────────────────────

function TH({ children, first, last }: { children: React.ReactNode; first?: boolean; last?: boolean }) {
  return (
    <th className={`text-left py-4 font-semibold text-[#181816] border-b border-dashed border-[#b8b8ae] ${!last ? 'pr-6 border-r border-dashed border-[#d4d4cc]' : ''} ${!first ? 'pl-6' : ''}`}>
      {children}
    </th>
  )
}

function TR({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return (
    <tr className={!last ? 'border-b border-dashed border-[#d8d8d0]' : ''}>
      {children}
    </tr>
  )
}

function TD({ children, first, last, bold }: { children: React.ReactNode; first?: boolean; last?: boolean; bold?: boolean }) {
  return (
    <td className={`py-5 align-top ${bold ? 'font-semibold text-[#181816]' : 'text-[#3a3a30]'} ${!last ? 'pr-6 border-r border-dashed border-[#d8d8d0]' : ''} ${!first ? 'pl-6' : ''}`}>
      {children}
    </td>
  )
}

// ─── Metadata Sidebar Item ──────────────────────────────────────────────────────

function MetaItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-white/40 mt-0.5">{icon}</div>
      <div>
        <p className="text-white/40 mb-0.5">{label}</p>
        <p className="text-white font-medium">{value}</p>
      </div>
    </div>
  )
}

// ─── Icons ──────────────────────────────────────────────────────────────────────

function CategoryIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path d="M6 6h.008v.008H6V6z" />
    </svg>
  )
}

function AuthorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 mt-0.5">
      <path d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 8.5a3 3 0 0 0 4.2.4l2-2a3 3 0 0 0-4.2-4.2L7.3 3.8" />
      <path d="M9.5 7.5a3 3 0 0 0-4.2-.4l-2 2a3 3 0 0 0 4.2 4.2l1.2-1.1" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
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
    <section className="relative bg-[#f8f8f6] px-8 md:px-14 lg:px-16 pb-16 pt-4">
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

// ─── Blog Footer (original layout + GSAP animation, light theme) ─────────────

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
        {/* Scan-line texture overlays (matching hero) */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 4px)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(220,215,200,0.3) 0%, transparent 60%)' }} />

        {/* Content (relative z-10 to sit above overlays) */}
        <div className="relative z-10">
        {/* Divider */}
        <div ref={lineRef} className="mb-14 h-px w-full origin-left bg-white/15" />

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
