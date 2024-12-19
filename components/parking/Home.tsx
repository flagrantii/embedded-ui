'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight, Car, Clock, ParkingCircle } from 'lucide-react'

export default function Home() {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
      <CardHeader className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <CardTitle className="text-3xl font-bold tracking-tight">
            Smart Parking Monitoring System
          </CardTitle>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced real-time monitoring and management system for modern parking facilities
          </p>
        </motion.div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid gap-8">
          {/* Feature Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * (index + 1), duration: 0.5 }}
                className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                {feature.icon}
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="relative aspect-[16/9] rounded-xl overflow-hidden"
          >
            <Image
              src="/BentleyImage.jpg"
              alt="Smart Parking System"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h3 className="text-xl font-semibold mb-2">Real-time Monitoring</h3>
              <p className="text-sm text-white/90">
                Get instant updates on parking availability and vehicle status
              </p>
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}

const features = [
  {
    icon: <Car className="w-8 h-8 text-blue-500" />,
    title: "Vehicle Tracking",
    description: "Real-time monitoring of vehicle entry and exit times"
  },
  {
    icon: <ParkingCircle className="w-8 h-8 text-green-500" />,
    title: "Slot Management",
    description: "Live updates on available parking slots and occupancy status"
  },
  {
    icon: <Clock className="w-8 h-8 text-purple-500" />,
    title: "Duration Tracking",
    description: "Accurate tracking of parking duration and history"
  }
]