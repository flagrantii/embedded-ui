'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useParkingHistory } from '@/hooks/useParkingHistory';
import { ParkingRecord } from '@/types/sensors';
import { useEffect, useMemo, useState } from 'react';

export default function ParkingStats() {
  const slotIds = ['A1', 'A2', 'A3'];
  const { records, clearParkingHistory } = useParkingHistory(slotIds);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Calculate parking statistics
  const stats = useMemo(() => {
    // Filter records for today
    const today = new Date().toDateString();
    const todayRecords = records.filter(record => 
      new Date(record.entryTime).toDateString() === today
    );

    // Total cars today (completed parking records)
    const totalCarsToday = todayRecords.filter(record => 
      record.status === 'completed'
    ).length;

    // Available slots (based on active records)
    const occupiedSlots = records.filter(record => 
      record.status === 'active'
    ).map(record => record.slot);
    const availableSlots = slotIds.length - occupiedSlots.length;

    // Average parking time
    const completedRecords = todayRecords.filter(record => 
      record.status === 'completed' && record.duration
    );
    
    const averageParkingTime = completedRecords.length > 0 
      ? calculateAverageParkingTime(completedRecords)
      : '0h 0m';

    return {
      totalCarsToday,
      availableSlots,
      averageParkingTime
    };
  }, [records, slotIds]);


  if (!isHydrated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Parking Statistics...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Loading...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Parking Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Total Cars Today</span>
            <span className="text-2xl font-bold">{stats.totalCarsToday}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Available Slots</span>
            <span className="text-2xl font-bold text-green-600">{stats.availableSlots}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Average Stay Time</span>
            <span className="text-2xl font-bold">{stats.averageParkingTime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Utility function to calculate average parking time
function calculateAverageParkingTime(records: ParkingRecord[]): string {
  // Filter out records without a valid duration
  const validRecords = records.filter(record => 
    record.duration && record.status === 'completed'
  );

  // If no valid records, return default
  if (validRecords.length === 0) {
    return '0h 0m';
  }

  const totalMinutes = validRecords.reduce((sum, record) => {
    const [hours, minutes] = record.duration!.split('h ').map(num => parseInt(num, 10));
    return sum + (hours * 60) + minutes;
  }, 0);

  const averageMinutes = Math.round(totalMinutes / validRecords.length);
  const averageHours = Math.floor(averageMinutes / 60);
  const remainingMinutes = averageMinutes % 60;

  return `${averageHours}h ${remainingMinutes}m`;
}