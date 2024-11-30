'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useParkingHistory } from '@/hooks/useParkingHistory';

function formatToGMT7(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export default function ParkingHistory() {
  const [search, setSearch] = useState('');
  const [isClient, setIsClient] = useState(false);
  const slotIds = ['A1', 'A2', 'A3'];
  const { records, clearParkingHistory } = useParkingHistory(slotIds);

  // Ensure component only renders on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter records based on search
  const filteredRecords = records.filter(record => 
    record.plateNumber?.toLowerCase().includes(search.toLowerCase()) || 
    record.slot.toLowerCase().includes(search.toLowerCase())
  );

  // Prevent hydration errors
  if (!isClient) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Parking History</CardTitle>
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search plate number or slot..."
              className="max-w-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button 
              variant="destructive" 
              size="sm"
              onClick={clearParkingHistory}
            >
              Clear History
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entry Time</TableHead>
              <TableHead>Exit Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Slot</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((record, index) => (
              <TableRow key={`${record.slot}-${record.entryTime}-${index}`}>
                <TableCell>{formatToGMT7(record.entryTime)}</TableCell>
                <TableCell>
                  {record.exitTime ? formatToGMT7(record.exitTime) : 'In Progress'}
                </TableCell>
                <TableCell>{record.duration || 'N/A'}</TableCell>
                <TableCell>{record.slot}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      record.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {record.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}