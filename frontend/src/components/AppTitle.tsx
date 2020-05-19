import React from 'react';
import styled, { css, keyframes, StyledProps, FlattenSimpleInterpolation } from 'styled-components';

interface StyleProps {
  content: string;
}

const glitch = keyframes`
  1% {
    transform: rotateX(10deg) skewX(60deg);
  }
  2% {
    transform: rotateX(0deg) skewX(0deg);
  }
`;

const noiseFrames = (start: number, steps = 30): Array<FlattenSimpleInterpolation | string> => {
  return Array.from(Array(steps)).map((_, i) => {
    if (i >= start) {
      const top = Math.random();
      const bottom = 1.01 - top;
      const percentage = i * (1 / steps);
      return css`
        ${percentage * 100}% {
          clip-path: inset(${top / 2}em 0 ${bottom / 2}em 0);
        }
      `;
    }
    return '';
  });
};
const noise1 = keyframes`${noiseFrames(0)}`;
const noise2 = keyframes`${noiseFrames(1)}`;

const glitchAnimation = (): FlattenSimpleInterpolation =>
  css`
    ${glitch} 5s 5s infinite
  `;
const glitchTwitchAnimation = (): FlattenSimpleInterpolation =>
  css`
    ${glitch} 5s 5.05s infinite
  `;

const noise1Animation = (): FlattenSimpleInterpolation =>
  css`
    ${noise1} 8s linear infinite alternate-reverse
  `;
const noise2Animation = (): FlattenSimpleInterpolation =>
  css`
    ${noise2} 8s linear infinite alternate-reverse
  `;

const StyledAppTitle = styled.p<StyledProps<StyleProps>>`
  margin: 0;
  font-size: 2.5rem;
  font-family: 'Roboto Condensed', sans-serif;
  font-style: italic;
  font-weight: 700;
  text-transform: uppercase;
  color: ${(props) => props.theme.colors.white};
  position: relative;
  animation: ${glitchAnimation};

  &:before,
  &:after {
    content: ${(props) => `'${props.content}'`};
    position: absolute;
    top: 0;
    overflow: hidden;
    background: black;
  }

  &:before {
    left: -2px;
    text-shadow: ${(props) => `-0.05em 0 ${props.theme.colors.radicalRed}`};
    animation: ${noise1Animation}, ${glitchTwitchAnimation};
  }

  &:after {
    left: 2px;
    text-shadow: ${(props) => `-0.05em 0 ${props.theme.colors.broom}`};
    animation: ${noise2Animation}, ${glitchAnimation};
  }
`;

const title = 'Tarnhelm';

const AppTitle: React.FC = () => <StyledAppTitle content={title}>{title}</StyledAppTitle>;

export default AppTitle;
