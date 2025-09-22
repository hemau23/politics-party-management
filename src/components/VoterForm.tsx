import React from 'react'
import { useForm } from 'react-hook-form'
import { Database } from '../lib/database.types'

type VoterFormData = Omit<Database['public']['Tables']['voters']['Insert'], 'id' | 'created_at'>

interface VoterFormProps {
  onSubmit: (data: VoterFormData) => void
  onCancel: () => void
  initialData?: Partial<VoterFormData>
  booths: Database['public']['Tables']['booths']['Row'][]
}

export default function VoterForm({ onSubmit, onCancel, initialData, booths }: VoterFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<VoterFormData>({
    defaultValues: initialData
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? 'Edit Voter' : 'Add New Voter'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Booth *
            </label>
            <select
              {...register('booth_id', { required: 'Booth is required' })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Booth</option>
              {booths.map(booth => (
                <option key={booth.id} value={booth.id}>
                  {booth.name} - {booth.location}
                </option>
              ))}
            </select>
            {errors.booth_id && (
              <p className="text-red-500 text-sm mt-1">{errors.booth_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age *
              </label>
              <input
                type="number"
                {...register('age', { 
                  required: 'Age is required',
                  min: { value: 18, message: 'Must be at least 18' },
                  max: { value: 120, message: 'Invalid age' }
                })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender *
              </label>
              <select
                {...register('gender', { required: 'Gender is required' })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                House No. *
              </label>
              <input
                type="text"
                {...register('house_no', { required: 'House number is required' })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.house_no && (
                <p className="text-red-500 text-sm mt-1">{errors.house_no.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Family Members *
              </label>
              <input
                type="number"
                {...register('family_members', { 
                  required: 'Family members count is required',
                  min: { value: 1, message: 'Must be at least 1' }
                })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.family_members && (
                <p className="text-red-500 text-sm mt-1">{errors.family_members.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              {...register('phone')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('whatsapp')}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Has WhatsApp</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Voting History *
            </label>
            <select
              {...register('voting_history', { required: 'Voting history is required' })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select</option>
              <option value="regular">Regular Voter</option>
              <option value="irregular">Irregular Voter</option>
              <option value="first_time">First-time Voter</option>
            </select>
            {errors.voting_history && (
              <p className="text-red-500 text-sm mt-1">{errors.voting_history.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Political Inclination *
            </label>
            <select
              {...register('inclination', { required: 'Political inclination is required' })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select</option>
              <option value="supporter">Supporter</option>
              <option value="swing">Swing Voter</option>
              <option value="opposition">Opposition</option>
            </select>
            {errors.inclination && (
              <p className="text-red-500 text-sm mt-1">{errors.inclination.message}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              {initialData ? 'Update' : 'Add'} Voter
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}