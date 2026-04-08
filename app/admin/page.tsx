'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { COLOR_THEMES } from '@/components/AnnouncementBar'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Announcement {
  id: string
  text: string
  link: string
  linkLabel: string
  active: boolean
  color: string
}

const COLOR_OPTIONS: { key: string; label: string; swatch: string }[] = [
  { key: 'midnight', label: 'Midnight', swatch: '#0f3460' },
  { key: 'ocean', label: 'Ocean', swatch: '#14506b' },
  { key: 'violet', label: 'Violet', swatch: '#432874' },
  { key: 'rose', label: 'Rose', swatch: '#6b2840' },
  { key: 'ember', label: 'Ember', swatch: '#6b3020' },
  { key: 'gold', label: 'Gold', swatch: '#574420' },
  { key: 'forest', label: 'Forest', swatch: '#4a6741' },
  { key: 'slate', label: 'Slate', swatch: '#383838' },
]

interface Subscriber {
  email: string
  subscribedAt: string
}

interface Post {
  slug: string
  title: string
  date: string | null
}

type Tab = 'announcement' | 'subscribers' | 'posts'

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function api(path: string, options?: RequestInit) {
  const res = await fetch(path, { credentials: 'include', ...options })
  return res
}

async function apiJson<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await api(path, options)
  return res.json()
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)

  // Check session on mount
  useEffect(() => {
    apiJson<{ authenticated: boolean }>('/api/admin/session')
      .then((data) => setAuthenticated(data.authenticated))
      .catch(() => setAuthenticated(false))
      .finally(() => setChecking(false))
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen bg-[#21211f] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#a3b898] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!authenticated) {
    return <LoginScreen onSuccess={() => setAuthenticated(true)} />
  }

  return <Dashboard onLogout={() => setAuthenticated(false)} />
}

// ─── Login Screen ────────────────────────────────────────────────────────────

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
    }
  }, [])

  const handleSubmit = async () => {
    if (!password.trim() || loading) return
    setError('')
    setLoading(true)

    try {
      const res = await api('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()

      if (res.ok) {
        onSuccess()
      } else {
        setError(data.error || 'Login failed.')
        // Shake animation
        if (formRef.current) {
          gsap.fromTo(formRef.current, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' })
        }
      }
    } catch {
      setError('Network error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#21211f] flex items-center justify-center px-4">
      <div ref={containerRef} style={{ opacity: 0 }} className="w-full max-w-sm">
        <div ref={formRef} className="bg-[#2a2a28] border border-[#3a3a37] rounded-xl p-8">
          <h1 className="text-lg font-medium text-[#fffffc] mb-1 tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-[#8a8a85] mb-6">Enter your password to continue.</p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Password"
            autoFocus
            className="w-full bg-[#21211f] border border-[#3a3a37] rounded-lg px-4 py-2.5 text-sm text-[#fffffc] placeholder:text-[#5a5a55] focus:outline-none focus:border-[#a3b898]/50 transition-colors"
          />

          {error && (
            <p className="mt-3 text-sm text-red-400">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 w-full bg-[#4a6741] hover:bg-[#5a7751] disabled:opacity-50 text-[#fffffc] text-sm font-medium rounded-lg px-4 py-2.5 transition-colors"
          >
            {loading ? 'Verifying...' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('announcement')

  const handleLogout = async () => {
    await api('/api/admin/session', { method: 'DELETE' })
    onLogout()
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'announcement', label: 'Announcement' },
    { key: 'subscribers', label: 'Subscribers' },
    { key: 'posts', label: 'Posts' },
  ]

  return (
    <div className="min-h-screen bg-[#21211f] text-[#fffffc]">
      {/* Header */}
      <header className="border-b border-[#3a3a37] px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-medium tracking-tight">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-[#8a8a85] hover:text-[#fffffc] transition-colors"
        >
          Log out
        </button>
      </header>

      {/* Tabs */}
      <div className="border-b border-[#3a3a37] px-6 flex gap-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              tab === t.key
                ? 'text-[#fffffc]'
                : 'text-[#8a8a85] hover:text-[#fffffc]'
            }`}
          >
            {t.label}
            {tab === t.key && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#a3b898]" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-6 py-6 max-w-4xl">
        {tab === 'announcement' && <AnnouncementTab />}
        {tab === 'subscribers' && <SubscribersTab />}
        {tab === 'posts' && <PostsTab />}
      </div>
    </div>
  )
}

// ─── Announcement Tab ────────────────────────────────────────────────────────

const TEMPLATES: { label: string; text: (title: string) => string; linkLabel: string }[] = [
  { label: 'New Post', text: (t) => `New blog post: ${t}.`, linkLabel: 'Read it here' },
  { label: 'Featured', text: (t) => `Featured: ${t} \u2014 don\u2019t miss it.`, linkLabel: 'Check it out' },
  { label: 'Just Published', text: (t) => `Just published: ${t}.`, linkLabel: 'Read now' },
  { label: 'Deep Dive', text: (t) => `Deep dive: ${t} \u2014 a comprehensive guide.`, linkLabel: 'Explore' },
  { label: 'Now Live', text: (t) => `Now live: ${t}.`, linkLabel: 'Take a look' },
]

function AnnouncementTab() {
  const [data, setData] = useState<Announcement>({ id: '', text: '', link: '', linkLabel: '', active: true, color: 'midnight' })
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    Promise.all([
      apiJson<Announcement | null>('/api/admin/announcement'),
      apiJson<{ posts: Post[] }>('/api/admin/posts').catch(() => ({ posts: [] })),
    ]).then(([a, p]) => {
      if (a) setData(a)
      setPosts(p.posts)
    }).finally(() => setLoading(false))
  }, [])

  const applyTemplate = (post: Post, template: typeof TEMPLATES[number]) => {
    setData({
      ...data,
      id: `blog-${post.slug}`,
      text: template.text(post.title),
      link: `/blog/${post.slug}`,
      linkLabel: template.linkLabel,
      active: true,
    })
  }

  const save = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await api('/api/admin/announcement', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="space-y-5">
      {/* Quick template from blog posts */}
      {posts.length > 0 && (
        <div>
          <label className="block text-xs text-[#8a8a85] mb-2 uppercase tracking-wider">Quick Template</label>
          <QuickTemplatePicker posts={posts} onApply={applyTemplate} />
        </div>
      )}

      <div>
        <label className="block text-xs text-[#8a8a85] mb-1.5 uppercase tracking-wider">Announcement ID</label>
        <input
          value={data.id}
          onChange={(e) => setData({ ...data, id: e.target.value })}
          className="w-full bg-[#2a2a28] border border-[#3a3a37] rounded-lg px-4 py-2.5 text-sm text-[#fffffc] focus:outline-none focus:border-[#a3b898]/50 transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs text-[#8a8a85] mb-1.5 uppercase tracking-wider">Text</label>
        <textarea
          value={data.text}
          onChange={(e) => setData({ ...data, text: e.target.value })}
          rows={2}
          className="w-full bg-[#2a2a28] border border-[#3a3a37] rounded-lg px-4 py-2.5 text-sm text-[#fffffc] focus:outline-none focus:border-[#a3b898]/50 transition-colors resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[#8a8a85] mb-1.5 uppercase tracking-wider">Link URL</label>
          <input
            value={data.link}
            onChange={(e) => setData({ ...data, link: e.target.value })}
            className="w-full bg-[#2a2a28] border border-[#3a3a37] rounded-lg px-4 py-2.5 text-sm text-[#fffffc] focus:outline-none focus:border-[#a3b898]/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-[#8a8a85] mb-1.5 uppercase tracking-wider">Link Label</label>
          <input
            value={data.linkLabel}
            onChange={(e) => setData({ ...data, linkLabel: e.target.value })}
            className="w-full bg-[#2a2a28] border border-[#3a3a37] rounded-lg px-4 py-2.5 text-sm text-[#fffffc] focus:outline-none focus:border-[#a3b898]/50 transition-colors"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setData({ ...data, active: !data.active })}
          className={`relative w-11 h-6 rounded-full transition-colors ${data.active ? 'bg-[#4a6741]' : 'bg-[#3a3a37]'}`}
        >
          <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${data.active ? 'translate-x-5' : ''}`} />
        </button>
        <span className="text-sm text-[#8a8a85]">{data.active ? 'Active' : 'Inactive'}</span>
      </div>

      {/* Color picker */}
      <div>
        <label className="block text-xs text-[#8a8a85] mb-2 uppercase tracking-wider">Color Theme</label>
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c.key}
              onClick={() => setData({ ...data, color: c.key })}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                data.color === c.key
                  ? 'ring-2 ring-[#fffffc] bg-[#2a2a28] text-[#fffffc]'
                  : 'bg-[#2a2a28] border border-[#3a3a37] text-[#8a8a85] hover:text-[#fffffc] hover:border-[#5a5a55]'
              }`}
            >
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: c.swatch }} />
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      {data.text && (() => {
        const theme = COLOR_THEMES[data.color] || COLOR_THEMES.midnight
        return (
          <div className="rounded-lg overflow-hidden border border-[#3a3a37]">
            <div className="px-4 py-3 text-center" style={{ background: theme.bg }}>
              <p className="text-[13px] sm:text-[14px] font-medium tracking-wide" style={{ color: theme.text }}>
                {data.text}
                {data.link && (
                  <span className="ml-2.5 font-semibold underline underline-offset-[3px]" style={{ color: theme.linkText, textDecorationColor: theme.linkDecoration }}>
                    {data.linkLabel || 'Learn more'} ›
                  </span>
                )}
              </p>
            </div>
          </div>
        )
      })()}

      <button
        onClick={save}
        disabled={saving}
        className="bg-[#4a6741] hover:bg-[#5a7751] disabled:opacity-50 text-sm font-medium rounded-lg px-5 py-2.5 transition-colors"
      >
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save changes'}
      </button>
    </div>
  )
}

// ─── Subscribers Tab ─────────────────────────────────────────────────────────

function SubscribersTab() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)

  const load = useCallback(async () => {
    try {
      const data = await apiJson<{ subscribers: Subscriber[]; total: number }>('/api/admin/subscribers')
      setSubscribers(data.subscribers)
      setTotal(data.total)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (index: number) => {
    if (!confirm('Remove this subscriber?')) return
    setDeleting(index)
    try {
      await api(`/api/admin/subscribers?index=${index}`, { method: 'DELETE' })
      await load()
    } finally {
      setDeleting(null)
    }
  }

  const exportEmails = () => {
    const emails = subscribers.map((s) => s.email).join('\n')
    navigator.clipboard.writeText(emails)
    alert(`${subscribers.length} emails copied to clipboard.`)
  }

  if (loading) return <Spinner />

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#8a8a85]">{total} subscriber{total !== 1 ? 's' : ''}</p>
        {subscribers.length > 0 && (
          <button
            onClick={exportEmails}
            className="text-sm text-[#a3b898] hover:text-[#fffffc] transition-colors"
          >
            Copy all emails
          </button>
        )}
      </div>

      {subscribers.length === 0 ? (
        <p className="text-sm text-[#5a5a55]">No subscribers yet.</p>
      ) : (
        <div className="border border-[#3a3a37] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#3a3a37] bg-[#2a2a28]">
                <th className="text-left px-4 py-2.5 text-xs text-[#8a8a85] uppercase tracking-wider font-medium">Email</th>
                <th className="text-left px-4 py-2.5 text-xs text-[#8a8a85] uppercase tracking-wider font-medium">Date</th>
                <th className="w-16" />
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s, i) => (
                <tr key={i} className="border-b border-[#3a3a37] last:border-0">
                  <td className="px-4 py-2.5 text-[#fffffc]">{s.email}</td>
                  <td className="px-4 py-2.5 text-[#8a8a85]">{new Date(s.subscribedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => handleDelete(i)}
                      disabled={deleting === i}
                      className="text-[#5a5a55] hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      {deleting === i ? '...' : '✕'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── Posts Tab ───────────────────────────────────────────────────────────────

function PostsTab() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiJson<{ posts: Post[] }>('/api/admin/posts')
      .then((data) => setPosts(data.posts))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <div>
      <p className="text-sm text-[#8a8a85] mb-4">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>

      {posts.length === 0 ? (
        <p className="text-sm text-[#5a5a55]">No posts found.</p>
      ) : (
        <div className="border border-[#3a3a37] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#3a3a37] bg-[#2a2a28]">
                <th className="text-left px-4 py-2.5 text-xs text-[#8a8a85] uppercase tracking-wider font-medium">Title</th>
                <th className="text-left px-4 py-2.5 text-xs text-[#8a8a85] uppercase tracking-wider font-medium">Date</th>
                <th className="text-left px-4 py-2.5 text-xs text-[#8a8a85] uppercase tracking-wider font-medium">Slug</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.slug} className="border-b border-[#3a3a37] last:border-0">
                  <td className="px-4 py-2.5">
                    <a href={`/blog/${p.slug}`} className="text-[#a3b898] hover:text-[#fffffc] transition-colors">
                      {p.title}
                    </a>
                  </td>
                  <td className="px-4 py-2.5 text-[#8a8a85]">{p.date ? new Date(p.date).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-2.5 text-[#5a5a55] font-mono text-xs">{p.slug}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── Quick Template Picker ────────────────────────────────────────────────────

function QuickTemplatePicker({ posts, onApply }: { posts: Post[]; onApply: (post: Post, template: typeof TEMPLATES[number]) => void }) {
  const [selectedPost, setSelectedPost] = useState<string>('')
  const [open, setOpen] = useState(false)

  const post = posts.find((p) => p.slug === selectedPost)

  return (
    <div className="bg-[#2a2a28] border border-[#3a3a37] rounded-lg p-4 space-y-3">
      {/* Post selector */}
      <div>
        <label className="block text-xs text-[#6a6a65] mb-1.5">Select a blog post</label>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between bg-[#21211f] border border-[#3a3a37] rounded-lg px-4 py-2.5 text-sm text-left focus:outline-none focus:border-[#a3b898]/50 transition-colors"
        >
          <span className={post ? 'text-[#fffffc]' : 'text-[#5a5a55]'}>
            {post ? post.title : 'Choose a post...'}
          </span>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className={`text-[#5a5a55] transition-transform ${open ? 'rotate-180' : ''}`}>
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {open && (
          <div className="mt-1 max-h-48 overflow-y-auto bg-[#21211f] border border-[#3a3a37] rounded-lg">
            {posts.map((p) => (
              <button
                key={p.slug}
                onClick={() => { setSelectedPost(p.slug); setOpen(false) }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-[#2a2a28] transition-colors ${
                  p.slug === selectedPost ? 'text-[#a3b898]' : 'text-[#8a8a85]'
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Template buttons */}
      {post && (
        <div>
          <label className="block text-xs text-[#6a6a65] mb-1.5">Pick a style</label>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.label}
                onClick={() => onApply(post, t)}
                className="px-3 py-1.5 bg-[#21211f] border border-[#3a3a37] rounded-lg text-xs text-[#8a8a85] hover:text-[#fffffc] hover:border-[#5a5a55] transition-colors"
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-[#5a5a55]">Clicking a style will auto-fill all fields below. You can still edit them.</p>
        </div>
      )}
    </div>
  )
}

// ─── Shared ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-5 h-5 border-2 border-[#a3b898] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
