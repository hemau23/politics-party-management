export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          role: 'admin' | 'panna_pramukh'
          name: string
          phone: string | null
          email: string | null
          created_at: string
        }
        Insert: {
          id?: string
          role: 'admin' | 'panna_pramukh'
          name: string
          phone?: string | null
          email?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          role?: 'admin' | 'panna_pramukh'
          name?: string
          phone?: string | null
          email?: string | null
          created_at?: string
        }
      }
      booths: {
        Row: {
          id: string
          name: string
          location: string
          constituency: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          constituency: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          constituency?: string
          created_at?: string
        }
      }
      panna_assignments: {
        Row: {
          id: string
          user_id: string
          booth_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          booth_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          booth_id?: string
          created_at?: string
        }
      }
      voters: {
        Row: {
          id: string
          booth_id: string
          name: string
          age: number
          gender: 'male' | 'female' | 'other'
          house_no: string
          family_members: number
          phone: string | null
          whatsapp: boolean
          voting_history: 'regular' | 'irregular' | 'first_time'
          inclination: 'supporter' | 'swing' | 'opposition'
          created_at: string
        }
        Insert: {
          id?: string
          booth_id: string
          name: string
          age: number
          gender: 'male' | 'female' | 'other'
          house_no: string
          family_members: number
          phone?: string | null
          whatsapp?: boolean
          voting_history: 'regular' | 'irregular' | 'first_time'
          inclination: 'supporter' | 'swing' | 'opposition'
          created_at?: string
        }
        Update: {
          id?: string
          booth_id?: string
          name?: string
          age?: number
          gender?: 'male' | 'female' | 'other'
          house_no?: string
          family_members?: number
          phone?: string | null
          whatsapp?: boolean
          voting_history?: 'regular' | 'irregular' | 'first_time'
          inclination?: 'supporter' | 'swing' | 'opposition'
          created_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          user_id: string
          voter_id: string
          activity_type: 'visit' | 'call' | 'whatsapp' | 'rally' | 'issue' | 'update'
          description: string
          geo_tag: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          voter_id: string
          activity_type: 'visit' | 'call' | 'whatsapp' | 'rally' | 'issue' | 'update'
          description: string
          geo_tag?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          voter_id?: string
          activity_type?: 'visit' | 'call' | 'whatsapp' | 'rally' | 'issue' | 'update'
          description?: string
          geo_tag?: string | null
          created_at?: string
        }
      }
      issues: {
        Row: {
          id: string
          voter_id: string
          category: 'road' | 'water' | 'electricity' | 'other'
          description: string
          status: 'open' | 'escalated' | 'resolved'
          created_at: string
        }
        Insert: {
          id?: string
          voter_id: string
          category: 'road' | 'water' | 'electricity' | 'other'
          description: string
          status?: 'open' | 'escalated' | 'resolved'
          created_at?: string
        }
        Update: {
          id?: string
          voter_id?: string
          category?: 'road' | 'water' | 'electricity' | 'other'
          description?: string
          status?: 'open' | 'escalated' | 'resolved'
          created_at?: string
        }
      }
      metrics: {
        Row: {
          id: string
          booth_id: string
          coverage_percent: number
          supporter_percent: number
          swing_voters_count: number
          opposition_count: number
          youth_first_time_voters: number
          issues_pending: number
          updated_at: string
        }
        Insert: {
          id?: string
          booth_id: string
          coverage_percent: number
          supporter_percent: number
          swing_voters_count: number
          opposition_count: number
          youth_first_time_voters: number
          issues_pending: number
          updated_at?: string
        }
        Update: {
          id?: string
          booth_id?: string
          coverage_percent?: number
          supporter_percent?: number
          swing_voters_count?: number
          opposition_count?: number
          youth_first_time_voters?: number
          issues_pending?: number
          updated_at?: string
        }
      }
    }
  }
}