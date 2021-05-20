import {createGlobalStyle} from "styled-components"

export const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
  }

  html {
    font-size: 16px;
    font-family: 'Roboto Mono', monospace;
    color: ${(props) => props.theme.palette.foreground};
  }

  body {
    background-color: ${(props) => props.theme.palette.background};
  }
`
