import React from 'react';
import styled, { css, StyledProps, FlattenSimpleInterpolation } from 'styled-components';

import { twitch, noise } from '../animations';

interface StyleProps {
  content: string;
}

const twitchOptions = {
  duration: 5,
  delay: 5,
};
const noiseOptions = {
  duration: 8,
  steps: 30,
  fraction: 2,
};

// Disable these ESLint rules here because it sees `twitch` and `noise` functions as any
/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
const twitchAnim = (): FlattenSimpleInterpolation => twitch(twitchOptions);
const glitchAnim1 = (): FlattenSimpleInterpolation =>
  css`
    ${noise(noiseOptions)}, ${twitch({ ...twitchOptions, delay: twitchOptions.delay + 0.05 })}
  `;
const glitchAnim2 = (): FlattenSimpleInterpolation =>
  css`
    ${noise(noiseOptions)}, ${twitch(twitchOptions)}
  `;
/* eslint-enable */

const StyledAppTitle = styled.p<StyledProps<StyleProps>>(
  (props) => css`
    margin: 0;
    font-size: 2.5rem;
    font-family: 'Roboto Condensed', sans-serif;
    font-style: italic;
    font-weight: 700;
    text-transform: uppercase;
    color: ${props.theme.colors.white};
    position: relative;
    animation: ${twitchAnim};

    &:before,
    &:after {
      content: '${props.content}';
      position: absolute;
      top: 0;
      overflow: hidden;
      background: ${props.theme.colors.black};
    }

    &:before {
      left: -2px;
      text-shadow: -0.05em 0 ${props.theme.colors.radicalRed};
      animation: ${glitchAnim1};
    }

    &:after {
      left: 2px;
      text-shadow: -0.05em 0 ${props.theme.colors.broom};
      animation: ${glitchAnim2};
    }
`,
);

const title = 'Tarnhelm';

const AppTitle: React.FC = () => <StyledAppTitle content={title}>{title}</StyledAppTitle>;

export default AppTitle;
