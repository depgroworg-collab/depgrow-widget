import { createBrowserClient } from '@supabase/ssr'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './database.types'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ── Browser client (use in Client Components) ─────────────────────────────
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnon)
}

// ── Server client (use in Server Components / API routes) ─────────────────
export async function createServerActionClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(supabaseUrl, supabaseAnon, {
    cookies: {
      getAll()         { return cookieStore.getAll() },
      setAll(toSet)    { try { toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {} },
    },
  })
}

// ── Service-role client (use in API routes that bypass RLS) ───────────────
export function createServiceClient() {
  const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
  return createSupabaseClient<Database>(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
