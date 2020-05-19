import React from 'react';
import styled, { StyledProps } from 'styled-components';

interface StyleProps {
  content: string;
}

const StyledAppTitle = styled.span<StyledProps<StyleProps>>`
  font-size: 9vw;
  font-family: 'Roboto Condensed', sans-serif;
  font-style: italic;
  font-weight: 700;
  color: #fff;
  position: relative;
  animation: glitch 5s 5s infinite;

  &:before,
  &:after {
    content: ${(props) => `'${props.content}'`};
    position: absolute;
    background: black;
    overflow: hidden;
    top: 0;
  }

  &:before {
    left: -2px;
    text-shadow: ${(props) => `-0.05em 0 ${props.theme.colors.radicalRed}`};
    animation: noise-1 3s linear infinite alternate-reverse, glitch 5s 5.05s infinite;
  }

  &:after {
    left: 2px;
    text-shadow: ${(props) => `-0.05em 0 ${props.theme.colors.broom}`};
    animation: noise-2 3s linear infinite alternate-reverse, glitch 5s 5s infinite;
  }
`;

const AppTitle: React.FunctionComponent = () => {
  const title = 'Tarnhelm';
  return <StyledAppTitle content={title}>{title}</StyledAppTitle>;
};

export default AppTitle;
