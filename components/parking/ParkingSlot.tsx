import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface ParkingSlotProps {
  slot: {
    id: string;
    occupied: boolean;
    distance: number;
  };
  hoveredSlot: string | null;
  setHoveredSlot: (slotId: string | null) => void;
}

export const ParkingSlot: React.FC<ParkingSlotProps> = React.memo(
  ({ slot, hoveredSlot, setHoveredSlot }) => {
    return (
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseEnter={() => setHoveredSlot(slot.id)}
        onMouseLeave={() => setHoveredSlot(null)}
      >
        <div
          className={`absolute inset-0 border-2 rounded-xl transition-all duration-300 ${
            slot.occupied ? 'border-red-400 bg-red-50/50' : 'border-green-400 bg-green-50/50'
          } ${hoveredSlot === slot.id ? 'shadow-lg scale-105' : ''}`}
        >
          {/* Slot Number */}
          <div className="absolute top-2 left-2 px-2 py-1 bg-white/80 rounded-lg backdrop-blur-sm">
            <span className="font-bold text-sm">{slot.id}</span>
          </div>

          {/* Car Image */}
          {slot.occupied && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center p-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <Image
                src="/car-top-view.png"
                alt="Car"
                width={100}
                height={100}
                className="w-full h-auto object-contain opacity-90"
              />
            </motion.div>
          )}

          {/* Sensor Status */}
          <motion.div
            className="absolute bottom-2 right-2 flex items-center gap-1 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {slot.distance < 5 ? (
              <span className="px-2 py-1 bg-white/80 rounded-lg backdrop-blur-sm text-red-600 flex items-center gap-1 shadow-sm">
                <AlertCircle className="w-4 h-4" />
                {slot.distance.toFixed(0)}cm
              </span>
            ) : (
              <span className="px-2 py-1 bg-white/80 rounded-lg backdrop-blur-sm text-green-600 shadow-sm">
                Clear
              </span>
            )}
          </motion.div>
        </div>
      </motion.div>
    );
  }
);

ParkingSlot.displayName = 'ParkingSlot';
