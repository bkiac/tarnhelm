import React from 'react';
import styled, { css, keyframes, StyledProps, Keyframes } from 'styled-components';

function createScaleAndColorKeyframes(props: StyledProps<{}>): Keyframes {
  return keyframes`
    25% {
      background-color: ${props.theme.palette.primary};
      transform: scale(1.3) translate(-2px, -2px);
    }

    50% {
      background-color: ${props.theme.palette.secondary};
      transform: scale(1);
    }

    75% {
      background-color: ${props.theme.palette.tertiary};
      transform: scale(1);
    }
  `;
}

const StyledLoader = styled.div(
  (props) => css`
    background-color: ${props.theme.palette.background};
    width: 60px;
    height: 60px;
    transform: rotate(45deg);

    div {
      width: 6px;
      height: 6px;
      background: #ffed0b;
      float: left;
      margin-bottom: 12px;
      animation: ${createScaleAndColorKeyframes(props)} 2s ease infinite;

      &:not(:nth-child(4n + 4)) {
        margin-right: 12px;
      }

      &:nth-child(1) {
        animation-delay: 0;
      }

      &:nth-child(2),
      &:nth-child(5) {
        animation-delay: 0.1s;
      }

      &:nth-child(3),
      &:nth-child(6),
      &:nth-child(9) {
        animation-delay: 0.2s;
      }

      &:nth-child(4),
      &:nth-child(7),
      &:nth-child(10),
      &:nth-child(13) {
        animation-delay: 0.3s;
      }

      &:nth-child(8),
      &:nth-child(11),
      &:nth-child(14) {
        animation-delay: 0.4s;
      }

      &:nth-child(12),
      &:nth-child(15) {
        animation-delay: 0.5s;
      }

      &:nth-child(16) {
        animation-delay: 0.6s;
      }
    }
  `,
);

const Loader: React.FC = () => (
  <StyledLoader>
    {Array.from(Array(16)).map((_, i) => (
      <div key={i} /> // eslint-disable-line react/no-array-index-key
    ))}
  </StyledLoader>
);

export default Loader;
