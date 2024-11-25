'use client'
import { Suspense, useEffect, useState } from 'react'
import ParkingOverview from '@/components/parking/ParkingOverview'
import CCTVFeed from '@/components/parking/CCTVFeed'
import ParkingStats from '@/components/parking/ParkingStats'
import ParkingHistory from '@/components/parking/ParkingHistory'
import { Skeleton } from '@/components/ui/skeleton'
import { database } from '../firebaseConfig'
import { getDatabase, ref, get, onValue} from 'firebase/database'
import { collection,getDocs, QuerySnapshot } from 'firebase/firestore'
import { da } from 'date-fns/locale'

export default function MonitoringPage() {
  // async function fetch(){
  //   const querySnapshot = await getDocs(collection(database,"ultrasonic/sensor1"))
  //   const data = [];
  //     querySnapshot.forEach((doc) => {
  //     console.log(doc)
  //     data.push({id:doc.id , ...doc.data()})
  //   })
  // }
  useEffect(() => {
    const dataRef = ref(database, 'ultrasonic')
    // get(dataRef).then((snapshot) => {
    //   if(snapshot.exists()){
    //     console.log(snapshot.val())
    //   }
    // })
    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        if(snapshot.exists()){
          const data = snapshot.val();
          const sensorValues = Object.values(data)
          console.log('sensor1',sensorValues[0])
          console.log('sensor2',sensorValues[1])
          console.log('sensor3',sensorValues[2])

        }else{
          console.log('No data')
        }
      },
      (error) => {
        console.error('Error Fetching Data', error)
      }
    )
  })
  //const data = database
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