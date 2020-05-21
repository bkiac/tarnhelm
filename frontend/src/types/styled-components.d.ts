import 'styled-components';

declare module 'styled-components' {
  export interface DefaultThemeIconContentCodes {
    delete: '\\e900';
    save: '\\e901';
    death: '\\e902';
    danger: '\\e903';
  }

  export interface DefaultThemeColors {
    black: '#000';
    white: '#fff';
    broom: '#ffed0b';
    cyan: '#06f0fd';
    sangria: '#9a0006';
    radicalRed: '#ff2865';
    mediumPurple: '#a13be0';
  }

  export interface DefaultTheme {
    iconContentCodes: DefaultThemeIconContentCodes;
    colors: DefaultThemeColors;
  }
}
