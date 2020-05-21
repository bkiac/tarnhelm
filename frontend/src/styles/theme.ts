import { DefaultTheme, DefaultThemeIconContentCodes, DefaultThemeColors } from 'styled-components';

const iconContentCodes: DefaultThemeIconContentCodes = {
  delete: '\\e900',
  save: '\\e901',
  death: '\\e902',
  danger: '\\e903',
};

const colors: DefaultThemeColors = {
  black: '#000',
  white: '#fff',
  broom: '#ffed0b',
  cyan: '#06f0fd',
  sangria: '#9a0006',
  radicalRed: '#ff2865',
  mediumPurple: '#a13be0',
};

const theme: DefaultTheme = {
  iconContentCodes,
  colors,
};

export default theme;
