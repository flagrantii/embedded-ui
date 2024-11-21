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
import { useState, ChangeEvent } from 'react'

interface ParkingRecord {
  plateNumber: string
  entryTime: string
  exitTime: string
  duration: string
  slot: string
  status: 'active' | 'completed'
}

export default function ParkingHistory() {
  const [search, setSearch] = useState('')
  
  // Mock data - replace with real data
  const parkingRecords: ParkingRecord[] = [
    {
      plateNumber: 'ABC123',
      entryTime: '2024-03-20 14:30',
      exitTime: '2024-03-20 16:30',
      duration: '2h',
      slot: 'A1',
      status: 'completed'
    },
    // Add more records
  ]

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Parking History</CardTitle>
          <Input
            placeholder="Search plate number..."
            className="max-w-xs"
            value={search}
            onChange={handleSearch}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plate Number</TableHead>
              <TableHead>Entry Time</TableHead>
              <TableHead>Exit Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Slot</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parkingRecords.map((record) => (
              <TableRow key={`${record.plateNumber}-${record.entryTime}`}>
                <TableCell>{record.plateNumber}</TableCell>
                <TableCell>{record.entryTime}</TableCell>
                <TableCell>{record.exitTime}</TableCell>
                <TableCell>{record.duration}</TableCell>
                <TableCell>{record.slot}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    record.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {record.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 