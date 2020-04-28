import React, { ReactElement } from 'react';

import Upload from './Upload';
import Download from './Download';

function App(): ReactElement {
  return (
    <div>
      <header>
        <h1>Tarnhelm</h1>
      </header>

      <section>
        <h2>Upload</h2>
        <Upload />
      </section>

      <section>
        <h2>Download</h2>
        <Download />
      </section>
    </div>
  );
}

export default App;
