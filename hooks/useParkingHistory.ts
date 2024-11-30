import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { ParkingRecord } from '@/types/sensors';
import { database } from '@/src/app/firebaseConfig';


export function useParkingHistory(slotIds: string[]) {
  // Initialize records from localStorage, preserving active records
  const [records, setRecords] = useState<ParkingRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const storedRecords = localStorage.getItem('parkingHistory');
      if (storedRecords) {
        const parsedRecords = JSON.parse(storedRecords);
        // Restore active records by updating their duration
        return parsedRecords.map((record: ParkingRecord) => {
          if (record.status === 'active') {
            return {
              ...record,
              duration: calculateDuration(
                record.entryTime, 
                new Date().toISOString()
              )
            };
          }
          return record;
        });
      }
    }
    return [];
  });

  const [previousDistances, setPreviousDistances] = useState<number[]>([]);

  // Save records to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('parkingHistory', JSON.stringify(records));
    }
  }, [records]);

  useEffect(() => {

    if (typeof window === 'undefined') return;

    const dbRef = ref(database, 'ultrasonic');

    const unsubscribe = onValue(dbRef, (snapshot) => {
      const rawData = snapshot.val();
      if (rawData) {
        const distances = Object.values(rawData) as number[];

        const updatedRecords = [...records];

        distances.forEach((distance, index) => {
          const slot = slotIds[index];
          const wasOccupied = (previousDistances[index] ?? 5) < 5;
          const isOccupied = distance < 5;

          // Find existing active record for this slot
          const existingActiveRecordIndex = updatedRecords.findIndex(
            (record) => record.slot === slot && record.status === 'active'
          );

          // Prevent duplicate record creation
          if (!wasOccupied && isOccupied && existingActiveRecordIndex === -1) {
            // Car just parked - add new record only if no active record exists
            updatedRecords.push({
              plateNumber: null,
              entryTime: new Date().toISOString(),
              exitTime: null,
              duration: null,
              slot,
              status: 'active',
            });
          } else if (wasOccupied && !isOccupied && existingActiveRecordIndex !== -1) {
            // Car just left - update existing record
            const activeRecord = updatedRecords[existingActiveRecordIndex];
            activeRecord.exitTime = new Date().toISOString();
            activeRecord.duration = calculateDuration(
              activeRecord.entryTime,
              activeRecord.exitTime
            );
            activeRecord.status = 'completed';
          }
        });

        // Update records only if there are changes
        setRecords(updatedRecords);
        setPreviousDistances(distances);
      }
    });

    return () => unsubscribe();
  }, [slotIds, previousDistances, records]);

  // Real-time duration update for active records
  useEffect(() => {

    if (typeof window === 'undefined') return;

    const interval = setInterval(() => {
      const updatedRecords = records.map((record) => {
        if (record.status === 'active') {
          return {
            ...record,
            duration: calculateDuration(
              record.entryTime,
              new Date().toISOString()
            ),
          };
        }
        return record;
      });
      setRecords(updatedRecords);
    }, 1000);

    return () => clearInterval(interval);
  }, [records]);

  // Method to clear parking history
  const clearParkingHistory = () => {
  const activeRecords = records.filter(record => record.status === 'active');
  setRecords(activeRecords);
  if (typeof window !== 'undefined') {
    localStorage.setItem('parkingHistory', JSON.stringify(activeRecords));
  }
  };

  return { 
    records, 
    clearParkingHistory 
  };
}

// Utility function to calculate duration
function calculateDuration(entryTime: string, exitTime: string): string {
  const entry = new Date(entryTime).getTime();
  const exit = new Date(exitTime).getTime();
  const diffMs = exit - entry;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  return `${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}m`;
}