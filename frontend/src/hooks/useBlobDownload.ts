import { useState, useEffect } from 'react';
import axios from 'axios';

import useLoadableResult from './useLoadableResult';

export default (id?: string): LoadableResult<Blob> => {
  const [loading, setLoading] = useState(false);
  const [blob, setBlob] = useState<Blob>();

  useEffect(() => {
    // TODO: Handle cancellation and failure
    (async (): Promise<void> => {
      if (id) {
        setLoading(true);

        const response = await axios.get(`/download/${id}`, {
          responseType: 'blob',
        });
        setBlob(new Blob([response.data]));

        setLoading(false);
      }
    })();
  }, [id]);

  return useLoadableResult(loading, blob);
};
