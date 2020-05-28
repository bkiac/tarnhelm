import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

// Set up axios
import './lib/axios';
import theme from './styles/theme';

import './styles/index.css';
import GlobalStyle from './components/GlobalStyle';

import { usePing } from './hooks';
import { Layout, Footer } from './components';
import Pages, { LoadingPage } from './pages';

const App: React.FC = () => {
  const loading = usePing();
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Layout footer={!loading && <Footer />}>{loading ? <LoadingPage /> : <Pages />}</Layout>
      </ThemeProvider>
    </Router>
  );
};

export default App;
