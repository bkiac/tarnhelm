import React from 'react';
import styled, { css } from 'styled-components';

import SaveIcon from './SaveIcon';
import FileStick from './FileStick';

const StyledVault = styled.div<{ isEmpty: boolean; hasError?: boolean }>(
  (props) => css`
    border: 1px solid ${props.hasError ? props.theme.colors.sangria : props.theme.colors.broom};
    padding: 2rem 4rem;

    height: 30vw;

    ${props.isEmpty &&
    css`
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    `}
  `,
);

const StyledFileStick = styled(FileStick)`
  margin-bottom: 1rem;
`;

const StyledSaveIcon = styled(SaveIcon)(
  (props) => css`
    font-size: 10rem;
    color: ${props.theme.colors.cyan};
  `,
);

interface FileObject {
  id: string;
  name: string;
  size: number;
  onDelete: () => void;
}

const Vault: React.FC<{
  files: FileObject[];
  isDragActive: boolean;
  hasError?: boolean;
}> = ({ files, isDragActive, hasError }) => {
  const isEmpty = files.length === 0;
  return (
    <StyledVault isEmpty={isEmpty} hasError={hasError}>
      {hasError ? (
        <div>error</div>
      ) : (
        <>
          {isEmpty ? (
            <>
              {isDragActive ? (
                <>
                  <StyledSaveIcon />
                  <p>Drop files to start</p>
                </>
              ) : (
                <>
                  <StyledSaveIcon />
                  <p>Click or drop files to start</p>
                </>
              )}
            </>
          ) : (
            files.map(({ id, ...f }) => <StyledFileStick key={id} {...f} />)
          )}
        </>
      )}
    </StyledVault>
  );
};

export default Vault;
