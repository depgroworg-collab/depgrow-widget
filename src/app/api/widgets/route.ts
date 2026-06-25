import { NextRequest, NextResponse } from 'next/server'
import { createServerActionClient } from '@/lib/supabase.server'
import { validateWidgetForm, PLAN_LIMITS } from '@/lib/utils'

// GET /api/widgets — list user's widgets
export async function GET() {
  const sb = await createServerActionClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await sb
    .from('widgets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// POST /api/widgets — create widget
export async function POST(req: NextRequest) {
  const sb = await createServerActionClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const validErr = validateWidgetForm(body)
  if (validErr) return NextResponse.json({ error: validErr }, { status: 400 })

  // Check plan limits
  const profileRes = await sb.from('profiles').select('plan').eq('id', user.id).single()
  const plan = ((profileRes.data as any)?.plan ?? 'free') as keyof typeof PLAN_LIMITS
  const limit = PLAN_LIMITS[plan]
  const { data: countData } = await (sb as any).rpc('user_widget_count', { p_user_id: user.id })
  if ((countData || 0) >= limit) {
    return NextResponse.json(
      { error: `Your ${plan} plan allows ${limit} widget${limit === 1 ? '' : 's'}. Upgrade to create more.` },
      { status: 403 }
    )
  }

  const { data, error } = await (sb as any).from('widgets').insert({
    user_id:            user.id,
    name:               body.name,
    phone:              body.phone.replace(/\D/g, ''),
    pre_filled_message: body.pre_filled_message,
    button_label:       body.button_label,
    tooltip_text:       body.tooltip_text || null,
    position:           body.position || 'bottom-right',
    button_color:       body.button_color || '#25D366',
    icon_color:         body.icon_color   || '#ffffff',
    button_size:        body.button_size  || 'md',
    show_tooltip:       body.show_tooltip ?? true,
    tooltip_delay:      body.tooltip_delay ?? 3000,
    allowed_domains:    body.allowed_domains || [],
    is_active:          true,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
