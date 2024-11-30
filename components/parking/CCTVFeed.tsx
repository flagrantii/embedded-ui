'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Camera, SignalHigh, Loader2 } from 'lucide-react'
import type { CCTVData } from '@/types/sensors'

export default function CCTVFeed() {
  const [selectedCamera, setSelectedCamera] = useState('cam1')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [selectedCamera])

  return (
    <Card className="w-[800px] bg-gradient-to-br from-white to-slate-50 border-0 shadow-md overflow-hidden">
      <CardHeader className="pb-2">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-row items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Camera className="w-6 h-6 text-blue-500" />
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              CCTV Feed
            </CardTitle>
          </div>
        </motion.div>
      </CardHeader>

      <CardContent className="p-4">
        <motion.div 
          className="relative h-[600px] rounded-xl overflow-hidden shadow-lg bg-black"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-slate-900/10 backdrop-blur-sm"
              >
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </motion.div>
            ) : null}
          </AnimatePresence>

          <iframe
            src="http://192.168.51.82/"
            title="CCTV"
            className="w-full h-full border-none"
          />

          <motion.div 
            className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-black/50 backdrop-blur-sm rounded-full"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <SignalHigh className="w-4 h-4 text-green-400" />
            <span className="text-sm text-white font-medium">Live</span>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  )
}