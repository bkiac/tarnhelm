import {
  DefaultTheme,
  DefaultThemeIconContentCodes,
  DefaultThemeColors,
  DefaultThemePalette,
} from 'styled-components';

const iconContentCodes: DefaultThemeIconContentCodes = {
  delete: '\\e900',
  save: '\\e901',
  death: '\\e902',
  danger: '\\e903',
  security: '\\e904',
};

const colors: DefaultThemeColors = {
  black: '#000',
  white: '#fff',
  broom: '#ffed0b',
  cyan: '#06f0fd',
  radicalRed: '#ff2865',
  sangria: '#9a0006',
  mediumPurple: '#a13be0',
};

const palette: DefaultThemePalette = {
  background: colors.black,
  foreground: colors.white,
  primary: colors.broom,
  secondary: colors.cyan,
  tertiary: colors.radicalRed,
  error: colors.sangria,
};

const theme: DefaultTheme = {
  iconContentCodes,
  colors,
  palette,
};

export default theme;
