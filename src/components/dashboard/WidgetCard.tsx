'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Widget } from '@/types'

interface Props {
  widget: Widget
  analytics: any
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://widget.depgrow.in'

export default function WidgetCard({ widget, analytics }: Props) {
  const router  = useRouter()
  const [copied, setCopied]   = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [toggling, setToggling] = useState(false)

  const embedCode = `<script src="${APP_URL}/embed.js" data-widget="${widget.slug}" async></script>`

  async function copyEmbed() {
    await navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function toggleActive() {
    setToggling(true)
    await fetch(`/api/widgets/${widget.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !widget.is_active }),
    })
    router.refresh()
    setToggling(false)
  }

  async function deleteWidget() {
    if (!confirm(`Delete "${widget.name}"? This cannot be undone.`)) return
    setDeleting(true)
    await fetch(`/api/widgets/${widget.id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div className="card widget-card">
      {/* Header */}
      <div className="widget-card-head">
        <div>
          <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>{widget.name}</div>
          <div className="widget-card-meta">
            <span className={`badge badge-${widget.is_active ? 'green' : 'red'}`}>
              {widget.is_active ? '● Active' : '○ Inactive'}
            </span>
            <span className="widget-phone">📱 +{widget.phone}</span>
          </div>
        </div>
        <div className="widget-card-actions">
          <button
            onClick={toggleActive}
            disabled={toggling}
            className="btn btn-ghost btn-sm"
            title={widget.is_active ? 'Deactivate' : 'Activate'}
          >
            {toggling ? <span className="spinner" style={{width:14,height:14}}/> : widget.is_active ? '⏸' : '▶'}
          </button>
          <Link href={`/dashboard/widgets/${widget.id}/edit`} className="btn btn-ghost btn-sm" title="Edit">✏️</Link>
          <Link href={`/dashboard/widgets/${widget.id}/analytics`} className="btn btn-ghost btn-sm" title="Analytics">📊</Link>
          <button onClick={deleteWidget} disabled={deleting} className="btn btn-danger btn-sm" title="Delete">
            {deleting ? <span className="spinner" style={{width:14,height:14}}/> : '🗑'}
          </button>
        </div>
      </div>

      {/* Embed snippet */}
      <div>
        <div style={{fontSize:11,color:'var(--text-dim)',marginBottom:4,fontWeight:600,letterSpacing:0.5}}>EMBED CODE</div>
        <div className="widget-embed">{embedCode}</div>
        <button onClick={copyEmbed} className="btn btn-ghost btn-sm" style={{marginTop:6,width:'100%',justifyContent:'center'}}>
          {copied ? '✅ Copied!' : '📋 Copy embed code'}
        </button>
      </div>

      {/* Stats */}
      <div className="widget-stats-row">
        {[
          { val: analytics?.total_clicks ?? 0,      lbl: 'Total clicks' },
          { val: analytics?.this_week_clicks ?? 0,  lbl: 'This week' },
          { val: analytics?.today_clicks ?? 0,      lbl: 'Today' },
        ].map(s => (
          <div key={s.lbl} className="widget-stat">
            <div className="widget-stat-val">{s.val}</div>
            <div className="widget-stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Color preview pill */}
      <div style={{display:'flex',alignItems:'center',gap:8,fontSize:12,color:'var(--text-dim)'}}>
        <span style={{width:16,height:16,borderRadius:'50%',background:widget.button_color,border:'1px solid rgba(255,255,255,0.15)',flexShrink:0}}/>
        {widget.position} · {widget.button_size} · {widget.button_label}
      </div>
    </div>
  )
}
