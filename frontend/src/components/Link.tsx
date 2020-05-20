import styled, { css } from 'styled-components';

import { glitch } from '../animations';

const borderSize = 1;
const borderUnit = 'px';
const borderSizeWithUnit = `${borderSize}${borderUnit}`;

const glitchOptions: { size: number; unit: 'px'; duration: number } = {
  size: borderSize,
  unit: borderUnit,
  duration: 0.3,
};

const StyledLink = styled.a((props) => {
  return css`
    text-decoration: none;
    padding: 0 0.5rem 0.25rem;
    border-bottom: ${borderSizeWithUnit} solid ${props.theme.colors.white};
    position: relative;

    &:before,
    &:after {
      content: '';
      position: absolute;
      bottom: -${borderSizeWithUnit};
      left: 0;
      right: 0;
      height: ${borderSizeWithUnit};
      visibility: hidden;
    }

    &:before {
      background-color: ${props.theme.colors.cyan};
      z-index: -1;
    }

    &:after {
      background-color: ${props.theme.colors.radicalRed};
      z-index: -2;
    }

    &:hover {
      &:before {
        visibility: visible;
        animation: ${glitch(glitchOptions)};
      }

      &:after {
        visibility: visible;
        animation: ${glitch({ ...glitchOptions, direction: 'reverse' })};
      }
    }
  `;
});

export default StyledLink;