'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import { useFirebaseRealtimeData } from '@/hooks/useFirebaseRealtimeData';
import { ParkingSlot } from './ParkingSlot';
import type { ParkingSlot as ParkingSlotType, UltrasonicData } from '@/types/sensors';

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
    <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-md">
      <CardHeader>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center"
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
              <motion.p 
                className="text-sm text-muted-foreground"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Available
              </motion.p>
              <motion.p 
                className="text-3xl font-bold text-green-600"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                {parkingSlots.filter((s) => !s.occupied).length}
              </motion.p>
            </div>

            <div className="h-12 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent" />

            <div className="text-center px-4">
              <motion.p 
                className="text-sm text-muted-foreground"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Total
              </motion.p>
              <motion.p 
                className="text-3xl font-bold text-gray-900"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                {parkingSlots.length}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </CardHeader>

      <CardContent>
        <motion.div 
          className="relative w-full aspect-[16/9] bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl p-8 shadow-inner"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="relative h-full grid grid-cols-3 gap-8">
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
      </CardContent>
    </Card>
  );
}
