import { Suspense } from 'react'
import ParkingOverview from '@/components/parking/ParkingOverview'
import CCTVFeed from '@/components/parking/CCTVFeed'
import ParkingStats from '@/components/parking/ParkingStats'
import ParkingHistory from '@/components/parking/ParkingHistory'
import { Skeleton } from '@/components/ui/skeleton'

export default function MonitoringPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Parking Monitoring System</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CCTV Feed Section */}
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <CCTVFeed />
        </Suspense>

        {/* Parking Overview Section */}
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <ParkingOverview />
        </Suspense>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
          <ParkingStats />
        </Suspense>
      </div>

      {/* Parking History Section */}
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <ParkingHistory />
      </Suspense>
    </div>
  )
} 