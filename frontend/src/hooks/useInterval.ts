import { useMemo, useEffect, useRef } from 'react';
import isNil from 'lodash.isnil';

export default function useInterval(callback: Function, delay?: number): void {
  const savedCallback = useRef<Function>(callback);
  const isRunning = useMemo(() => !isNil(delay), [delay]);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    let id: number;
    if (isRunning) {
      id = setInterval(() => savedCallback.current(), delay);
    }
    return () => clearInterval(id);
  }, [isRunning, delay]);
}