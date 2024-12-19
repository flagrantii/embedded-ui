'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useParkingHistory } from '@/hooks/useParkingHistory'
import { ParkingRecord } from '@/types/sensors'
import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, Clock, ParkingCircle } from 'lucide-react'

export default function ParkingStats() {
  const slotIds = ['A1', 'A2', 'A3']
  const { records, clearParkingHistory } = useParkingHistory(slotIds)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const stats = useMemo(() => {
    const today = new Date().toDateString()
    const todayRecords = records.filter(record => 
      new Date(record.entryTime).toDateString() === today
    )

    const totalCarsToday = todayRecords.filter(record => 
      record.status === 'completed'
    ).length

    const occupiedSlots = records.filter(record => 
      record.status === 'active'
    ).map(record => record.slot)
    const availableSlots = slotIds.length - occupiedSlots.length

    const completedRecords = todayRecords.filter(record => 
      record.status === 'completed' && record.duration
    )
    
    const averageParkingTime = completedRecords.length > 0 
      ? calculateAverageParkingTime(completedRecords)
      : '0h 0m'

    return {
      totalCarsToday,
      availableSlots,
      averageParkingTime
    }
  }, [records, slotIds])

  if (!isHydrated) {
    return (
      <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Loading Statistics...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-16 bg-slate-100 animate-pulse rounded-lg" />
            <div className="h-16 bg-slate-100 animate-pulse rounded-lg" />
            <div className="h-16 bg-slate-100 animate-pulse rounded-lg" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-md overflow-hidden">
      <CardHeader>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Today's Parking Statistics
          </CardTitle>
        </motion.div>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StatItem
            icon={<Car className="w-6 h-6 text-blue-500" />}
            label="Total Cars Today"
            value={stats.totalCarsToday}
            delay={0.3}
          />
          <StatItem
            icon={<ParkingCircle className="w-6 h-6 text-green-500" />}
            label="Available Slots"
            value={stats.availableSlots}
            valueColor="text-green-600"
            delay={0.4}
          />
          <StatItem
            icon={<Clock className="w-6 h-6 text-purple-500" />}
            label="Average Stay Time"
            value={stats.averageParkingTime}
            delay={0.5}
          />
        </motion.div>
      </CardContent>
    </Card>
  )
}

interface StatItemProps {
  icon: React.ReactNode
  label: string
  value: number | string
  valueColor?: string
  delay: number
}

function StatItem({ icon, label, value, valueColor = "text-gray-900", delay }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-50 rounded-lg">
          {icon}
        </div>
        <span className="text-gray-600 font-medium">{label}</span>
      </div>
      <motion.span 
        className={`text-2xl font-bold ${valueColor}`}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: delay + 0.2 }}
      >
        {value}
      </motion.span>
    </motion.div>
  )
}

// Utility function to calculate average parking time
function calculateAverageParkingTime(records: ParkingRecord[]): string {
  // Filter out records without a valid duration
  const validRecords = records.filter(record => 
    record.duration && record.status === 'completed'
  );

  // If no valid records, return default
  if (validRecords.length === 0) {
    return '0h 0m';
  }

  const totalMinutes = validRecords.reduce((sum, record) => {
    const [hours, minutes] = record.duration!.split('h ').map(num => parseInt(num, 10));
    return sum + (hours * 60) + minutes;
  }, 0);

  const averageMinutes = Math.round(totalMinutes / validRecords.length);
  const averageHours = Math.floor(averageMinutes / 60);
  const remainingMinutes = averageMinutes % 60;

  return `${averageHours}h ${remainingMinutes}m`;
}