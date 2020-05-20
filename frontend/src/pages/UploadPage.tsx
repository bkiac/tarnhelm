import React from 'react';
import styled from 'styled-components';

import { Vault, Button } from '../components';

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

const H3 = styled.h3`
  font-size: 1.25rem;
  font-weight: normal;
  margin: 0;
  margin-bottom: 1rem;
`;

const UploadPage: React.FC = () => {
  return (
    <Container>
      <H1>Tarnhelm Title</H1>
      <H3>Tarnhelm Description</H3>
      <Vault />
      <Button>Upload</Button>
    </Container>
  );
};

export default UploadPage;
