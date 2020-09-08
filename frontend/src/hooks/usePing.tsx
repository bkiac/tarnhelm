import { useState, useEffect } from 'react';
import axios from 'axios';

export default function usePing(): boolean {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await axios.get('/ping');
      setLoading(false);
    })();
  }, []);

  return loading;
}
