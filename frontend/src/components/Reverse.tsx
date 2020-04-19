import React, { useState, useEffect, ReactElement } from 'react';

import { useConnection } from '../hooks';

function Reverse(): ReactElement {
  const [{ ws, loading, error }] = useConnection('/reverse');

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
  return (
    <div>
      <input type="text" onChange={(event) => setInput(event.target.value)} value={input} />
      <p>{output}</p>
    </div>
  );
}

export default Reverse;
