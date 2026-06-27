'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const Logo = () => (
  <svg width="28" height="28" viewBox="0 0 22 22" fill="none">
    <path d="M4 16 C4 16 7 6 11 6 C15 6 18 16 18 16" stroke="#0E7A5A" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M8 11 C8 11 9.5 14 11 14 C12.5 14 14 11 14 11" stroke="#16A97D" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="11" cy="6" r="2" fill="#0E7A5A"/>
  </svg>
)

function LoginInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    const sb = createClient()
    const { error: err } = await sb.auth.signInWithPassword({ email, password })
    if (err) { setError(err.message); setLoading(false); return }
    const redirect = searchParams.get('redirect') ?? '/dashboard'
    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <Logo />
          <div className="auth-logo-text">
            <span style={{color:'#0E7A5A'}}>Dep</span><span style={{color:'#16A97D'}}>grow</span>
            <span className="auth-logo-sub">Widget</span>
          </div>
        </div>
        <h1>Welcome back</h1>
        <p>Sign in to your dashboard</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">⚠ {error}</div>}
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input className="auth-input" type="email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input className="auth-input" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? '⏳ Signing in…' : 'Sign in →'}
          </button>
        </form>
        <div className="auth-footer">
          No account? <Link href="/register">Create one free</Link>
        </div>
        <div className="auth-back">
          <Link href="/">← Back to home</Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="auth-wrap"><div style={{color:'#16A97D'}}>Loading…</div></div>}>
      <LoginInner />
    </Suspense>
  )
}
