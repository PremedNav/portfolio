'use client'

import { useState, useEffect } from 'react'

interface Subscriber {
  email: string
  date: string
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [copied, setCopied] = useState(false)

  // Check auth on mount
  useEffect(() => {
    fetch('/api/admin/auth')
      .then((r) => r.json())
      .then((data) => {
        setAuthenticated(data.authenticated)
        if (data.authenticated) fetchSubscribers()
      })
      .finally(() => setLoading(false))
  }, [])

  const fetchSubscribers = async () => {
    const res = await fetch('/api/admin/subscribers')
    if (res.ok) {
      const data = await res.json()
      setSubscribers(data.subscribers || [])
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoginLoading(true)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setAuthenticated(true)
        setPassword('')
        fetchSubscribers()
      } else {
        setError(data.error || 'Login failed.')
      }
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    setAuthenticated(false)
    setSubscribers([])
  }

  const copyAllEmails = () => {
    const emails = subscribers.map((s) => s.email).join(', ')
    navigator.clipboard.writeText(emails)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f8f6] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#181816] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Login view
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#f8f8f6] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1
            className="text-[1.8rem] tracking-[-0.03em] text-[#181816] mb-2 text-center"
            style={{ fontFamily: "'robert-medium', 'general', sans-serif" }}
          >
            Admin
          </h1>
          <p className="text-[14px] text-[#8a8a7e] mb-8 text-center">
            Enter your password to continue.
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-[#d0d0c6] bg-white text-[14px] text-[#181816] placeholder:text-[#b0b0a4] outline-none focus:border-[#181816] transition-colors mb-3"
            />

            {error && (
              <p className="text-[13px] text-red-500 mb-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={loginLoading || !password}
              className="w-full px-6 py-3 rounded-xl bg-[#181816] text-white text-[13px] font-medium tracking-wide hover:bg-[#2a2a24] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Dashboard view
  return (
    <div className="min-h-screen bg-[#f8f8f6]">
      <header className="px-8 md:px-14 lg:px-16 py-6 flex items-center justify-between border-b border-[#e0e0d8]">
        <h1
          className="text-[1.3rem] tracking-[-0.02em] text-[#181816]"
          style={{ fontFamily: "'robert-medium', 'general', sans-serif" }}
        >
          Newsletter Subscribers
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-[13px] text-[#8a8a7e]">
            {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={handleLogout}
            className="text-[13px] text-[#8a8a7e] hover:text-[#181816] transition-colors underline underline-offset-2 decoration-[#c0c0b4]"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="px-8 md:px-14 lg:px-16 py-10">
        {subscribers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#8a8a7e] text-[15px]">No subscribers yet.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-[13px] text-[#8a8a7e]">
                Showing {subscribers.length} email{subscribers.length !== 1 ? 's' : ''}
              </p>
              <button
                onClick={copyAllEmails}
                className="px-4 py-2 rounded-lg border border-[#d0d0c6] text-[13px] text-[#181816] hover:bg-[#181816] hover:text-white transition-all"
              >
                {copied ? 'Copied!' : 'Copy all emails'}
              </button>
            </div>

            <div className="bg-white rounded-xl border border-[#e0e0d8] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e0e0d8]">
                    <th className="text-left px-6 py-4 text-[12px] font-semibold text-[#8a8a7e] uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left px-6 py-4 text-[12px] font-semibold text-[#8a8a7e] uppercase tracking-wider">
                      Subscribed
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub, i) => (
                    <tr
                      key={sub.email}
                      className={i < subscribers.length - 1 ? 'border-b border-[#f0f0ea]' : ''}
                    >
                      <td className="px-6 py-4 text-[14px] text-[#181816]">
                        {sub.email}
                      </td>
                      <td className="px-6 py-4 text-[13px] text-[#8a8a7e]">
                        {new Date(sub.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
