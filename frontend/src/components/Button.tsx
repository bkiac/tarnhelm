import React from 'react';
import styled, { css, keyframes } from 'styled-components';

interface StyleProps {
  content: string;
}

const glitchSize = '0.06em';

const glitch = keyframes`
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-${glitchSize}, ${glitchSize});
  }
  40% {
    transform: translate(-${glitchSize}, -${glitchSize});
  }
  60% {
    transform: translate(${glitchSize}, ${glitchSize});
  }
  80% {
    transform: translate(${glitchSize}, -${glitchSize});
  }
  to {
    transform: translate(0);
  }
`;

const StyledButton = styled.button<StyleProps>((props) => {
  const [paddingTopBottom, paddingLeftRight] = ['8px', '16px'];
  return css`
    font-size: 1.5rem;
    font-family: 'Roboto Condensed', sans-serif;
    font-style: italic;
    font-weight: 700;
    text-transform: uppercase;
    color: ${props.theme.colors.black};
    border: none;
    background-color: ${props.theme.colors.broom};
    position: relative;

    padding: ${paddingTopBottom} ${paddingLeftRight};

    span:first-child {
      position: relative;
      left: 0;
      top: 0;
      text-shadow: ${`${glitchSize} ${glitchSize} ${props.theme.colors.cyan}`};
      color: inherit;
      z-index: 3;
    }

    span:nth-child(2) {
      position: absolute;
      top: ${paddingTopBottom};
      left: ${paddingLeftRight};

      &:before, 
      &:after {
        content: '${props.content}';
        position: absolute;
        top: 0;
      }

      &:before {
        color: ${props.theme.colors.cyan};
        z-index: 1;
      }

      &:after {
        left: 0;
        color: ${props.theme.colors.radicalRed};
        z-index: 2;
      }
    }

    &:hover, 
    &:focus {
      span:first-child {
        text-shadow: none;
      }

      span:nth-child(2) {
        &:before {
          animation: ${glitch} 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
        }
        &:after {
          animation: ${glitch} 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite;
        }
      }
    }

    &:focus {
      border: 1px solid ${props.theme.colors.radicalRed}
    }
  `;
});

interface Props {
  onClick: (event: React.MouseEvent) => void;
  disabled: boolean;
  children: string;
}

// TODO: Allow only string children
const Button: React.FC<Props> = ({ children, ...rest }) => (
  <StyledButton {...rest} content={children} type="button">
    <span>{children}</span>
    <span />
  </StyledButton>
);

export default Button;
