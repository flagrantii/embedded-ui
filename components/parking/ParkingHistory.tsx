'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Trash2, Clock, ParkingSquare } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useParkingHistory } from '@/hooks/useParkingHistory'

function formatToGMT7(isoString: string) {
  const date = new Date(isoString)
  return date.toLocaleString('en-US', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export default function ParkingHistory() {
  const [search, setSearch] = useState('')
  const [isClient, setIsClient] = useState(false)
  const slotIds = ['A1', 'A2', 'A3']
  const { records, clearParkingHistory } = useParkingHistory(slotIds)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const filteredRecords = records.filter(record => 
    record.plateNumber?.toLowerCase().includes(search.toLowerCase()) || 
    record.slot.toLowerCase().includes(search.toLowerCase())
  )

  if (!isClient) {
    return null
  }

  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-md overflow-hidden">
      <CardHeader>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div className="flex items-center gap-3">
            <ParkingSquare className="w-6 h-6 text-blue-500" />
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              Parking History
            </CardTitle>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="destructive" 
              size="sm"
              onClick={clearParkingHistory}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </Button>
          </div>
        </motion.div>
      </CardHeader>

      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="font-semibold">Entry Time</TableHead>
                <TableHead className="font-semibold">Exit Time</TableHead>
                <TableHead className="font-semibold">Duration</TableHead>
                <TableHead className="font-semibold">Slot</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="wait">
                {filteredRecords.map((record, index) => (
                  <motion.tr
                    key={`${record.slot}-${record.entryTime}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-slate-50"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {formatToGMT7(record.entryTime)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {record.exitTime ? formatToGMT7(record.exitTime) : 'In Progress'}
                    </TableCell>
                    <TableCell>{record.duration || 'N/A'}</TableCell>
                    <TableCell>
                      <span className="font-semibold">{record.slot}</span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {record.status}
                      </span>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </motion.div>
      </CardContent>
    </Card>
  )
}