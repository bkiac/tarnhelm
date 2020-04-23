import { useCallback, useState, useEffect } from 'react';
import axios from 'axios';

import * as file from '../lib/file';

interface Progress {
  loading: boolean;
}

export default (defaultId?: string): [Progress, (id?: string) => void] => {
  const [id, setId] = useState(defaultId);

  const [loading, setLoading] = useState(false);

  const download = useCallback((newId?: string) => {
    if (newId) setId(newId);
    setLoading(true);
  }, []);

  useEffect(() => {
    setId(defaultId);
    setLoading(false);
  }, [defaultId]);

  /* Handle download */
  useEffect(() => {
    // TODO: Handle cancellation and failure
    (async (): Promise<void> => {
      if (id && loading) {
        const response = await axios.get(`/download/${id}`, {
          responseType: 'blob',
        });

        const blob = new Blob([response.data]);
        // TODO: decrypt
        file.save(blob, { name: id });

        setLoading(false);
      }
    })();
  }, [id, loading]);

  return [{ loading }, download];
};
