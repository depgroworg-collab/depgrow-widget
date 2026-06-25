import type { WidgetPublicConfig } from '@/types'

// ── Device detection from UA string ──────────────────────────────────────
export function detectDevice(ua: string): 'mobile' | 'tablet' | 'desktop' {
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet'
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile'
  return 'desktop'
}

// ── Domain allow-list check ───────────────────────────────────────────────
export function isDomainAllowed(origin: string, allowed: string[]): boolean {
  if (!allowed || allowed.length === 0) return true // open to all
  try {
    const host = new URL(origin).hostname.replace(/^www\./, '')
    return allowed.some(d => {
      const clean = d.replace(/^www\./, '').replace(/^https?:\/\//, '')
      return host === clean || host.endsWith('.' + clean)
    })
  } catch {
    return false
  }
}

// ── Build WhatsApp URL ────────────────────────────────────────────────────
export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, '')
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`
}

// ── Button size map ───────────────────────────────────────────────────────
export const BUTTON_SIZE_MAP = {
  sm: { button: 48, icon: 24 },
  md: { button: 56, icon: 28 },
  lg: { button: 64, icon: 32 },
} as const

// ── Format number ─────────────────────────────────────────────────────────
export function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}

// ── Plan widget limits ─────────────────────────────────────────────────────
export const PLAN_LIMITS = {
  free:   1,
  pro:    10,
  agency: Infinity,
}

// ── Validate widget form ───────────────────────────────────────────────────
export function validateWidgetForm(data: Partial<WidgetPublicConfig>): string | null {
  if (!data.phone || data.phone.trim().length < 7) return 'A valid WhatsApp number is required.'
  if (!data.pre_filled_message || data.pre_filled_message.trim() === '') return 'Pre-filled message cannot be empty.'
  if (!data.button_label || data.button_label.trim() === '') return 'Button label cannot be empty.'
  return null
}

// ── cn helper (class names) ───────────────────────────────────────────────
export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}
