import { createServerActionClient } from '@/lib/supabase'
import Link from 'next/link'

export default async function AnalyticsOverviewPage() {
  const sb = await createServerActionClient()
  const { data: { user } } = await sb.auth.getUser()

  const { data: analytics } = await sb
    .from('widget_analytics')
    .select('*')
    .eq('user_id', user!.id)
    .order('total_clicks', { ascending: false })

  const total       = analytics?.reduce((s, a) => s + (a.total_clicks      || 0), 0) ?? 0
  const todayTotal  = analytics?.reduce((s, a) => s + (a.today_clicks      || 0), 0) ?? 0
  const weekTotal   = analytics?.reduce((s, a) => s + (a.this_week_clicks  || 0), 0) ?? 0
  const monthTotal  = analytics?.reduce((s, a) => s + (a.this_month_clicks || 0), 0) ?? 0

  return (
    <>
      <div className="topbar"><span className="topbar-title">Analytics Overview</span></div>
      <div className="page-content">
        <div className="analytics-grid">
          {[
            { label: 'All-time clicks',  val: total },
            { label: 'This month',       val: monthTotal },
            { label: 'This week',        val: weekTotal },
            { label: 'Today',            val: todayTotal },
          ].map(s => (
            <div key={s.label} className="card stat-card">
              <div className="stat-val">{s.val}</div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {!analytics || analytics.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📊</div>
            <h3>No data yet</h3>
            <p>Create a widget and embed it on your website to start tracking clicks.</p>
            <Link href="/dashboard/widgets/new" className="btn btn-primary">Create first widget →</Link>
          </div>
        ) : (
          <div className="card">
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: '1.25rem' }}>Per-widget breakdown</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Widget', 'All time', 'This month', 'This week', 'Today', ''].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-sec)', fontWeight: 600, fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {analytics.map(a => (
                  <tr key={a.widget_id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{a.widget_name}</td>
                    <td style={{ padding: '10px 12px' }}>{a.total_clicks}</td>
                    <td style={{ padding: '10px 12px' }}>{a.this_month_clicks}</td>
                    <td style={{ padding: '10px 12px' }}>{a.this_week_clicks}</td>
                    <td style={{ padding: '10px 12px' }}>{a.today_clicks}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <Link href={`/dashboard/widgets/${a.widget_id}/analytics`} className="btn btn-ghost btn-sm">View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
