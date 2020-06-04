import React from 'react';
import styled, { css } from 'styled-components';

import SaveIcon from './SaveIcon';
import DeathIcon from './DeathIcon';
import FileStick from './FileStick';

const StyledVault = styled.div<{
  isEmpty: boolean;
  hasError?: boolean;
}>(
  (props) => css`
    border: 1px solid ${props.hasError ? props.theme.palette.error : props.theme.palette.primary};
    padding: 2rem 0;
    height: 30vw;
    color: ${props.hasError ? props.theme.palette.error : props.theme.palette.secondary};
    font-size: 10rem;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    ${props.isEmpty &&
    css`
      cursor: pointer;
      justify-content: center;
    `}
  `,
);

const StyledFileStick = styled(FileStick)`
  margin-bottom: 1rem;
`;

const Text = styled.p<{
  hasError?: boolean;
}>(
  (props) => css`
    font-size: 1rem;
    color: ${props.hasError ? props.theme.palette.error : props.theme.palette.foreground};
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
  loading?: boolean;
  hasError?: boolean;
}> = ({ files, isDragActive, loading = false, hasError }) => {
  const isEmpty = files.length === 0;

  function renderPartial(Icon: any, message: React.ReactNode): React.ReactElement {
    return (
      <>
        <Icon />
        <Text hasError={hasError}>{message}</Text>
      </>
    );
  }

  return (
    <StyledVault isEmpty={isEmpty} hasError={hasError}>
      {hasError ? (
        renderPartial(DeathIcon, 'Unexpected Error')
      ) : (
        <>
          {isEmpty ? (
            <>
              {isDragActive
                ? renderPartial(SaveIcon, 'Drop files to start')
                : renderPartial(SaveIcon, 'Click or drop files to start')}
            </>
          ) : (
            files.map(({ id, ...f }) => <StyledFileStick key={id} obfuscate={loading} {...f} />)
          )}
        </>
      )}
    </StyledVault>
  );
};

export default Vault;
