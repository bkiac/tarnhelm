import React, { ReactElement } from 'react';

import Upload from './Upload';
import Download from './Download';
import EncryptTest from './EncryptTest';

function App(): ReactElement {
  return (
    <div>
      <header>Tarnhelm</header>
      <Upload />
      <Download />
      <EncryptTest />
    </div>
  );
}

export default App;
