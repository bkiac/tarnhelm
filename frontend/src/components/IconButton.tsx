import React from 'react';
import styled from 'styled-components';

const StyledIconButton = styled.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
`;

const IconButton: React.FC<{ onClick?: () => void; disabled?: true }> = ({
  children,
  ...props
}) => <StyledIconButton {...props}>{children}</StyledIconButton>;
export default IconButton;
