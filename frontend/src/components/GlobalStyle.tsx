import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
  }

  html {
    font-size: 16px;
    font-family: 'Roboto Mono', monospace;
    color: ${(props) => props.theme.colors.white};
  }

  body {
    background-color: ${(props) => props.theme.colors.black};
  }
`;

export default GlobalStyle;
