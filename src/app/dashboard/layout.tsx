import { redirect } from 'next/navigation'
import { createServerActionClient } from '@/lib/supabase.server'
import Sidebar from '@/components/dashboard/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const sb = await createServerActionClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await sb
    .from('profiles')
    .select('name, plan')
    .eq('id', user.id)
    .single()

  return (
    <div className="shell">
      <Sidebar user={{ email: user.email!, name: profile?.name || '', plan: profile?.plan || 'free' }} />
      <div className="main">{children}</div>
    </div>
  )
}
