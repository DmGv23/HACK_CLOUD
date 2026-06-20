import { useEffect, useRef, useState } from 'react';
import { getStatus } from '../services/api';
import type { StatusResponse } from '../types';

export function useJobStatus(jobId: string | null) {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tickRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!jobId) return;
    tickRef.current = 0;

    const poll = async () => {
      try {
        tickRef.current += 1;
        const res = await getStatus(jobId);
        setStatus(res);
        if (res.status === 'COMPLETED' || res.status === 'FAILED') {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error desconocido');
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    };

    poll();
    intervalRef.current = setInterval(poll, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [jobId]);

  return { status, error };
}
