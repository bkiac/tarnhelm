import React, { ReactElement } from 'react';

import Reverse from './Reverse';
import Upload from './Upload';

function App(): ReactElement {
  return (
    <div>
      <header>Tarnhelm</header>
      <Reverse />
      <Upload />
    </div>
  );
}

export default App;
