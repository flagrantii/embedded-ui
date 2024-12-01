'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useParkingHistory } from '@/hooks/useParkingHistory'
import { useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { BarChart2 } from 'lucide-react'

export default function ParkingChart() {
  const slotIds = ['A1', 'A2', 'A3']
  const { records } = useParkingHistory(slotIds)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const chartData = useMemo(() => {
    const today = new Date()
    const hours = Array.from({ length: 24 }, (_, i) => i)
    
    return hours.map(hour => {
      const startHour = new Date(today)
      startHour.setHours(hour, 0, 0, 0)
      const endHour = new Date(today)
      endHour.setHours(hour + 1, 0, 0, 0)

      const hourRecords = records.filter(record => {
        const entryTime = new Date(record.entryTime)
        return entryTime >= startHour && entryTime < endHour
      })

      return {
        hour: `${hour.toString().padStart(2, '0')}:00`,
        entries: hourRecords.length,
        available: slotIds.length - hourRecords.filter(r => r.status === 'active').length
      }
    })
  }, [records, slotIds])

  if (!isHydrated) {
    return (
      <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-md mt-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Loading Chart...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] bg-slate-100 animate-pulse rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-md mt-6">
      <CardHeader>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <BarChart2 className="w-6 h-6 text-blue-500" />
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Hourly Parking Activity
          </CardTitle>
        </motion.div>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-[200px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="hour" 
                fontSize={12}
                tickMargin={8}
                interval="preserveStartEnd"
              />
              <YAxis 
                fontSize={12}
                tickMargin={8}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Bar 
                dataKey="entries" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]}
                name="New Entries"
              />
              <Bar 
                dataKey="available" 
                fill="#22C55E"
                radius={[4, 4, 0, 0]} 
                name="Available Slots"
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  )
}