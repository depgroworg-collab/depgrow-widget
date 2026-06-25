// ── Database types ─────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  name: string
  plan: 'free' | 'pro' | 'agency'
  created_at: string
}

export interface Widget {
  id: string
  user_id: string
  name: string
  slug: string // unique embed key e.g. "wgt_abc123"
  phone: string // WhatsApp number with country code e.g. "918309553962"
  pre_filled_message: string
  button_label: string
  tooltip_text: string | null
  position: 'bottom-right' | 'bottom-left'
  button_color: string // hex
  icon_color: string // hex
  button_size: 'sm' | 'md' | 'lg'
  show_tooltip: boolean
  tooltip_delay: number // ms
  allowed_domains: string[] // empty = all domains
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ClickEvent {
  id: string
  widget_id: string
  referrer: string | null
  user_agent: string | null
  country: string | null
  device: 'mobile' | 'tablet' | 'desktop'
  clicked_at: string
}

// ── API response shapes ────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  data: T
  error: null
}

export interface ApiError {
  data: null
  error: string
  code?: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

// ── Widget public config (served to embed script) ─────────────────────────

export interface WidgetPublicConfig {
  slug: string
  phone: string
  pre_filled_message: string
  button_label: string
  tooltip_text: string | null
  position: 'bottom-right' | 'bottom-left'
  button_color: string
  icon_color: string
  button_size: 'sm' | 'md' | 'lg'
  show_tooltip: boolean
  tooltip_delay: number
  is_active: boolean
}

// ── Dashboard analytics ────────────────────────────────────────────────────

export interface WidgetAnalytics {
  widget_id: string
  total_clicks: number
  today_clicks: number
  this_week_clicks: number
  this_month_clicks: number
  top_countries: { country: string; count: number }[]
  device_breakdown: { device: string; count: number }[]
  clicks_by_day: { date: string; count: number }[]
}

// ── Form types ─────────────────────────────────────────────────────────────

export type WidgetFormData = Omit<Widget,
  'id' | 'user_id' | 'slug' | 'created_at' | 'updated_at'
>

export interface CreateWidgetInput extends WidgetFormData {
  name: string
}
