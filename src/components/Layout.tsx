import React from 'react'
import { UserButton } from '@clerk/clerk-react'
import { Users, BarChart3, MapPin, ClipboardList } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface LayoutProps {
  children: React.ReactNode
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export default function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const { profile, isAdmin } = useAuth()

  const adminTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'booths', label: 'Booths', icon: MapPin },
    { id: 'panna', label: 'Panna Pramukhs', icon: Users },
    { id: 'reports', label: 'Reports', icon: ClipboardList }
  ]

  const pannaTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'voters', label: 'Voters', icon: Users },
    { id: 'activities', label: 'Activities', icon: ClipboardList },
    { id: 'issues', label: 'Issues', icon: MapPin }
  ]

  const tabs = isAdmin ? adminTabs : pannaTabs

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Panna Pramukh Platform
              </h1>
              {profile && (
                <span className="ml-4 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {profile.role === 'admin' ? 'Admin' : 'Panna Pramukh'}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{profile?.name}</span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      {onTabChange && (
        <nav className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}