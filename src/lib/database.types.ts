export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: any
        Insert: any
        Update: any
      }
      widgets: {
        Row: any
        Insert: any
        Update: any
      }
      click_events: {
        Row: any
        Insert: any
        Update: any
      }
    }
    Views: {
      widget_analytics: {
        Row: any
      }
    }
    Functions: {
      generate_widget_slug: { Args: any; Returns: any }
      user_widget_count: { Args: any; Returns: any }
    }
  }
}