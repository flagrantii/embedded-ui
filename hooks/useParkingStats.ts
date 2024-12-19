import { useEffect, useState, useCallback } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { ParkingStats } from '@/types/sensors';
import { database } from '@/src/app/firebaseConfig';

export function useParkingStats(path: string) {
  const [data, setData] = useState<number[]>([]);
  const [previousData, setPreviousData] = useState<number[]>([]); 
  const [stats, setStats] = useState<ParkingStats>({
    totalCarsToday: 0,
    availableSlots: 3, // Assuming there are 3 parking slots
    averageParkingTime: 0,
  });

  // Helper function to calculate average parking time
  const calculateAverageTime = useCallback((durations: number[]) => {
    if (durations.length === 0) return 0;
    const total = durations.reduce((sum, time) => sum + time, 0);
    return Math.round(total / durations.length);
  }, []);

  useEffect(() => {
    // Initialize Firebase database reference
    const dbRef = ref(database, path);

    // Read data from Firebase
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const rawData = snapshot.val();
      if (rawData) {
        const distances = Object.values(rawData) as number[]; // Assuming distance data
        setData(distances);

        const newParkedCars = distances.reduce((count, distance, index) => {
            const wasEmpty = (previousData[index] ?? 5) >= 5; // Slot was available
            const isOccupied = distance < 5; // Slot is now occupied
            return wasEmpty && isOccupied ? count + 1 : count; // Increment only if newly parked
          }, 0);

        // Update total cars today and average parking time
        const totalCarsToday = stats.totalCarsToday + newParkedCars;

                // Update available slots
        const availableSlots = distances.filter((distance) => distance >= 5).length;

        // Save stats
        const updatedStats = {
            ...stats,
            totalCarsToday,
            availableSlots,
          };
        setStats(updatedStats);

        // Persist to local storage
        localStorage.setItem('parkingStats', JSON.stringify(updatedStats));

        setPreviousData(distances);
      }
    });

    return () => unsubscribe();
  }, [path, previousData, stats]);

  // Function to log parking duration
  const logParkingDuration = useCallback((duration: number) => {
    const storedStats = JSON.parse(localStorage.getItem('parkingStats') || '{}');
    const parkingDurations = [...(storedStats.parkingDurations || []), duration];

    const updatedStats = {
      ...stats,
      averageParkingTime: calculateAverageTime(parkingDurations),
    };

    setStats(updatedStats);

    // Persist updated durations to local storage
    localStorage.setItem('parkingStats', JSON.stringify({
      ...storedStats,
      parkingDurations,
    }));
  }, [stats, calculateAverageTime]);

  return { data, stats, logParkingDuration };
}