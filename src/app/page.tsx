'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Car, ParkingCircle, Camera, BarChart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
            Smart Parking System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced real-time monitoring and management system for modern parking facilities
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Link href="/monitoring">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                Go to Monitoring
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * (index + 1), duration: 0.5 }}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Image Section */}
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl"
        >
          <Image
            src="/BentleyImage.jpg"
            alt="Smart Parking System"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Experience Next-Gen Parking</h2>
            <p className="text-lg text-white/90 max-w-2xl">
              Our smart parking system combines real-time monitoring, automated management, 
              and advanced analytics to provide the best parking experience.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const features = [
  {
    icon: <Car className="w-6 h-6 text-blue-600" />,
    title: "Vehicle Detection",
    description: "Real-time monitoring of vehicle entry and exit with advanced sensors"
  },
  {
    icon: <ParkingCircle className="w-6 h-6 text-blue-600" />,
    title: "Space Management",
    description: "Efficient allocation and monitoring of parking spaces"
  },
  {
    icon: <Camera className="w-6 h-6 text-blue-600" />,
    title: "CCTV Monitoring",
    description: "24/7 video surveillance for enhanced security"
  },
  {
    icon: <BarChart className="w-6 h-6 text-blue-600" />,
    title: "Analytics",
    description: "Comprehensive parking data analysis and reporting"
  }
]
