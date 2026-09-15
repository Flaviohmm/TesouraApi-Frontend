import { useEffect, useState } from 'react'
import { api } from '../services/api'

export function useData<T>(path: string) {
  const [data, setData] = useState<T[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    api<T[]>(path).then(setData).catch((requestError: Error) => setError(requestError.message))
  }, [path])

  return { data, error }
}
