import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase.server'
import { isDomainAllowed } from '@/lib/utils'
import type { WidgetPublicConfig } from '@/types'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const origin = req.headers.get('origin') || req.headers.get('referer') || ''

  try {
    const sb = createServiceClient()
    const { data: widget, error } = await sb
      .from('widgets')
      .select('slug,phone,pre_filled_message,button_label,tooltip_text,position,button_color,icon_color,button_size,show_tooltip,tooltip_delay,allowed_domains,is_active')
      .eq('slug', params.slug)
      .single()

    if (error || !widget) {
      return NextResponse.json({ data: null, error: 'Widget not found' }, { status: 404 })
    }

    if (!widget.is_active) {
      return NextResponse.json({ data: null, error: 'Widget is inactive' }, { status: 403 })
    }

    // Domain allow-list check
    if (origin && !isDomainAllowed(origin, widget.allowed_domains as string[])) {
      return NextResponse.json({ data: null, error: 'Domain not allowed' }, { status: 403 })
    }

    const config: WidgetPublicConfig = {
      slug:                widget.slug,
      phone:               widget.phone,
      pre_filled_message:  widget.pre_filled_message,
      button_label:        widget.button_label,
      tooltip_text:        widget.tooltip_text,
      position:            widget.position as WidgetPublicConfig['position'],
      button_color:        widget.button_color,
      icon_color:          widget.icon_color,
      button_size:         widget.button_size as WidgetPublicConfig['button_size'],
      show_tooltip:        widget.show_tooltip,
      tooltip_delay:       widget.tooltip_delay,
      is_active:           widget.is_active,
    }

    return NextResponse.json(
      { data: config, error: null },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (e) {
    console.error('[config] unexpected error:', e)
    return NextResponse.json({ data: null, error: 'Server error' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  })
}
