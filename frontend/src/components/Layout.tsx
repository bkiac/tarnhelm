import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 1rem;
  height: calc(100% - 2rem);

  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  width: 50%;
  align-self: center;
`;

const Footer = styled.footer`
  margin-top: auto;
`;

interface Props {
  main: React.ReactNode;
  footer: React.ReactNode;
}

const Layout: React.FC<Props> = ({ main, footer }) => {
  return (
    <Container>
      <Main>{main}</Main>
      <Footer>{footer}</Footer>
    </Container>
  );
};

export default Layout;
