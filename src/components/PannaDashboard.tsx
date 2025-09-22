import React, { useState, useEffect } from 'react'
import { Users, MapPin, ClipboardList, Phone, MessageCircle, Calendar } from 'lucide-react'
import StatCard from './StatCard'
import VoterForm from './VoterForm'
import { db } from '../lib/supabase'
import { Database } from '../lib/database.types'
import { useAuth } from '../hooks/useAuth'

type Voter = Database['public']['Tables']['voters']['Row'] & {
  booths?: Database['public']['Tables']['booths']['Row']
}
type Activity = Database['public']['Tables']['activities']['Row']
type Booth = Database['public']['Tables']['booths']['Row']

export default function PannaDashboard() {
  const { profile } = useAuth()
  const [voters, setVoters] = useState<Voter[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [booths, setBooths] = useState<Booth[]>([])
  const [assignedBooths, setAssignedBooths] = useState<Booth[]>([])
  const [loading, setLoading] = useState(true)
  const [showVoterForm, setShowVoterForm] = useState(false)
  const [selectedVoter, setSelectedVoter] = useState<Voter | null>(null)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    if (profile) {
      loadPannaData()
    }
  }, [profile])

  const loadPannaData = async () => {
    if (!profile) return

    try {
      // Get assigned booths
      const { data: assignments } = await db.getPannaAssignments(profile.id)
      const boothIds = assignments?.map(a => a.booth_id) || []
      
      // Get booth details
      const { data: allBooths } = await db.getBooths()
      const userBooths = allBooths?.filter(b => boothIds.includes(b.id)) || []
      setAssignedBooths(userBooths)
      setBooths(allBooths || [])

      // Get voters for assigned booths
      const voterPromises = boothIds.map(boothId => db.getVoters(boothId))
      const voterResults = await Promise.all(voterPromises)
      const allVoters = voterResults.flatMap(result => result.data || [])
      setVoters(allVoters)

      // Get activities
      const { data: userActivities } = await db.getActivities(profile.id)
      setActivities(userActivities || [])

    } catch (error) {
      console.error('Error loading panna data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddVoter = async (voterData: any) => {
    try {
      await db.createVoter(voterData)
      setShowVoterForm(false)
      loadPannaData()
    } catch (error) {
      console.error('Error adding voter:', error)
    }
  }

  const handleEditVoter = async (voterData: any) => {
    if (!selectedVoter) return
    
    try {
      await db.updateVoter(selectedVoter.id, voterData)
      setShowVoterForm(false)
      setSelectedVoter(null)
      loadPannaData()
    } catch (error) {
      console.error('Error updating voter:', error)
    }
  }

  const logActivity = async (voterId: string, activityType: string, description: string) => {
    if (!profile) return

    try {
      await db.createActivity({
        user_id: profile.id,
        voter_id: voterId,
        activity_type: activityType as any,
        description
      })
      loadPannaData()
    } catch (error) {
      console.error('Error logging activity:', error)
    }
  }

  const supporters = voters.filter(v => v.inclination === 'supporter')
  const swingVoters = voters.filter(v => v.inclination === 'swing')
  const opposition = voters.filter(v => v.inclination === 'opposition')
  const todayActivities = activities.filter(a => 
    new Date(a.created_at).toDateString() === new Date().toDateString()
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: MapPin },
            { id: 'voters', label: 'Voters', icon: Users },
            { id: 'activities', label: 'Activities', icon: ClipboardList }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Voters"
              value={voters.length}
              icon={Users}
              color="blue"
            />
            <StatCard
              title="Supporters"
              value={supporters.length}
              icon={Users}
              color="green"
            />
            <StatCard
              title="Swing Voters"
              value={swingVoters.length}
              icon={Users}
              color="yellow"
            />
            <StatCard
              title="Today's Activities"
              value={todayActivities.length}
              icon={ClipboardList}
              color="blue"
            />
          </div>

          {/* Assigned Booths */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Assigned Booths</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignedBooths.map(booth => (
                <div key={booth.id} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{booth.name}</h4>
                  <p className="text-sm text-gray-600">{booth.location}</p>
                  <p className="text-sm text-gray-600">{booth.constituency}</p>
                  <div className="mt-2 text-sm">
                    <span className="text-blue-600">
                      {voters.filter(v => v.booth_id === booth.id).length} voters
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'voters' && (
        <div className="space-y-6">
          {/* Add Voter Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Voters Management</h2>
            <button
              onClick={() => setShowVoterForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Voter
            </button>
          </div>

          {/* Voters List */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inclination
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {voters.map(voter => (
                    <tr key={voter.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{voter.name}</div>
                          <div className="text-sm text-gray-500">Age: {voter.age}, {voter.gender}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">House: {voter.house_no}</div>
                        <div className="text-sm text-gray-500">Family: {voter.family_members}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          voter.inclination === 'supporter' ? 'bg-green-100 text-green-800' :
                          voter.inclination === 'swing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {voter.inclination}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => {
                            setSelectedVoter(voter)
                            setShowVoterForm(true)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        {voter.phone && (
                          <button
                            onClick={() => logActivity(voter.id, 'call', `Called ${voter.name}`)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                        )}
                        {voter.whatsapp && (
                          <button
                            onClick={() => logActivity(voter.id, 'whatsapp', `WhatsApp message to ${voter.name}`)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activities' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Recent Activities</h2>
          
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              {activities.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No activities recorded yet</p>
              ) : (
                <div className="space-y-4">
                  {activities.slice(0, 10).map(activity => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.created_at).toLocaleString()}
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                          activity.activity_type === 'visit' ? 'bg-blue-100 text-blue-800' :
                          activity.activity_type === 'call' ? 'bg-green-100 text-green-800' :
                          activity.activity_type === 'whatsapp' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {activity.activity_type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Voter Form Modal */}
      {showVoterForm && (
        <VoterForm
          onSubmit={selectedVoter ? handleEditVoter : handleAddVoter}
          onCancel={() => {
            setShowVoterForm(false)
            setSelectedVoter(null)
          }}
          initialData={selectedVoter || undefined}
          booths={assignedBooths}
        />
      )}
    </div>
  )
}