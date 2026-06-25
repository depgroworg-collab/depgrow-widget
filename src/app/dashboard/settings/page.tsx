'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export default function SettingsPage() {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [toast, setToast]       = useState<string | null>(null)

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(({ data }) => {
      if (data.user) setEmail(data.user.email || '')
    })
    sb.from('profiles').select('name').single().then(({ data }) => {
      if (data) setName((data as any).name || '')
    })
  }, [])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (user) {
      await sb.from('profiles').update({ name }).eq('id', user.id)
      showToast('Profile saved ✅')
    }
    setLoading(false)
  }

  return (
    <>
      <div className="topbar"><span className="topbar-title">Settings</span></div>
      <div className="page-content" style={{ maxWidth: 520 }}>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: '1.5rem' }}>Account</div>
          <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="field">
              <label className="label">Name</label>
              <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div className="field">
              <label className="label">Email</label>
              <input className="input" value={email} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
              <span className="hint">Email cannot be changed here.</span>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start' }}>
              {loading ? <><span className="spinner" />Saving…</> : 'Save changes'}
            </button>
          </form>
        </div>

        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: '1rem' }}>Plan</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
            <span className="badge badge-gray" style={{ fontSize: 14, padding: '5px 14px' }}>Free plan</span>
            <span style={{ fontSize: 13, color: 'var(--text-sec)' }}>1 widget included</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-sec)', lineHeight: 1.6, marginBottom: '1rem' }}>
            Upgrade to Pro (10 widgets) or Agency (unlimited) to create more widgets and access advanced analytics.
          </p>
          <a href="mailto:hello@depgrow.in?subject=Widget%20SaaS%20Upgrade" className="btn btn-wa" style={{ alignSelf: 'flex-start', display: 'inline-flex' }}>
            Contact us to upgrade →
          </a>
        </div>
      </div>

      {toast && (
        <div className="toast success">{toast}</div>
      )}
    </>
  )
}
