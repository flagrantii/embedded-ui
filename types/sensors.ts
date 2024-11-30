export interface ParkingSlot {
  id: string
  occupied: boolean
  distance: number // from ultrasonic sensor
  carInfo?: {
    plateNumber: string
    entryTime: string
    vehicleType?: string // detected by AI
    confidence?: number // AI confidence score
  }
}

export interface ParkingStats {
  totalCarsToday: number;
  availableSlots: number;
  averageParkingTime: number; // In minutes
}

export interface ParkingRecord {
  plateNumber: string | null;
  entryTime: string;
  exitTime: string | null;
  duration: string | null;
  slot: string;
  status: 'active' | 'completed';
}

export interface CCTVData {
  id: string
  status: 'active' | 'inactive'
  lastDetection?: {
    plateNumber: string
    timestamp: string
    vehicleType: string
    confidence: number
  }
}

export interface Distance {
  id: string
  distance: number
}

export type UltrasonicData = { [key: string]: number };
