import React from 'react';
import styled from 'styled-components';

import { Upload } from '../components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const H1 = styled.h1`
  text-align: center;
  font-size: 1.25rem;
  font-weight: normal;
  margin: 0;
  margin-bottom: 1.5rem;
`;

const UploadPage: React.FC = () => {
  return (
    <Container>
      <H1>Share end-to-end encrypted files which expire automatically</H1>
      <Upload />
    </Container>
  );
};

export default UploadPage;
