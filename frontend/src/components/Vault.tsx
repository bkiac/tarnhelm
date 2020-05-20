import React from 'react';
import styled, { css } from 'styled-components';

import FileStick from './FileStick';

const StyledVault = styled.div(
  (props) => css`
    border: 1px solid ${props.theme.colors.broom};

    padding: 2rem 4rem;

    height: 500px;
    width: 500px;

    & > * {
      margin-bottom: 1rem;
    }
  `,
);

const files = [
  {
    id: 0,
    name: 'smallfile.txt',
    size: 10240000,
  },
  {
    id: 1,
    name: 'largefile.zip',
    size: 5000000000,
  },
];

const Vault: React.FC = () => {
  return (
    <StyledVault>
      {files.map((f) => (
        <FileStick
          key={f.id}
          name={f.name}
          size={f.size}
          onDelete={() => console.log('Deleting', f)}
        />
      ))}
    </StyledVault>
  );
};

export default Vault;
