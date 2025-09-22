import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper functions for database operations
export const db = {
  // Users
  async getUsers() {
    return supabase.from('users').select('*')
  },
  
  async createUser(user: Database['public']['Tables']['users']['Insert']) {
    return supabase.from('users').insert(user).select().single()
  },

  // Booths
  async getBooths() {
    return supabase.from('booths').select('*')
  },

  async createBooth(booth: Database['public']['Tables']['booths']['Insert']) {
    return supabase.from('booths').insert(booth).select().single()
  },

  // Panna Assignments
  async getPannaAssignments(userId?: string) {
    let query = supabase
      .from('panna_assignments')
      .select(`
        *,
        users(name, phone),
        booths(name, location, constituency)
      `)
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    return query
  },

  async createPannaAssignment(assignment: Database['public']['Tables']['panna_assignments']['Insert']) {
    return supabase.from('panna_assignments').insert(assignment).select().single()
  },

  // Voters
  async getVoters(boothId?: string) {
    let query = supabase
      .from('voters')
      .select(`
        *,
        booths(name, location)
      `)
    
    if (boothId) {
      query = query.eq('booth_id', boothId)
    }
    
    return query
  },

  async createVoter(voter: Database['public']['Tables']['voters']['Insert']) {
    return supabase.from('voters').insert(voter).select().single()
  },

  async updateVoter(id: string, updates: Database['public']['Tables']['voters']['Update']) {
    return supabase.from('voters').update(updates).eq('id', id).select().single()
  },

  // Activities
  async getActivities(userId?: string, voterId?: string) {
    let query = supabase
      .from('activities')
      .select(`
        *,
        users(name),
        voters(name, house_no)
      `)
      .order('created_at', { ascending: false })
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    if (voterId) {
      query = query.eq('voter_id', voterId)
    }
    
    return query
  },

  async createActivity(activity: Database['public']['Tables']['activities']['Insert']) {
    return supabase.from('activities').insert(activity).select().single()
  },

  // Issues
  async getIssues(voterId?: string) {
    let query = supabase
      .from('issues')
      .select(`
        *,
        voters(name, house_no, booths(name))
      `)
    
    if (voterId) {
      query = query.eq('voter_id', voterId)
    }
    
    return query
  },

  async createIssue(issue: Database['public']['Tables']['issues']['Insert']) {
    return supabase.from('issues').insert(issue).select().single()
  },

  // Metrics
  async getMetrics(boothId?: string) {
    let query = supabase.from('metrics').select('*')
    
    if (boothId) {
      query = query.eq('booth_id', boothId)
    }
    
    return query
  }
}