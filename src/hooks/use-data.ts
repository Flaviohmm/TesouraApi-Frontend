import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';

export function useData<T>(path: string) {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    api<T[]>(path)
      .then(setData)
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, error, loading, reload: load };
}
