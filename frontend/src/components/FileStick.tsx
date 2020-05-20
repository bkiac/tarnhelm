import React from 'react';
import styled, { css } from 'styled-components';
import bytes from 'bytes';

import { noise } from '../animations';
import Icon from './Icon';
import IconButton from './IconButton';
import DeleteIcon, { content as iconContentCode } from './DeleteIcon';

const noiseOptions = {
  duration: 3,
  steps: 66,
  fraction: 2,
};

const StyledFileStick = styled.div((props) => {
  const height = 50;
  const triangleHeight = height / 2;
  return css`
    font-size: 1rem;
    color: ${props.theme.colors.white};
    display: flex;
    padding: 0.5rem 1rem;
    background-color: ${props.theme.colors.radicalRed};
    height: ${height}px;
    position: relative;
    align-items: center;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      border-left: ${triangleHeight}px solid transparent;
      border-top: ${triangleHeight}px solid ${props.theme.colors.black};
    }
  `;
});

const Glitch = styled(Icon)(
  (props) =>
    css`
    &:before,
    &:after {
      content: '${iconContentCode}';
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;
      background: ${props.theme.colors.radicalRed};
    }

    &:hover {
      cursor: pointer;

      &:before {
        text-shadow: 0.05em 0.025em ${props.theme.colors.cyan};
        animation: ${noise(noiseOptions)};
      } 

      &:after {
        left: 1px;
        text-shadow: 0.025em 0.05em ${props.theme.colors.broom};
        animation: ${noise(noiseOptions)};
      }
    }
  `,
);

const StyledDeleteIcon = styled(DeleteIcon)(
  (props) =>
    css`
      font-size: 36px;
      color: ${props.theme.colors.white};
      margin-right: 8px;
      position: relative;
    `,
);

const FileInfo = styled.p`
  text-align: left;
  margin: 0;
`;

const FileInfoTop = styled(FileInfo)`
  margin-bottom: 0.25rem;
`;

const FileStick: React.FC<{
  name: string;
  size: number;
  onDelete: () => void;
}> = ({ name, size, onDelete }) => {
  return (
    <StyledFileStick>
      <IconButton onClick={onDelete}>
        <StyledDeleteIcon>
          <Glitch as="span" />
        </StyledDeleteIcon>
      </IconButton>

      <div>
        <FileInfoTop>{name}</FileInfoTop>
        <FileInfo>{bytes(size)}</FileInfo>
      </div>
    </StyledFileStick>
  );
};

export default FileStick;
