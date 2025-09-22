import React, { useState, useEffect } from 'react'
import { Users, MapPin, ClipboardList, TrendingUp, AlertCircle, UserCheck } from 'lucide-react'
import StatCard from './StatCard'
import Heatmap from './Heatmap'
import { db } from '../lib/supabase'
import { Database } from '../lib/database.types'

type Booth = Database['public']['Tables']['booths']['Row']
type Metric = Database['public']['Tables']['metrics']['Row']
type User = Database['public']['Tables']['users']['Row']

export default function AdminDashboard() {
  const [booths, setBooths] = useState<Booth[]>([])
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [boothsRes, metricsRes, usersRes] = await Promise.all([
        db.getBooths(),
        db.getMetrics(),
        db.getUsers()
      ])

      if (boothsRes.data) setBooths(boothsRes.data)
      if (metricsRes.data) setMetrics(metricsRes.data)
      if (usersRes.data) setUsers(usersRes.data)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const heatmapData = metrics.flatMap(metric => [
    {
      booth: booths.find(b => b.id === metric.booth_id)?.name || 'Unknown',
      metric: 'Coverage',
      value: metric.coverage_percent,
      boothId: metric.booth_id
    },
    {
      booth: booths.find(b => b.id === metric.booth_id)?.name || 'Unknown',
      metric: 'Support',
      value: metric.supporter_percent,
      boothId: metric.booth_id
    }
  ])

  const totalCoverage = metrics.length > 0 
    ? Math.round(metrics.reduce((sum, m) => sum + m.coverage_percent, 0) / metrics.length)
    : 0

  const totalSupport = metrics.length > 0
    ? Math.round(metrics.reduce((sum, m) => sum + m.supporter_percent, 0) / metrics.length)
    : 0

  const totalSwingVoters = metrics.reduce((sum, m) => sum + m.swing_voters_count, 0)
  const totalIssues = metrics.reduce((sum, m) => sum + m.issues_pending, 0)
  const pannaPramukhs = users.filter(u => u.role === 'panna_pramukh').length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Booths"
          value={booths.length}
          icon={MapPin}
          color="blue"
        />
        <StatCard
          title="Panna Pramukhs"
          value={pannaPramukhs}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Average Coverage"
          value={`${totalCoverage}%`}
          icon={TrendingUp}
          color={totalCoverage >= 80 ? 'green' : totalCoverage >= 50 ? 'yellow' : 'red'}
        />
        <StatCard
          title="Average Support"
          value={`${totalSupport}%`}
          icon={UserCheck}
          color={totalSupport >= 80 ? 'green' : totalSupport >= 50 ? 'yellow' : 'red'}
        />
        <StatCard
          title="Swing Voters"
          value={totalSwingVoters}
          icon={Users}
          color="yellow"
        />
        <StatCard
          title="Pending Issues"
          value={totalIssues}
          icon={AlertCircle}
          color={totalIssues > 10 ? 'red' : totalIssues > 5 ? 'yellow' : 'green'}
        />
      </div>

      {/* Heatmap */}
      {heatmapData.length > 0 && (
        <Heatmap 
          data={heatmapData}
          onBoothClick={(boothId) => {
            console.log('Clicked booth:', boothId)
            // TODO: Navigate to booth details
          }}
        />
      )}

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium">Add New Booth</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
            <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium">Add Panna Pramukh</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
            <ClipboardList className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium">Generate Report</p>
          </button>
        </div>
      </div>
    </div>
  )
}