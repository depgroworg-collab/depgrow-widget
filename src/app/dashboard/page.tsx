import { createServerActionClient } from '@/lib/supabase.server'
import Link from 'next/link'
import WidgetCard from '@/components/dashboard/WidgetCard'
import type { Widget } from '@/types'

export default async function DashboardPage() {
  const sb = await createServerActionClient()
  const { data: { user } } = await sb.auth.getUser()

  const { data: widgets } = await sb
    .from('widgets')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const { data: analytics } = await sb
    .from('widget_analytics')
    .select('*')
    .eq('user_id', user!.id)

  const analyticsMap = new Map(analytics?.map(a => [a.widget_id, a]) ?? [])
  const totalClicks = analytics?.reduce((s, a) => s + (a.total_clicks || 0), 0) ?? 0

  return (
    <>
      <div className="topbar">
        <span className="topbar-title">My Widgets</span>
        <Link href="/dashboard/widgets/new" className="btn btn-primary btn-sm">+ New widget</Link>
      </div>

      <div className="page-content">
        {/* Summary strip */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:'2rem'}}>
          {[
            { label: 'Total widgets',    val: widgets?.length ?? 0 },
            { label: 'Total clicks',     val: totalClicks },
            { label: 'Active widgets',   val: widgets?.filter(w => w.is_active).length ?? 0 },
          ].map(s => (
            <div key={s.label} className="card stat-card">
              <div className="stat-val">{s.val}</div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Widget list */}
        {!widgets || widgets.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">💬</div>
            <h3>No widgets yet</h3>
            <p>Create your first WhatsApp widget and embed it on any website in under 60 seconds.</p>
            <Link href="/dashboard/widgets/new" className="btn btn-primary">Create first widget →</Link>
          </div>
        ) : (
          <div className="widget-grid">
            {widgets.map((w: Widget) => (
              <WidgetCard
                key={w.id}
                widget={w}
                analytics={analyticsMap.get(w.id) ?? null}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
