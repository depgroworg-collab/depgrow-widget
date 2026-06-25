'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import type { Widget } from '@/types'

interface Props {
  widget: Widget
  summary: { total_clicks: number; today_clicks: number; this_week_clicks: number; this_month_clicks: number } | null
  clicks_by_day: { date: string; count: number }[]
  device_breakdown: { device: string; count: number }[]
  top_countries: { country: string; count: number }[]
}

const COLORS = ['#00C853','#25D366','#00A040','#80D8A0','#004D20']

export default function AnalyticsCharts({ widget, summary, clicks_by_day, device_breakdown, top_countries }: Props) {
  const stats = [
    { label: 'Total clicks',       val: summary?.total_clicks       ?? 0 },
    { label: 'This month',         val: summary?.this_month_clicks  ?? 0 },
    { label: 'This week',          val: summary?.this_week_clicks   ?? 0 },
    { label: 'Today',              val: summary?.today_clicks       ?? 0 },
  ]

  return (
    <div>
      {/* Summary strip */}
      <div className="analytics-grid">
        {stats.map(s => (
          <div key={s.label} className="card stat-card">
            <div className="stat-val">{s.val}</div>
            <div className="stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Clicks over time */}
      <div className="card chart-card">
        <h3>Clicks — last 30 days</h3>
        {clicks_by_day.length === 0 ? (
          <div style={{textAlign:'center',padding:'2rem',color:'var(--text-dim)',fontSize:14}}>No click data yet. Share the embed code to start tracking.</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={clicks_by_day} margin={{top:4,right:8,left:-20,bottom:0}}>
              <XAxis dataKey="date" tick={{fill:'var(--text-dim)',fontSize:11}} tickLine={false} axisLine={false}
                tickFormatter={d => d.slice(5)} // show MM-DD
              />
              <YAxis tick={{fill:'var(--text-dim)',fontSize:11}} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{background:'var(--bg3)',border:'1px solid var(--border-md)',borderRadius:8,fontSize:13}}
                labelStyle={{color:'var(--text-sec)'}}
                itemStyle={{color:'var(--green)'}}
              />
              <Line type="monotone" dataKey="count" stroke="#00C853" strokeWidth={2} dot={false} name="Clicks" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:'1.5rem'}}>
        {/* Device breakdown */}
        <div className="card chart-card" style={{marginBottom:0}}>
          <h3>Device breakdown</h3>
          {device_breakdown.length === 0 ? (
            <div style={{textAlign:'center',padding:'2rem',color:'var(--text-dim)',fontSize:14}}>No data yet</div>
          ) : (
            <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={device_breakdown} dataKey="count" nameKey="device" cx="50%" cy="50%" outerRadius={60} innerRadius={36}>
                    {device_breakdown.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{background:'var(--bg3)',border:'1px solid var(--border-md)',borderRadius:8,fontSize:12}}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {device_breakdown.map((d,i) => (
                  <div key={d.device} style={{display:'flex',alignItems:'center',gap:8,fontSize:13}}>
                    <span style={{width:10,height:10,borderRadius:2,background:COLORS[i%COLORS.length],flexShrink:0}}/>
                    <span style={{textTransform:'capitalize'}}>{d.device}</span>
                    <span style={{color:'var(--text-sec)',marginLeft:'auto'}}>{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top countries */}
        <div className="card chart-card" style={{marginBottom:0}}>
          <h3>Top countries</h3>
          {top_countries.length === 0 ? (
            <div style={{textAlign:'center',padding:'2rem',color:'var(--text-dim)',fontSize:14}}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={top_countries} layout="vertical" margin={{left:-10,right:8}}>
                <XAxis type="number" tick={{fill:'var(--text-dim)',fontSize:10}} tickLine={false} axisLine={false} allowDecimals={false}/>
                <YAxis type="category" dataKey="country" tick={{fill:'var(--text)',fontSize:12}} tickLine={false} axisLine={false} width={36}/>
                <Tooltip contentStyle={{background:'var(--bg3)',border:'1px solid var(--border-md)',borderRadius:8,fontSize:12}}/>
                <Bar dataKey="count" fill="#00C853" radius={[0,4,4,0]} name="Clicks"/>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Widget details */}
      <div className="card">
        <div style={{fontWeight:600,marginBottom:'1rem'}}>Widget settings</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'0.75rem',fontSize:13}}>
          {[
            ['Slug',     widget.slug],
            ['Phone',    '+'+widget.phone],
            ['Position', widget.position],
            ['Size',     widget.button_size],
            ['Status',   widget.is_active ? 'Active' : 'Inactive'],
            ['Domains',  (widget.allowed_domains||[]).join(', ') || 'All domains'],
          ].map(([k,v]) => (
            <div key={k} style={{display:'flex',gap:8}}>
              <span style={{color:'var(--text-sec)',flexShrink:0}}>{k}:</span>
              <span style={{fontFamily:['Slug','Phone'].includes(k)?'monospace':'inherit',wordBreak:'break-all'}}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
