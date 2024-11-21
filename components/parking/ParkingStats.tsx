'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ParkingStats() {
  // Mock data for weekly stats
  const weeklyData = [
    { day: 'Mon', count: 65 },
    { day: 'Tue', count: 59 },
    { day: 'Wed', count: 80 },
    { day: 'Thu', count: 81 },
    { day: 'Fri', count: 56 },
    { day: 'Sat', count: 55 },
    { day: 'Sun', count: 40 }
  ]

  const maxCount = Math.max(...weeklyData.map(d => d.count))

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Cars Today</span>
              <span className="text-2xl font-bold">45</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Available Slots</span>
              <span className="text-2xl font-bold text-green-600">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Average Stay Time</span>
              <span className="text-2xl font-bold">2.5h</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            {weeklyData.map((item) => (
              <div key={item.day} className="flex items-center gap-2">
                <span className="w-10">{item.day}</span>
                <div className="flex-1 h-8 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500/50 rounded-full transition-all duration-500"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-12 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
} 