import { motion } from 'framer-motion';
import { Car, Ban } from 'lucide-react';

interface ParkingSlotProps {
  slot: {
    id: string;
    occupied: boolean;
    distance: number;
  };
  hoveredSlot: string | null;
  setHoveredSlot: (id: string | null) => void;
}

export function ParkingSlot({ slot, hoveredSlot, setHoveredSlot }: ParkingSlotProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setHoveredSlot(slot.id)}
      onHoverEnd={() => setHoveredSlot(null)}
      className={`
        relative p-6 rounded-xl border-2 transition-colors
        ${slot.occupied 
          ? 'border-red-400 bg-red-50' 
          : 'border-green-400 bg-green-50'
        }
        ${hoveredSlot === slot.id ? 'shadow-lg' : 'shadow-md'}
      `}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <span className="text-xl font-bold">{slot.id}</span>
        
        {slot.occupied ? (
          <Ban className="w-12 h-12 text-red-500" />
        ) : (
          <Car className="w-12 h-12 text-green-500" />
        )}
        
        <div className="text-sm text-center">
          <p className={slot.occupied ? 'text-red-600' : 'text-green-600'}>
            {slot.occupied ? 'Occupied' : 'Available'}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Distance: {slot.distance}m
          </p>
        </div>
      </div>
    </motion.div>
  );
}
