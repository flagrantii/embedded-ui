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