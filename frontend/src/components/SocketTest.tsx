import React, { useState, useEffect, ReactElement } from 'react';

import { useSocket } from '../hooks';

function SocketTest(): ReactElement {
  const [socket, connected] = useSocket();

  const [input, setInput] = useState('');

  useEffect(() => {
    if (socket && connected) {
      // eslint-disable-next-line no-console
      console.log('Sending', input);
      socket.send(input);
    }
  }, [connected, socket, input]);

  return (
    <div>
      <input type="text" onChange={(event) => setInput(event.target.value)} value={input} />
    </div>
  );
}

export default SocketTest;
