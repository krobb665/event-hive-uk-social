
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uzwlwegxbobvkouukfza.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6d2x3ZWd4Ym9idmtvdXVrZnphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NjQ0NzAsImV4cCI6MjA2NTM0MDQ3MH0.kjTv4QpS2n0A2iE9FBrkMYkUxaoP0FfP6B9pUb4GB9Y'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      saved_events: {
        Row: {
          id: string
          user_id: string
          event_id: string
          event_name: string
          event_date: string
          venue_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          event_name: string
          event_date: string
          venue_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          event_name?: string
          event_date?: string
          venue_name?: string | null
          created_at?: string
        }
      }
      event_discussions: {
        Row: {
          id: string
          event_id: string
          user_id: string
          message: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          message: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          message?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
