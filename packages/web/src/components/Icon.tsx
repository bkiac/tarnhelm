import styled, { DefaultThemeIconContentCodes } from 'styled-components';

import { iconFont } from '../styles/mixins';

const StyledIcon = styled.i<{ glyph: keyof DefaultThemeIconContentCodes }>`
  ${iconFont}

  &:before {
    content: ${(props) => `'${props.theme.iconContentCodes[props.glyph]}'`};
  }
`;

export default StyledIcon;
