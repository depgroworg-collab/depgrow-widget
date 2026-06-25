import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { detectDevice } from '@/lib/utils'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await req.json().catch(() => ({}))
    const ua       = req.headers.get('user-agent') || body.user_agent || ''
    const referrer = body.referrer || req.headers.get('referer') || null
    const device   = detectDevice(ua)

    // Country via Vercel's edge headers (available in production)
    const country = req.headers.get('x-vercel-ip-country') ||
                    req.geo?.country ||
                    body.country ||
                    null

    const sb = createServiceClient()

    // Resolve widget ID from slug
    const { data: widget, error: wErr } = await sb
      .from('widgets')
      .select('id, is_active')
      .eq('slug', params.slug)
      .single()

    if (wErr || !widget) {
      return NextResponse.json({ error: 'Widget not found' }, { status: 404, headers: CORS })
    }

    if (!widget.is_active) {
      return NextResponse.json({ error: 'Widget inactive' }, { status: 403, headers: CORS })
    }

    const { error: insErr } = await sb.from('click_events').insert({
      widget_id:  widget.id,
      referrer:   referrer?.slice(0, 500) || null,
      user_agent: ua.slice(0, 300) || null,
      country,
      device,
    })

    if (insErr) throw insErr

    return NextResponse.json({ ok: true }, { headers: CORS })
  } catch (e) {
    console.error('[track] error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: CORS })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS })
}
