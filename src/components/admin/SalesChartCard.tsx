// components/SalesChartCard.tsx
'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

interface SalesData {
  _id: string
  totalSales: number
  orderCount: number
  averageOrderValue: number
}

interface SalesChartCardProps {
  data: SalesData[]
}

export function SalesChartCard({ data }: SalesChartCardProps) {
  // Calculate percentage change
  const calculateTrend = () => {
    if (data.length < 2) return { percentage: 0, isUp: false }
    
    const firstDay = data[0].totalSales
    const lastDay = data[data.length - 1].totalSales
    const percentage = ((lastDay - firstDay) / firstDay) * 100
    
    return {
      percentage: Math.abs(percentage),
      isUp: percentage >= 0
    }
  }

  const trend = calculateTrend()

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Sales Analytics</h3>
            <p className="text-sm text-muted-foreground">Last 30 days</p>
          </div>
          <div className="flex items-center gap-1">
            {trend.isUp ? (
              <FiTrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <FiTrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${trend.isUp ? 'text-green-500' : 'text-red-500'}`}>
              {trend.percentage.toFixed(1)}% {trend.isUp ? 'increase' : 'decrease'}
            </span>
          </div>
        </div>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="_id" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value:string) => value.split('-')[2]} // Show only day
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `৳${value / 1000}k`}
              />
              <Tooltip 
                formatter={(value: number) => [`৳${value.toFixed(2)}`, 'Total Sales']}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="totalSales" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}