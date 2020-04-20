import React, { useState, ReactElement } from 'react';

import Reverse from './Reverse';
import Upload from './Upload';

function App(): ReactElement {
  const [show, setShow] = useState(true);
  return (
    <div>
      <header>Tarnhelm</header>

      <button type="button" onClick={() => setShow(!show)}>
        Toggle Reverse
      </button>
      {show && <Reverse />}

      <Upload />
    </div>
  );
}

export default App;
