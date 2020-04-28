import { useMemo } from 'react';

export default <T>(loading: boolean, data?: T): LoadableResult<T> => {
  return useMemo(() => ({ loading, data }), [loading, data]);
};
