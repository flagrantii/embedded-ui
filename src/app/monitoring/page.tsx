'use client'

import { Suspense } from 'react'
import ParkingOverview from '@/components/parking/ParkingOverview'
import CCTVFeed from '@/components/parking/CCTVFeed'
import ParkingStats from '@/components/parking/ParkingStats'
import ParkingHistory from '@/components/parking/ParkingHistory'
import ParkingChart from '@/components/parking/ParkingChart'
import { Skeleton } from '@/components/ui/skeleton'
import Home from '@/components/parking/Home'

export default function MonitoringPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Main Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Home />
        <ParkingOverview />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column - Stats & Chart */}
        <div className="xl:col-span-4 space-y-6">
          <ParkingStats />
          <ParkingChart />
        </div>
        
        {/* Right Column - CCTV */}
        <div className="xl:col-span-8">
          <CCTVFeed />
        </div>
      </div>

      {/* History Section */}
      <ParkingHistory />
    </div>
  )
}