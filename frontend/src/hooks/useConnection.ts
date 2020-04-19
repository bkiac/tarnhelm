import { useState, useContext, useCallback, useEffect } from 'react';

import { WebSocketContext } from '../contexts';

export default (uri = ''): [Connection, () => void, () => void] => {
  const ctx = useContext(WebSocketContext);

  const connect = useCallback(() => ctx.connect(uri), [ctx, uri]);
  const close = useCallback(() => ctx.close(uri), [ctx, uri]);

  const [connection, setConnection] = useState<Connection>({ loading: true });

  /** Set up connection on mount */
  useEffect(() => {
    setConnection(connect());
  }, [connect]);

  /** Clean up after unmount */
  useEffect(() => {
    return () => {
      close();
    };
  });

  return [connection, connect, close];
};
