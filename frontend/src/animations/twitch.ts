import { css, keyframes, FlattenSimpleInterpolation } from 'styled-components';

const twitchKeyframes = keyframes`
  1% {
    transform: rotateX(10deg) skewX(60deg);
  }
  2% {
    transform: rotateX(0deg) skewX(0deg);
  }
`;

export default function twitch(opts: {
  duration: number;
  delay: number;
}): FlattenSimpleInterpolation {
  const { duration, delay } = opts;
  return css`
    ${twitchKeyframes} ${duration}s ${delay}s infinite
  `;
}