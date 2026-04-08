'use client'

import { useState } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

// ─── Section ────────────────────────────────────────────────────────────────────

export function Section({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <section data-section={name} className="mb-14">
      <h2
        className="text-[1.45rem] md:text-[1.7rem] font-semibold text-[#fffffc] mb-6 tracking-[-0.02em]"
        style={{ fontFamily: "'robert-medium', 'general', sans-serif" }}
      >
        {name}
      </h2>
      {children}
    </section>
  )
}

// ─── Typography ─────────────────────────────────────────────────────────────────

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[1rem] leading-[1.85] text-[#b0b0a4] mb-6 last:mb-0">{children}</p>
}

export function B({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-[#fffffc]">{children}</strong>
}

export function A({ children }: { children: React.ReactNode }) {
  return <a href="#" className="text-[#fffffc] underline underline-offset-2 decoration-[#a3b898] hover:decoration-[#6a8a5c] transition-colors">{children}</a>
}

export function Highlight({ children }: { children: React.ReactNode }) {
  return <span className="bg-[#2a3328] text-[#a3b898] px-1 py-0.5 rounded-[4px] font-medium">{children}</span>
}

export function IC({ children }: { children: React.ReactNode }) {
  return <code className="text-[0.9em] font-mono bg-[#2a2a28] text-[#b0a898] px-1.5 py-0.5 rounded-md border border-[#3a3a38]">{children}</code>
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[1.1rem] font-semibold text-[#fffffc] mb-6 tracking-[-0.01em]" style={{ fontFamily: "'robert-medium', 'general', sans-serif" }}>
      {children}
    </h3>
  )
}

// ─── Math (KaTeX) ──────────────────────────────────────────────────────────────

export function Eq({ c }: { c: string }) {
  const html = katex.renderToString(c, { throwOnError: false, displayMode: false })
  return <span className="math-inline" dangerouslySetInnerHTML={{ __html: html }} />
}

export function EqBlock({ c }: { c: string }) {
  const html = katex.renderToString(c, { throwOnError: false, displayMode: true })
  return <div className="my-8 overflow-x-auto text-center" dangerouslySetInnerHTML={{ __html: html }} />
}

// ─── Callout ────────────────────────────────────────────────────────────────────

const CALLOUT_PALETTE = [
  { border: '#c9a08a', label: '#a0674e' }, // terracotta
  { border: '#88b4b0', label: '#3d7a78' }, // teal
  { border: '#a8b8c8', label: '#4a6a88' }, // slate blue
  { border: '#c4a882', label: '#8a6d42' }, // amber
  { border: '#b0a0c0', label: '#6a5a88' }, // purple
  { border: '#a3b898', label: '#4a7842' }, // sage
  { border: '#c0a0a8', label: '#885a62' }, // rose
  { border: '#a0b8c8', label: '#4a7088' }, // steel
  { border: '#c8b898', label: '#7a6840' }, // gold
  { border: '#98b8a8', label: '#3a7860' }, // mint
]

function calloutColor(label: string) {
  let h = 0
  for (let i = 0; i < label.length; i++) h = ((h << 5) - h + label.charCodeAt(i)) | 0
  return CALLOUT_PALETTE[Math.abs(h) % CALLOUT_PALETTE.length]
}

export function Callout({ children, label = 'Insight' }: { children: React.ReactNode; label?: string }) {
  const c = calloutColor(label)
  return (
    <div className="my-8 pl-5 border-l border-dashed" style={{ borderColor: c.border }}>
      <span className="text-[11px] uppercase tracking-widest mb-1.5 block" style={{ color: c.label }}>{label}</span>
      <p className="text-[0.95rem] leading-[1.85] text-[#9a9a8e] italic">{children}</p>
    </div>
  )
}

// ─── Figure ─────────────────────────────────────────────────────────────────────

export function Figure({ src, alt, caption, source }: { src: string; alt: string; caption?: string; source?: string }) {
  return (
    <figure className="my-10">
      <div className="rounded-lg overflow-hidden border border-[#3a3a38]">
        <img src={src} alt={alt} className="w-full h-auto" loading="lazy" />
      </div>
      {(caption || source) && (
        <figcaption className="mt-3 text-[0.82rem] leading-[1.6] text-[#7f7f73]">
          {caption}{caption && source && ' — '}{source && <span className="italic">{source}</span>}
        </figcaption>
      )}
    </figure>
  )
}

// ─── Divider ────────────────────────────────────────────────────────────────────

export function Divider() {
  return <div className="border-b border-dashed border-[#262624] mb-14" />
}

// ─── Connected List (children-based for MDX) ────────────────────────────────────

export function ConnectedList({ children }: { children: React.ReactNode }) {
  // Flatten children into array so we can index them
  const items = Array.isArray(children) ? children.flat() : [children]
  // Filter out null/undefined/false children (whitespace text nodes from MDX)
  const validItems = items.filter((child) => child != null && child !== false && child !== '')

  return (
    <div className="mt-8 space-y-6">
      {validItems.map((child, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex-shrink-0 w-6 h-6 rounded-full border border-[#262624] flex items-center justify-center mt-[10px]">
            <span className="text-[11px] font-medium text-[#7f7f73] tabular-nums">{i + 1}</span>
          </div>
          <div className="text-[1rem] leading-[1.85] text-[#b0b0a4]">{child}</div>
        </div>
      ))}
    </div>
  )
}

export function ConnectedItem({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

// ─── Code Block ─────────────────────────────────────────────────────────────────

function highlightPython(code: string): React.ReactNode[] {
  const tokenRegex = /(#[^\n]*)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(\b(?:import|from|def|class|return|if|else|elif|for|in|while|try|except|with|as|and|or|not|is|None|True|False|yield|lambda|pass|break|continue|raise|finally|global|nonlocal|assert|del)\b)|(\b(?:range|len|print|int|float|str|list|dict|tuple|set|type|isinstance|enumerate|zip|map|filter|sorted|open|super|property|staticmethod|classmethod|abs|max|min|sum|round|any|all|next|iter|hasattr|getattr|setattr)\b)|(\b\d+\.?\d*\b)|(\b\w+)(?=\s*\()/g

  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match

  while ((match = tokenRegex.exec(code)) !== null) {
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

  if (lastIndex < code.length) {
    parts.push(code.slice(lastIndex))
  }

  return parts
}

export function CodeBlock({ code = '', language = '' }: { code?: string; language?: string }) {
  const codeStr = code
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(codeStr)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const highlighted = codeStr && language === 'python' ? highlightPython(codeStr) : (codeStr || '')

  return (
    <div className="relative my-8 rounded-xl overflow-hidden bg-[#1a1a18] group">
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
      <pre className="px-5 py-4 overflow-x-auto text-[13px] leading-[1.75] text-[#c8c8bc] font-mono">
        <code>{highlighted}</code>
      </pre>
    </div>
  )
}

// ─── Table Components ───────────────────────────────────────────────────────────

export function TH({ children, first, last }: { children: React.ReactNode; first?: boolean; last?: boolean }) {
  return (
    <th className={`text-left py-4 font-semibold text-[#fffffc] border-b border-dashed border-[#3a3a38] ${!last ? 'pr-6 border-r border-dashed border-[#3a3a38]' : ''} ${!first ? 'pl-6' : ''}`}>
      {children}
    </th>
  )
}

export function TR({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return (
    <tr className={!last ? 'border-b border-dashed border-[#3a3a38]' : ''}>
      {children}
    </tr>
  )
}

export function TD({ children, first, last, bold }: { children: React.ReactNode; first?: boolean; last?: boolean; bold?: boolean }) {
  return (
    <td className={`py-5 align-top ${bold ? 'font-semibold text-[#fffffc]' : 'text-[#9a9a8e]'} ${!last ? 'pr-6 border-r border-dashed border-[#3a3a38]' : ''} ${!first ? 'pl-6' : ''}`}>
      {children}
    </td>
  )
}
