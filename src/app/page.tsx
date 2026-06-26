import Link from 'next/link'

const DepgrowLogo = () => (
  <svg width="28" height="28" viewBox="0 0 22 22" fill="none">
    <path d="M4 16 C4 16 7 6 11 6 C15 6 18 16 18 16" stroke="#0E7A5A" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M8 11 C8 11 9.5 14 11 14 C12.5 14 14 11 14 11" stroke="#16A97D" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="11" cy="6" r="2" fill="#0E7A5A"/>
  </svg>
)

export default function LandingPage() {
  return (
    <div style={{ background: '#040a08', minHeight: '100vh', color: '#fff' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: 56, borderBottom: '1px solid rgba(14,122,90,0.2)', background: 'rgba(4,10,8,0.95)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 17 }}>
          <DepgrowLogo />
          <span><span style={{ color: '#0E7A5A' }}>Dep</span><span style={{ color: '#16A97D' }}>grow</span></span>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.35)', marginLeft: 4 }}>Widget</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/login" style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}>Login</Link>
          <Link href="/register" style={{ fontSize: 13, fontWeight: 700, color: '#000', background: 'linear-gradient(100deg,#0E7A5A,#16A97D)', padding: '8px 18px', borderRadius: 8, textDecoration: 'none' }}>Get started free</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '5rem 2rem 4rem', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#1aff9c', background: 'rgba(26,255,156,0.08)', border: '1px solid rgba(26,255,156,0.25)', padding: '7px 16px', borderRadius: 30, marginBottom: 24, fontWeight: 700 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1aff9c', boxShadow: '0 0 8px #1aff9c', display: 'inline-block' }} />
          WhatsApp Widget SaaS
        </div>
        <h1 style={{ fontSize: 'clamp(36px,5vw,58px)', fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 20 }}>
          Add a WhatsApp button to{' '}
          <span style={{ background: 'linear-gradient(100deg,#1aff9c,#3fd0ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>any website</span>
          {' '}in 60 seconds
        </h1>
        <p style={{ fontSize: 17, color: '#9ab8ad', lineHeight: 1.75, marginBottom: 36, maxWidth: 520, margin: '0 auto 36px' }}>
          One line of code. Instant WhatsApp chat. Full click analytics. Built for Depgrow clients and beyond.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/register" style={{ background: 'linear-gradient(100deg,#0E7A5A,#16A97D)', color: '#fff', padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 24px rgba(26,255,156,0.2)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            🚀 Create free widget
          </Link>
          <Link href="/login" style={{ background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
            Sign in →
          </Link>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '2rem 2rem 5rem', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {[
          { icon: '⚡', title: '60-second setup', desc: 'Paste one script tag into your website. The button appears instantly — no React, no build step, no dependencies.' },
          { icon: '🎨', title: 'Fully customisable', desc: 'Choose position, colors, size, tooltip text, and pre-filled message. Preview changes live before publishing.' },
          { icon: '📊', title: 'Click analytics', desc: 'Track every click with country, device, and daily breakdowns. Know exactly where your WhatsApp leads come from.' },
          { icon: '🔒', title: 'Domain whitelisting', desc: 'Lock each widget to specific domains. Your embed code only works where you intend it to.' },
          { icon: '🌍', title: 'Works everywhere', desc: 'Zero-conflict isolated styles. Works on WordPress, Webflow, Wix, Shopify, plain HTML — any website.' },
          { icon: '♾️', title: 'Multiple widgets', desc: 'Create separate widgets for each client or brand. Different numbers, messages, and designs — all in one dashboard.' },
        ].map(f => (
          <div key={f.title} style={{ background: 'rgba(14,122,90,0.06)', border: '1px solid rgba(14,122,90,0.2)', borderRadius: 16, padding: '1.75rem' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: '#fff' }}>{f.title}</h3>
            <p style={{ fontSize: 13.5, color: '#9ab8ad', lineHeight: 1.65 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg,#0A2E22,#0e3d2a)', padding: '4rem 2rem', textAlign: 'center', borderTop: '1px solid rgba(14,122,90,0.3)' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>Ready to add WhatsApp to your website?</h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', marginBottom: 28 }}>Free to start. One line of code. Live in 60 seconds.</p>
        <Link href="/register" style={{ background: 'linear-gradient(100deg,#0E7A5A,#16A97D)', color: '#fff', padding: '14px 32px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
          Create your free widget →
        </Link>
      </div>

      {/* Footer */}
      <div style={{ background: '#0A2E22', padding: '1.5rem 2rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
          © 2026 <Link href="https://depgrow.in" style={{ color: '#16A97D', textDecoration: 'none' }}>Depgrow</Link> · Built in Hyderabad 🇮🇳
        </p>
      </div>
    </div>
  )
}
