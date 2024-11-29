'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatePresence } from 'framer-motion';
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
    return <p className="text-red-500">Error loading data: {error.message}</p>;
  }

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
                {parkingSlots.filter((s) => !s.occupied).length}
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
        <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 shadow-inner">
          <div className="relative h-full grid grid-cols-3 gap-6">
            <AnimatePresence>
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
        </div>
      </CardContent>
    </Card>
  );
}
