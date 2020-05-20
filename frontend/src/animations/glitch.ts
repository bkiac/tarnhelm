import { css, keyframes, Keyframes, FlattenSimpleInterpolation } from 'styled-components';

function createGlitchKeyframes(size: number): Keyframes {
  return keyframes`
    0% {
      transform: translate(0);
    }
    20% {
      transform: translate(-${size}em, ${size}em);
    }
    40% {
      transform: translate(-${size}em, -${size}em);
    }
    60% {
      transform: translate(${size}em, ${size}em);
    }
    80% {
      transform: translate(${size}em, -${size}em);
    }
    to {
      transform: translate(0);
    }
`;
}

export default function glitch(opts: {
  size: number;
  duration: number;
  direction?: 'normal' | 'reverse';
}): FlattenSimpleInterpolation {
  const { size, duration, direction = 'normal' } = opts;
  const gkfs = createGlitchKeyframes(size);
  return css`
    ${gkfs} ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${direction} both infinite;
  `;
}
