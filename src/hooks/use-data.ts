import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function useData<T>(path: string) {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState('');

  const load = () => {
    setError('');
    api<T[]>(path).then(setData).catch((requestError: Error) => setError(requestError.message));
  }

  useEffect(load, [path]);

  return { data, error, reload: load }
}
