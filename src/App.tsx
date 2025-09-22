import React from 'react'
import { ClerkProvider, SignedIn, SignedOut, SignInButton, RedirectToSignIn } from '@clerk/clerk-react'
import Layout from './components/Layout'
import AdminDashboard from './components/AdminDashboard'
import PannaDashboard from './components/PannaDashboard'
import { useAuth } from './hooks/useAuth'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

function AppContent() {
  const { profile, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Panna Pramukh Platform</h1>
          <p className="text-gray-600 mb-8">Please sign in to continue</p>
          <SignInButton mode="modal">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
              Sign In
            </button>
          </SignInButton>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      {isAdmin ? <AdminDashboard /> : <PannaDashboard />}
    </Layout>
  )
}

export default function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <SignedIn>
        <AppContent />
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Panna Pramukh Management Platform</h1>
            <p className="text-gray-600 mb-8">Empowering grassroots political engagement</p>
            <SignInButton mode="modal">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 text-lg">
                Sign In to Continue
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
    </ClerkProvider>
  )
}