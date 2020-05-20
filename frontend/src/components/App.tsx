import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import theme from '../theme';
import axios from '../lib/axios';
import '../index.css';
import GlobalStyle from './GlobalStyle';
import Layout from './Layout';
import Footer from './Footer';
// import Upload from './Upload';
import Download from './Download';
import { UploadPage } from '../pages';

// Set up axios
axios();

const App: React.FC = () => (
  <Router>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Layout
        main={
          <Switch>
            <Route exact path="/upload">
              <UploadPage />
            </Route>

            <Route exact path="/download/:id&:secretb64">
              <h1>Download</h1>
              <Download />
            </Route>

            <Redirect to="/upload" />
          </Switch>
        }
        footer={<Footer />}
      />
    </ThemeProvider>
  </Router>
);

export default App;
