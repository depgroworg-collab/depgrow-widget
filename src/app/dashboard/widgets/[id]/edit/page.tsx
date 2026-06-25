import { createServerActionClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import WidgetForm from '@/components/dashboard/WidgetForm'

export default async function EditWidgetPage({ params }: { params: { id: string } }) {
  const sb = await createServerActionClient()
  const { data: { user } } = await sb.auth.getUser()

  const { data: widget } = await sb
    .from('widgets')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user!.id)
    .single()

  if (!widget) notFound()

  return (
    <>
      <div className="topbar">
        <span className="topbar-title">Edit — {widget.name}</span>
      </div>
      <div className="page-content">
        <WidgetForm mode="edit" initialData={widget} />
      </div>
    </>
  )
}
