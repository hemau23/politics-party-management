import { useUser } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { db } from '../lib/supabase'
import { Database } from '../lib/database.types'

type UserProfile = Database['public']['Tables']['users']['Row']

export function useAuth() {
  const { user, isLoaded } = useUser()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      if (!isLoaded || !user) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await db.getUsers()
        if (error) throw error

        const userProfile = data?.find(u => u.email === user.primaryEmailAddress?.emailAddress)
        
        if (!userProfile && user.primaryEmailAddress?.emailAddress) {
          // Create new user profile
          const { data: newUser, error: createError } = await db.createUser({
            name: user.fullName || user.firstName || 'Unknown',
            email: user.primaryEmailAddress.emailAddress,
            phone: user.primaryPhoneNumber?.phoneNumber || null,
            role: 'panna_pramukh' // Default role, admin can change later
          })
          
          if (createError) throw createError
          setProfile(newUser)
        } else {
          setProfile(userProfile || null)
        }
      } catch (error) {
        console.error('Error loading user profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [user, isLoaded])

  return {
    user,
    profile,
    isLoaded,
    loading,
    isAdmin: profile?.role === 'admin',
    isPannaPramukh: profile?.role === 'panna_pramukh'
  }
}