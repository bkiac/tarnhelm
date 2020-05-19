import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html {
    font-size: 16px;
  }

  body {
    background-color: ${(props) => props.theme.colors.black};
  }

  * {
    font-family: 'Roboto Mono', monospace;
    color: ${(props) => props.theme.colors.white};
  }
`;

export default GlobalStyle;
