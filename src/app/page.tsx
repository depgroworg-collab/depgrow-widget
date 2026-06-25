import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-logo"><span>Dep</span>grow Widget</div>
        <div className="landing-nav-links">
          <Link href="/login" className="btn btn-ghost btn-sm">Login</Link>
          <Link href="/register" className="btn btn-primary btn-sm">Get started free</Link>
        </div>
      </nav>

      <div className="landing-hero">
        <div className="landing-eyebrow">
          <span style={{width:6,height:6,borderRadius:'50%',background:'var(--green)',display:'inline-block'}}/>
          WhatsApp Widget SaaS
        </div>
        <h1>Add a WhatsApp button to <em>any website</em> in 60 seconds</h1>
        <p>One line of code. Instant WhatsApp chat. Full analytics. Built for Depgrow clients and beyond.</p>
        <div className="landing-actions">
          <Link href="/register" className="btn btn-primary btn-lg">🚀 Create free widget</Link>
          <Link href="/login" className="btn btn-ghost btn-lg">Sign in →</Link>
        </div>
      </div>

      <div className="landing-features">
        {[
          { icon: '⚡', title: '60-second setup', desc: 'Paste one script tag into your website. The button appears instantly — no React, no build step, no dependencies.' },
          { icon: '🎨', title: 'Fully customisable', desc: 'Choose position, colors, button size, tooltip text, and pre-filled message. Preview changes live before publishing.' },
          { icon: '📊', title: 'Click analytics', desc: 'Track every click with country, device, and daily breakdowns. Know exactly where your WhatsApp leads come from.' },
          { icon: '🔒', title: 'Domain whitelisting', desc: 'Lock each widget to specific domains. Your embed code only works where you intend it to.' },
          { icon: '🌍', title: 'Works everywhere', desc: 'Zero-conflict isolated styles. Works on WordPress, Webflow, Wix, Shopify, plain HTML — any website.' },
          { icon: '♾️', title: 'Multiple widgets', desc: 'Create separate widgets for each client or brand. Different numbers, messages, and designs — all in one dashboard.' },
        ].map(f => (
          <div key={f.title} className="feature-card">
            <div className="feature-icon" style={{fontSize:22}}>{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      <div style={{textAlign:'center',padding:'3rem 2rem 5rem',borderTop:'1px solid var(--border)'}}>
        <p style={{fontSize:13,color:'var(--text-dim)'}}>© 2026 Depgrow. Built with ❤️ in Hyderabad.</p>
      </div>
    </div>
  )
}
