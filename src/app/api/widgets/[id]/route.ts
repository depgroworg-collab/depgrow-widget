import { NextRequest, NextResponse } from 'next/server'
import { createServerActionClient } from '@/lib/supabase.server'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createServerActionClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id: _id, user_id: _uid, slug: _slug, created_at: _ca, ...rest } = body
  const updateable: Record<string, unknown> = { ...rest }

  if (updateable.phone && typeof updateable.phone === 'string') {
    updateable.phone = updateable.phone.replace(/\D/g, '')
  }

  const { data, error } = await sb
    .from('widgets')
    .update(updateable as any)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data)  return NextResponse.json({ error: 'Widget not found' }, { status: 404 })
  return NextResponse.json({ data })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createServerActionClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await sb
    .from('widgets')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
