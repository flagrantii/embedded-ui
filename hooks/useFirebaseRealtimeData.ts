import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../app/firebaseConfig';

export function useFirebaseRealtimeData<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const dataRef = ref(database, path);
    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
        } else {
          setData(null);
        }
      },
      (err) => setError(err)
    );

    return () => unsubscribe();
  }, [path]);

  return { data, error };
}
