import React from 'react';
import styled from 'styled-components';

import { Upload } from '../components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const H1 = styled.h1`
  font-size: 2rem;
  margin: 0;
  margin-bottom: 0.5rem;
`;

const H2 = styled.h2`
  font-size: 1.25rem;
  font-weight: normal;
  margin: 0;
  margin-bottom: 1rem;
`;

const UploadPage: React.FC = () => {
  return (
    <Container>
      <H1>Tarnhelm Title</H1>
      <H2>Tarnhelm Description</H2>
      <Upload />
    </Container>
  );
};

export default UploadPage;
