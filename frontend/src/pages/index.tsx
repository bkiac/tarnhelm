import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import UploadPage from './UploadPage';
import DownloadPage from './DownloadPage';
import NotFoundPage from './NotFoundPage';
import ThanksPage from './ThanksPage';
import LoadingPage from './LoadingPage';

const Pages: React.FC = () => (
  <Switch>
    <Route exact path="/upload">
      <UploadPage />
    </Route>

    <Route exact path="/download/:id&:secretb64">
      <DownloadPage />
    </Route>

    <Route exact path="/thanks">
      <ThanksPage />
    </Route>

    <Route exact path="/404">
      <NotFoundPage />
    </Route>

    <Route exact path="/">
      <Redirect to="/upload" />
    </Route>

    <Redirect to="/404" />
  </Switch>
);

export { UploadPage, DownloadPage, NotFoundPage, ThanksPage, LoadingPage };

export default Pages;
