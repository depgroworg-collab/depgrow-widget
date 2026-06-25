import { createServerActionClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import AnalyticsCharts from '@/components/dashboard/AnalyticsCharts'

export default async function WidgetAnalyticsPage({ params }: { params: { id: string } }) {
  const sb = await createServerActionClient()
  const { data: { user } } = await sb.auth.getUser()

  const { data: widget } = await sb
    .from('widgets')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user!.id)
    .single()

  if (!widget) notFound()

  // Last 30 days clicks grouped by day
  const { data: clicksByDay } = await sb
    .from('click_events')
    .select('clicked_at, device, country')
    .eq('widget_id', params.id)
    .gte('clicked_at', new Date(Date.now() - 30 * 86400000).toISOString())
    .order('clicked_at', { ascending: true })

  // Aggregate by day
  const dayMap = new Map<string, number>()
  const deviceMap = new Map<string, number>()
  const countryMap = new Map<string, number>()

  for (const c of clicksByDay ?? []) {
    const day = c.clicked_at.slice(0, 10)
    dayMap.set(day, (dayMap.get(day) || 0) + 1)
    deviceMap.set(c.device, (deviceMap.get(c.device) || 0) + 1)
    if (c.country) countryMap.set(c.country, (countryMap.get(c.country) || 0) + 1)
  }

  const clicks_by_day    = Array.from(dayMap, ([date, count]) => ({ date, count }))
  const device_breakdown = Array.from(deviceMap, ([device, count]) => ({ device, count }))
  const top_countries    = Array.from(countryMap, ([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count).slice(0, 8)

  const { data: summary } = await sb
    .from('widget_analytics')
    .select('*')
    .eq('widget_id', params.id)
    .single()

  return (
    <>
      <div className="topbar">
        <span className="topbar-title">Analytics — {widget.name}</span>
      </div>
      <div className="page-content">
        <AnalyticsCharts
          widget={widget}
          summary={summary}
          clicks_by_day={clicks_by_day}
          device_breakdown={device_breakdown}
          top_countries={top_countries}
        />
      </div>
    </>
  )
}
