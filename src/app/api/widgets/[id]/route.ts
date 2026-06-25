import { NextRequest, NextResponse } from 'next/server'
import { createServerActionClient } from '@/lib/supabase'

// PATCH /api/widgets/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const sb = await createServerActionClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  // Strip non-updatable fields
  const { id: _, user_id: __, slug: ___, created_at: ____, ...updateable } = body

  if (updateable.phone) updateable.phone = updateable.phone.replace(/\D/g, '')

  const { data, error } = await sb
    .from('widgets')
    .update(updateable)
    .eq('id', params.id)
    .eq('user_id', user.id) // RLS safety
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Widget not found' }, { status: 404 })

  return NextResponse.json({ data })
}

// DELETE /api/widgets/[id]
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
