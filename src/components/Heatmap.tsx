import React from 'react'
import { ResponsiveContainer, ScatterChart, XAxis, YAxis, ZAxis, Tooltip, Scatter, Cell } from 'recharts'

interface HeatmapData {
  booth: string
  metric: string
  value: number
  boothId: string
}

interface HeatmapProps {
  data: HeatmapData[]
  onBoothClick?: (boothId: string) => void
}

export default function Heatmap({ data, onBoothClick }: HeatmapProps) {
  const getColor = (value: number) => {
    if (value >= 80) return '#10B981' // Green
    if (value >= 50) return '#F59E0B' // Yellow
    return '#EF4444' // Red
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.booth}</p>
          <p className="text-sm text-gray-600">{data.metric}: {data.value}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Booth Performance Heatmap</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <XAxis 
            type="category" 
            dataKey="booth" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            type="category" 
            dataKey="metric" 
            tick={{ fontSize: 12 }}
            width={100}
          />
          <ZAxis type="number" dataKey="value" range={[100, 400]} />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={data}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getColor(entry.value)}
                onClick={() => onBoothClick?.(entry.boothId)}
                style={{ cursor: onBoothClick ? 'pointer' : 'default' }}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span>Excellent (≥80%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
          <span>Good (50-79%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
          <span>Needs Attention (<50%)</span>
        </div>
      </div>
    </div>
  )
}