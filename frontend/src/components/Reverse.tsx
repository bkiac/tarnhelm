import React, { useState, useEffect, ReactElement } from 'react';

import { useWebSocket } from '../hooks';

function Reverse(): ReactElement {
  const [connection, reconnect, disconnect] = useWebSocket('/reverse');
  console.log(connection);
  const { ws, loading, error } = connection;

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    if (ws && input) {
      // eslint-disable-next-line no-console
      ws.send(input);
      ws.addEventListener('message', (e) => {
        setOutput(e.data);
      });
    }
  }, [ws, input]);

  if (loading) return <div>Connecting WebSocket...</div>;
  if (error) return <div>{error.toString()}</div>;
  if (!ws)
    return (
      <div>
        WebSocket disconnected.
        <button type="button" onClick={() => reconnect()}>
          Reconnect
        </button>
      </div>
    );
  return (
    <div>
      <input type="text" onChange={(event) => setInput(event.target.value)} value={input} />
      <button type="button" onClick={() => reconnect()}>
        Reconnect
      </button>
      <button type="button" onClick={() => disconnect()}>
        Disconnect
      </button>
      <p>{output}</p>
    </div>
  );
}

export default Reverse;
