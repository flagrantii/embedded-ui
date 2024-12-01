'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import { useFirebaseRealtimeData } from '@/hooks/useFirebaseRealtimeData';
import { ParkingSlot } from './ParkingSlot';
import type { ParkingSlot as ParkingSlotType, UltrasonicData } from '@/types/sensors';
import { Car, Clock } from 'lucide-react';

export default function ParkingOverview() {
  const { data, error } = useFirebaseRealtimeData<UltrasonicData>('ultrasonic');
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  const parkingSlots = [
    { id: 'A1', occupied: false, distance: 0 },
    { id: 'A2', occupied: false, distance: 0 },
    { id: 'A3', occupied: false, distance: 0 },
  ].map((slot, index) => {
    const distance = data ? Object.values(data)[index] || 0 : 0;
    const occupied = distance < 5;
    return { ...slot, distance, occupied };
  });

  const handleHover = useCallback((slotId: string | null) => setHoveredSlot(slotId), []);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-red-50 rounded-lg border border-red-200 text-red-700"
      >
        Error loading data: {error.message}
      </motion.div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-md h-full">
      <CardHeader>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
        >
          <div>
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              Parking Overview
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Real-time parking status</p>
          </div>

          <motion.div 
            className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center px-4">
              <motion.div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-green-600" />
                <p className="text-sm text-muted-foreground">Available</p>
              </motion.div>
              <p className="text-3xl font-bold text-green-600">
                {parkingSlots.filter((s) => !s.occupied).length}
              </p>
            </div>

            <div className="h-12 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent" />

            <div className="text-center px-4">
              <motion.div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <p className="text-sm text-muted-foreground">Total</p>
              </motion.div>
              <p className="text-3xl font-bold text-gray-900">
                {parkingSlots.length}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </CardHeader>

      <CardContent className="space-y-6">
        <motion.div 
          className="relative w-full bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl p-4 md:p-8 shadow-inner"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            <AnimatePresence mode="wait">
              {parkingSlots.map((slot) => (
                <ParkingSlot
                  key={slot.id}
                  slot={slot}
                  hoveredSlot={hoveredSlot}
                  setHoveredSlot={handleHover}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Occupancy Rate</span>
                <span className="font-semibold">
                  {Math.round((parkingSlots.filter(s => s.occupied).length / parkingSlots.length) * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Distance</span>
                <span className="font-semibold">
                  {(parkingSlots.reduce((acc, slot) => acc + slot.distance, 0) / parkingSlots.length).toFixed(1)}m
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">Status Overview</h3>
            <div className="space-y-3">
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(parkingSlots.filter(s => !s.occupied).length / parkingSlots.length) * 100}%` 
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Available ({parkingSlots.filter(s => !s.occupied).length})</span>
                <span>Occupied ({parkingSlots.filter(s => s.occupied).length})</span>
              </div>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
