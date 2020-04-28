import React, { ReactElement } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Upload from './Upload';
import Download from './Download';

function App(): ReactElement {
  return (
    <div>
      <header>
        <h1>Tarnhelm</h1>
      </header>

      <Switch>
        <Route exact path="/upload">
          <section>
            <h2>Upload</h2>
            <Upload />
          </section>
        </Route>

        <Route exact path="/download/:id&:secret">
          <section>
            <h2>Download</h2>
            <Download />
          </section>
        </Route>

        <Redirect to="/upload" />
      </Switch>
    </div>
  );
}

export default App;
