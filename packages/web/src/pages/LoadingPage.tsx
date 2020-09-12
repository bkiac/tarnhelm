import React from 'react';
import styled from 'styled-components';

import { Loader } from '../components';

const CenteredPage = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingPage: React.FC = () => (
  <CenteredPage>
    <Loader />
  </CenteredPage>
);

export default LoadingPage;
