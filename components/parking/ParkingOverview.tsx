'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { ParkingSlot, UltrasonicData } from '@/types/sensors'
import { AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { database } from '../../app/firebaseConfig'
import { getDatabase, ref, get, onValue} from 'firebase/database'
import { parse } from 'path'


export default function ParkingOverview() {
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([
    { 
      id: 'A1', 
      occupied: false, 
      distance: 0
    },
    { id: 'A2', occupied: false, distance: 0 },
    { id: 'A3', occupied: false, distance: 0 },
  ])

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
          const data = snapshot.val() as UltrasonicData; // Explicitly cast the data
          const sensorValues = Object.values(data).map((value) =>
            typeof value === 'string' ? parseInt(value, 10) : value
          );

          console.log('sensor1',sensorValues[0])
          console.log('sensor2',sensorValues[1])
          console.log('sensor3',sensorValues[2])
          
          setTimeout(() => {
            setParkingSlots((prevSlots) =>
              prevSlots.map((slot, index) => ({
                ...slot,
                distance: sensorValues[index] || 0, // Update distance from sensor
                occupied: (sensorValues[index] || 0) < 5, // Mark occupied if distance < 5cm
              }))
            );
          }, 300);

          
        }else{
          console.log('No data')
        }
      },
      (error) => {
        console.error('Error Fetching Data', error)
      }
    )
  })

  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null)

  // Simulate real-time updates
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setParkingSlots(slots => 
  //       slots.map(slot => ({
  //         ...slot,
  //         distance: slot.occupied ? 
  //           Math.max(5, Math.random() * 10) : 
  //           Math.max(150, Math.random() * 200)
  //       }))
  //     )
  //   }, 2000)

  //   return () => clearInterval(interval)
  // }, [])

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">Parking Overview</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Real-time parking status</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg shadow-sm">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-2xl font-bold text-green-600">
                {parkingSlots.filter(s => !s.occupied).length}
              </p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{parkingSlots.length}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Parking Layout */}
        <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 shadow-inner">
          {/* Parking Slots */}
          <div className="relative h-full grid grid-cols-3 gap-6">
            <AnimatePresence>
              {parkingSlots.map((slot) => (
                <motion.div
                  key={slot.id}
                  className="relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onMouseEnter={() => setHoveredSlot(slot.id)}
                  onMouseLeave={() => setHoveredSlot(null)}
                >
                  {/* Parking Space */}
                  <div className={`
                    absolute inset-0 border-2 rounded-xl transition-all duration-300
                    ${slot.occupied ? 'border-red-400 bg-red-50/50' : 'border-green-400 bg-green-50/50'}
                    ${hoveredSlot === slot.id ? 'shadow-lg scale-105' : ''}
                  `}>
                    {/* Slot Number */}
                    <div className="absolute top-2 left-2 px-2 py-1 bg-white/80 rounded-lg backdrop-blur-sm">
                      <span className="font-bold text-sm">{slot.id}</span>
                    </div>
                    
                    {/* Car Image */}
                    {slot.occupied && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center p-4"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      >
                        <Image
                          src="/car-top-view.png"
                          alt="Car"
                          width={100}
                          height={100}
                          className="w-full h-auto object-contain opacity-90"
                        />
                      </motion.div>
                    )}

                    {/* Sensor Status */}
                    <motion.div
                      className="absolute bottom-2 right-2 flex items-center gap-1 text-xs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {slot.distance < 5 ? (
                        <span className="px-2 py-1 bg-white/80 rounded-lg backdrop-blur-sm text-red-600 flex items-center gap-1 shadow-sm">
                          <AlertCircle className="w-4 h-4" />
                          {slot.distance.toFixed(0)}cm
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-white/80 rounded-lg backdrop-blur-sm text-green-600 shadow-sm">
                          Clear
                        </span>
                      )}
                    </motion.div>

                    {/* Hover Info */}
                    <AnimatePresence>
                      {hoveredSlot === slot.id && slot.occupied && slot.carInfo && (
                        <motion.div
                          className="absolute -top-24 left-1/2 -translate-x-1/2 bg-white p-3 rounded-lg shadow-lg text-xs w-48 z-10"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">{slot.carInfo.plateNumber}</span>
                              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                                {slot.carInfo.vehicleType}
                              </span>
                            </div>
                            <div className="text-slate-500 text-xs">
                              Parked since: {slot.carInfo.entryTime}
                            </div>
                            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${slot.carInfo.confidence! * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white transform rotate-45" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 