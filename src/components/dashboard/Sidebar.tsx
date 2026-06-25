'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface Props { user: { email: string; name: string; plan: string } }

const nav = [
  { href: '/dashboard',            label: 'Widgets',    icon: '💬' },
  { href: '/dashboard/analytics',  label: 'Analytics',  icon: '📊' },
  { href: '/dashboard/settings',   label: 'Settings',   icon: '⚙️' },
]

export default function Sidebar({ user }: Props) {
  const pathname = usePathname()
  const router   = useRouter()

  async function signOut() {
    const sb = createClient()
    await sb.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span style={{color:'var(--green)'}}>Dep</span>grow
        <span style={{fontSize:11,fontWeight:400,color:'var(--text-dim)',marginLeft:2}}>Widget</span>
      </div>

      <div className="sidebar-section">Menu</div>
      {nav.map(n => (
        <Link
          key={n.href}
          href={n.href}
          className={`sidebar-link${pathname === n.href || (n.href !== '/dashboard' && pathname.startsWith(n.href)) ? ' active' : ''}`}
        >
          <span style={{fontSize:16}}>{n.icon}</span>
          {n.label}
        </Link>
      ))}

      <div style={{marginTop:'auto', padding:'1.25rem', borderTop:'1px solid var(--border)'}}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
          {user.name || user.email}
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
          <span className={`badge badge-${user.plan === 'agency' ? 'amber' : user.plan === 'pro' ? 'green' : 'gray'}`}>
            {user.plan}
          </span>
          <button onClick={signOut} className="btn btn-ghost btn-sm" style={{padding:'4px 10px',fontSize:12}}>
            Sign out
          </button>
        </div>
      </div>
    </aside>
  )
}
