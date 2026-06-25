export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; email: string; name: string; plan: string; created_at: string }
        Insert: { id: string; email: string; name?: string; plan?: string; created_at?: string }
        Update: { id?: string; email?: string; name?: string; plan?: string }
      }
      widgets: {
        Row: {
          id: string; user_id: string; name: string; slug: string
          phone: string; pre_filled_message: string; button_label: string
          tooltip_text: string | null; position: string; button_color: string
          icon_color: string; button_size: string; show_tooltip: boolean
          tooltip_delay: number; allowed_domains: string[]; is_active: boolean
          created_at: string; updated_at: string
        }
        Insert: {
          id?: string; user_id: string; name: string; slug?: string
          phone: string; pre_filled_message?: string; button_label?: string
          tooltip_text?: string | null; position?: string; button_color?: string
          icon_color?: string; button_size?: string; show_tooltip?: boolean
          tooltip_delay?: number; allowed_domains?: string[]; is_active?: boolean
        }
        Update: {
          name?: string; phone?: string; pre_filled_message?: string
          button_label?: string; tooltip_text?: string | null; position?: string
          button_color?: string; icon_color?: string; button_size?: string
          show_tooltip?: boolean; tooltip_delay?: number
          allowed_domains?: string[]; is_active?: boolean
        }
      }
      click_events: {
        Row: {
          id: string; widget_id: string; referrer: string | null
          user_agent: string | null; country: string | null
          device: string; clicked_at: string
        }
        Insert: {
          id?: string; widget_id: string; referrer?: string | null
          user_agent?: string | null; country?: string | null
          device?: string; clicked_at?: string
        }
        Update: never
      }
    }
    Views: {
      widget_analytics: {
        Row: {
          widget_id: string; user_id: string; widget_name: string
          total_clicks: number; today_clicks: number
          this_week_clicks: number; this_month_clicks: number
        }
      }
    }
    Functions: {
      generate_widget_slug: { Args: Record<never, never>; Returns: string }
      user_widget_count: { Args: { p_user_id: string }; Returns: number }
    }
  }
}
