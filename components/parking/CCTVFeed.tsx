'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { CCTVData } from '@/types/sensors'
import { format } from 'date-fns'
import VideoPlayer from './VideoPlayer'

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
        </Select>
      </CardHeader>
      <VideoPlayer 
      src="http://192.168.51.82/" 
      autoPlay={true}
      muted={false}
      />
      </Card>
  )
} 