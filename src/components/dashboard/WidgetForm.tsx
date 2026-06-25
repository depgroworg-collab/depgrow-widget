'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Widget } from '@/types'
import { buildWhatsAppUrl, BUTTON_SIZE_MAP } from '@/lib/utils'

type Mode = 'create' | 'edit'
interface Props { mode: Mode; initialData?: Widget }

const DEFAULT: Partial<Widget> = {
  name: '',
  phone: '',
  pre_filled_message: 'Hi! I found your website and wanted to reach out.',
  button_label: 'Chat with us',
  tooltip_text: '👋 Need help? Chat with us!',
  position: 'bottom-right',
  button_color: '#25D366',
  icon_color: '#ffffff',
  button_size: 'md',
  show_tooltip: true,
  tooltip_delay: 3000,
  allowed_domains: [],
  is_active: true,
}

export default function WidgetForm({ mode, initialData }: Props) {
  const router = useRouter()
  const [form, setForm]     = useState<Partial<Widget>>(initialData || DEFAULT)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState<string | null>(null)
  const [tab, setTab]       = useState<'general' | 'design' | 'advanced'>('general')
  const [domainInput, setDomainInput] = useState('')

  function set<K extends keyof Widget>(key: K, val: Widget[K]) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    const method  = mode === 'create' ? 'POST' : 'PATCH'
    const url     = mode === 'create' ? '/api/widgets' : `/api/widgets/${initialData!.id}`
    const res     = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const payload = await res.json()
    if (!res.ok) { setError(payload.error || 'Something went wrong.'); setLoading(false); return }
    router.push('/dashboard')
    router.refresh()
  }

  function addDomain() {
    const d = domainInput.trim().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')
    if (!d) return
    set('allowed_domains', [...(form.allowed_domains || []), d])
    setDomainInput('')
  }

  function removeDomain(d: string) {
    set('allowed_domains', (form.allowed_domains || []).filter(x => x !== d))
  }

  const btnSize = BUTTON_SIZE_MAP[form.button_size || 'md']

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
      {/* ── Form ── */}
      <div>
        <div className="tabs">
          {(['general','design','advanced'] as const).map(t => (
            <button key={t} className={`tab${tab===t?' active':''}`} onClick={()=>setTab(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {tab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="field">
                <label className="label">Widget name *</label>
                <input className="input" placeholder="e.g. Main Site Widget" value={form.name||''} onChange={e=>set('name',e.target.value)} required />
                <span className="hint">For your reference only — not shown to visitors.</span>
              </div>
              <div className="field">
                <label className="label">WhatsApp number *</label>
                <input className="input" placeholder="918309553962 (with country code, no +)" value={form.phone||''} onChange={e=>set('phone',e.target.value)} required />
                <span className="hint">Include country code. E.g. 91 for India.</span>
              </div>
              <div className="field">
                <label className="label">Pre-filled message *</label>
                <textarea className="input textarea" placeholder="Hi! I found your website…" value={form.pre_filled_message||''} onChange={e=>set('pre_filled_message',e.target.value)} required />
              </div>
              <div className="field">
                <label className="label">Button label</label>
                <input className="input" placeholder="Chat with us" value={form.button_label||''} onChange={e=>set('button_label',e.target.value)} />
              </div>
              <div className="field">
                <label className="label">Tooltip text</label>
                <input className="input" placeholder="👋 Need help? Chat with us!" value={form.tooltip_text||''} onChange={e=>set('tooltip_text',e.target.value)} />
              </div>
            </div>
          )}

          {tab === 'design' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="field">
                <label className="label">Position</label>
                <select className="input select" value={form.position||'bottom-right'} onChange={e=>set('position',e.target.value as Widget['position'])}>
                  <option value="bottom-right">Bottom right</option>
                  <option value="bottom-left">Bottom left</option>
                </select>
              </div>
              <div className="field">
                <label className="label">Button size</label>
                <select className="input select" value={form.button_size||'md'} onChange={e=>set('button_size',e.target.value as Widget['button_size'])}>
                  <option value="sm">Small (48px)</option>
                  <option value="md">Medium (56px)</option>
                  <option value="lg">Large (64px)</option>
                </select>
              </div>
              <div className="wf-grid">
                <div className="field">
                  <label className="label">Button color</label>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <input type="color" className="color-input" value={form.button_color||'#25D366'} onChange={e=>set('button_color',e.target.value)} />
                    <input className="input" value={form.button_color||'#25D366'} onChange={e=>set('button_color',e.target.value)} style={{fontFamily:'monospace'}} />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Icon color</label>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <input type="color" className="color-input" value={form.icon_color||'#ffffff'} onChange={e=>set('icon_color',e.target.value)} />
                    <input className="input" value={form.icon_color||'#ffffff'} onChange={e=>set('icon_color',e.target.value)} style={{fontFamily:'monospace'}} />
                  </div>
                </div>
              </div>
              <div>
                <div className="wf-row">
                  <div><div className="wf-row-label">Show tooltip</div><div className="wf-row-hint">Display a message bubble above the button</div></div>
                  <div className={`toggle${form.show_tooltip?' on':''}`} onClick={()=>set('show_tooltip',!form.show_tooltip)} role="switch" aria-checked={!!form.show_tooltip}/>
                </div>
                {form.show_tooltip && (
                  <div className="field" style={{marginTop:'1rem'}}>
                    <label className="label">Tooltip delay (ms)</label>
                    <input className="input" type="number" min={0} max={10000} step={500} value={form.tooltip_delay??3000} onChange={e=>set('tooltip_delay',+e.target.value)} />
                    <span className="hint">How long after page load to show the tooltip. 0 = immediately.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'advanced' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="wf-row">
                <div><div className="wf-row-label">Widget active</div><div className="wf-row-hint">Disable to hide without deleting</div></div>
                <div className={`toggle${form.is_active?' on':''}`} onClick={()=>set('is_active',!form.is_active)} role="switch" aria-checked={!!form.is_active}/>
              </div>
              <div className="field">
                <label className="label">Allowed domains</label>
                <div style={{display:'flex',gap:8}}>
                  <input className="input" placeholder="example.com" value={domainInput} onChange={e=>setDomainInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&(e.preventDefault(),addDomain())} />
                  <button type="button" className="btn btn-ghost" onClick={addDomain}>Add</button>
                </div>
                <span className="hint">Leave empty to allow all domains. Add domains one by one (no https://).</span>
                {(form.allowed_domains||[]).length > 0 && (
                  <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:8}}>
                    {(form.allowed_domains||[]).map(d=>(
                      <span key={d} style={{background:'var(--bg3)',border:'1px solid var(--border-md)',borderRadius:6,padding:'3px 10px',fontSize:12,display:'flex',alignItems:'center',gap:6}}>
                        {d}
                        <button type="button" onClick={()=>removeDomain(d)} style={{background:'none',border:'none',color:'var(--text-sec)',cursor:'pointer',padding:0,fontSize:14,lineHeight:1}}>×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {error && <p className="error-msg" style={{marginTop:'1rem'}}>⚠ {error}</p>}

          <div style={{marginTop:'1.5rem',display:'flex',gap:10}}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner"/>Saving…</> : mode==='create' ? 'Create widget →' : 'Save changes →'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={()=>router.push('/dashboard')}>Cancel</button>
          </div>
        </form>
      </div>

      {/* ── Live Preview ── */}
      <div style={{ position: 'sticky', top: '1rem' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-sec)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Live Preview</div>
        <div className="preview-frame">
          <div className="preview-frame-toolbar">
            <div className="preview-dot" style={{ background: '#FF5F57' }} />
            <div className="preview-dot" style={{ background: '#FFBD2E' }} />
            <div className="preview-dot" style={{ background: '#28CA41' }} />
            <div className="preview-url">yourwebsite.com</div>
          </div>
          <div className="preview-content" style={{ minHeight: 280, position: 'relative' }}>
            <div className="preview-placeholder-lines">
              {[80,60,70,50,65].map((w,i) => <div key={i} style={{width:`${w}%`}} />)}
            </div>

            {/* Tooltip */}
            {form.show_tooltip && form.tooltip_text && (
              <div style={{
                position: 'absolute',
                [form.position==='bottom-right'?'right':'left']: 72,
                bottom: 16,
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 500,
                color: '#111',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              }}>
                {form.tooltip_text}
                <div style={{ position: 'absolute', [form.position==='bottom-right'?'right':'left']: -6, bottom: 10, width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', [form.position==='bottom-right'?'borderLeft':'borderRight']: '6px solid #fff' }} />
              </div>
            )}

            {/* Button */}
            <a
              href={buildWhatsAppUrl(form.phone||'918000000000', form.pre_filled_message||'')}
              target="_blank" rel="noopener noreferrer"
              style={{
                position: 'absolute',
                [form.position==='bottom-right'?'right':'left']: 16,
                bottom: 16,
                width: btnSize.button,
                height: btnSize.button,
                borderRadius: '50%',
                background: form.button_color || '#25D366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                textDecoration: 'none',
                transition: 'transform 0.15s',
              }}
            >
              <svg width={btnSize.icon} height={btnSize.icon} viewBox="0 0 24 24" fill={form.icon_color||'#fff'}>
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.51 2 12.04 2zm0 18.13h-.01c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.53 3.69-8.22 8.27-8.22 2.21 0 4.28.86 5.84 2.42a8.2 8.2 0 0 1 2.42 5.83c0 4.53-3.7 8.19-8.27 8.19zm4.52-6.15c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.99-1.22-.73-.66-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.41 1.02 2.58.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.23-.17-.48-.29z"/>
              </svg>
            </a>
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 10, textAlign: 'center' }}>
          Preview updates live as you type
        </p>
      </div>
    </div>
  )
}
