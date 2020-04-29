import { useMemo } from 'react';

export default function useLoadableResult<T>(loading: boolean, data?: T): LoadableResult<T> {
  return useMemo(() => ({ loading, data }), [loading, data]);
}
