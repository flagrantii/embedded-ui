'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Camera, SignalHigh, Loader2, Maximize2, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import VideoPlayer from './VideoPlayer'

export default function CCTVFeed() {
  const [selectedCamera, setSelectedCamera] = useState('cam1')
  const [isLoading, setIsLoading] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [selectedCamera])

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <Card className="w-full bg-gradient-to-br from-white to-slate-50 border-0 shadow-md overflow-hidden">
      <CardHeader className="pb-2">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-row items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Camera className="w-6 h-6 text-green-600" />
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-green-800">
              CCTV Feed
            </CardTitle>
          </div>
        </motion.div>
      </CardHeader>

      <CardContent className="p-4">
        <motion.div 
          className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg bg-black"
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

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex justify-between items-center">
              <motion.div 
                className="flex items-center gap-2 px-3 py-2 bg-black/50 backdrop-blur-sm rounded-full"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <SignalHigh className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white font-medium">Live</span>
              </motion.div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={handleFullscreen}
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}