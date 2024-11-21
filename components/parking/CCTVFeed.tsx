'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { CCTVData } from '@/types/sensors'
import { format } from 'date-fns'

export default function CCTVFeed() {
  const [selectedCamera, setSelectedCamera] = useState('cam1')
  const [detections, setDetections] = useState<CCTVData[]>([])
  const [mounted, setMounted] = useState(false)

  // Initialize data after component mounts to prevent hydration mismatch
  useEffect(() => {
    setDetections([{
      id: 'cam1',
      status: 'active',
      lastDetection: {
        plateNumber: 'ABC123',
        timestamp: new Date().toISOString(),
        vehicleType: 'Sedan',
        confidence: 0.95
      }
    }])
    setMounted(true)
  }, [])

  // Simulate AI detections
  useEffect(() => {
    if (!mounted) return

    const interval = setInterval(() => {
      setDetections(prev => prev.map(cam => ({
        ...cam,
        lastDetection: cam.id === selectedCamera ? {
          plateNumber: 'ABC' + Math.floor(Math.random() * 999),
          timestamp: new Date().toISOString(),
          vehicleType: Math.random() > 0.5 ? 'Sedan' : 'SUV',
          confidence: 0.8 + Math.random() * 0.2
        } : cam.lastDetection
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [selectedCamera, mounted])

  // Format time consistently
  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm:ss')
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>CCTV Feed</CardTitle>
        <Select value={selectedCamera} onValueChange={setSelectedCamera}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select camera" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cam1">Camera 1 - Main Entrance</SelectItem>
            <SelectItem value="cam2">Camera 2 - Exit Gate</SelectItem>
            <SelectItem value="cam3">Camera 3 - Parking Area</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* CCTV Feed Display */}
        <div className="aspect-video bg-slate-900 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-slate-400">CCTV Feed</p>
          </div>
          
          {/* AI Detection Overlay */}
          {/* <AnimatePresence>
            {mounted && detections.find(d => d.id === selectedCamera)?.lastDetection && (
              <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">AI Detection</span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs"
                  >
                    Live
                  </motion.span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Plate Number</p>
                    <p className="font-mono">
                      {detections.find(d => d.id === selectedCamera)?.lastDetection?.plateNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">Vehicle Type</p>
                    <p>
                      {detections.find(d => d.id === selectedCamera)?.lastDetection?.vehicleType}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">Confidence</p>
                    <p>
                      {(detections.find(d => d.id === selectedCamera)?.lastDetection?.confidence! * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">Time</p>
                    <p>
                      {detections.find(d => d.id === selectedCamera)?.lastDetection?.timestamp && 
                        formatTime(detections.find(d => d.id === selectedCamera)?.lastDetection?.timestamp!)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence> */}
        </div>
      </CardContent>
    </Card>
  )
} 