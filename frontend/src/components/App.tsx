import React, { ReactElement } from 'react';

import Upload from './Upload';
import Download from './Download';

function App(): ReactElement {
  return (
    <div>
      <header>Tarnhelm</header>
      <Upload />
      <Download />
    </div>
  );
}

export default App;
