'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Car, ParkingCircle, Camera, BarChart, ArrowDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features')
    featuresSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        {/* Hero Content */}
        <div className="flex-1 container mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Smart Parking
              </span>
              <br />
              <span className="text-gray-900">Management System</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your parking facility with advanced real-time monitoring, 
              automated management, and intelligent analytics
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/monitoring" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-lg h-12 px-8"
                >
                  Launch Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button 
                variant="outline"
                size="lg"
                onClick={scrollToFeatures}
                className="w-full sm:w-auto h-12 px-8 text-lg"
              >
                Explore Features
                <ArrowDown className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-0 right-0 flex justify-center"
        >
          <button
            onClick={scrollToFeatures}
            className="group p-2"
            aria-label="Scroll to features"
          >
            <div className="animate-bounce p-2 rounded-full bg-white/90 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <ArrowDown className="w-6 h-6 text-blue-600" />
            </div>
          </button>
        </motion.div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the next generation of parking management with our comprehensive solution
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 * index }}
                  className="mb-6 group-hover:scale-110 transition-transform duration-300"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const features = [
  {
    icon: <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Car className="w-6 h-6 text-blue-600" />
          </div>,
    title: "Vehicle Detection",
    description: "Real-time monitoring of vehicle entry and exit with advanced sensors"
  },
  {
    icon: <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <ParkingCircle className="w-6 h-6 text-green-600" />
          </div>,
    title: "Space Management",
    description: "Efficient allocation and monitoring of parking spaces"
  },
  {
    icon: <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <Camera className="w-6 h-6 text-purple-600" />
          </div>,
    title: "CCTV Monitoring",
    description: "24/7 video surveillance for enhanced security"
  },
  {
    icon: <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
            <BarChart className="w-6 h-6 text-orange-600" />
          </div>,
    title: "Analytics",
    description: "Comprehensive parking data analysis and reporting"
  }
]
