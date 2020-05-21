import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import axios from './lib/axios';
import theme from './styles/theme';

import './styles/index.css';
import GlobalStyle from './components/GlobalStyle';

import Layout from './components/Layout';
import Footer from './components/Footer';
import Pages from './pages';

// Set up axios
axios();

const App: React.FC = () => (
  <Router>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Layout footer={<Footer />}>
        <Pages />
      </Layout>
    </ThemeProvider>
  </Router>
);

export default App;
