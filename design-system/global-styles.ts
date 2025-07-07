import { css } from '@emotion/react';

import { DesignSystemTheme } from './theme';

export const GlobalStyles = (theme: DesignSystemTheme) => css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', serif;
  }

  html {
    scroll-behavior: smooth;
  }

  body,
  html {
    overflow-x: hidden;
    background-color: ${theme.colors.background};
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul {
    list-style: none;
  }
  /* width */
  ::-webkit-scrollbar {
    width: 10px;
    padding: 2rem;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    border-radius: 0.5rem;
    background: transparent;
    transition: all 300ms ease-in-out;
  }

  /* Track on hover */
  ::-webkit-scrollbar-track:hover {
    background: #fff1;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 0.5rem;
    border: 5px solid transparent;
  }

  .TabsTrigger[data-state='active'] {
    color: ${theme.colors.text};
    background-color: ${theme.colors.surface_light};
  }
  .TabsTrigger:not([data-state='active']) {
    color: ${theme.colors.text};
  }

  .TabsTrigger--secondary {
    transition: all 300ms ease-in-out;
    color: ${theme.colors.foreground};
  }

  .TabsTrigger--secondary[data-state='active'] {
    color: ${theme.colors.primary};
    background-color: ${theme.colors.foreground};
  }

  .TabsTrigger--secondary:not([data-state='active']):hover {
    color: ${theme.colors.secondary};
    transition: all 300ms ease-in-out;
  }

  .TabsTrigger--tertiary {
    transition: all 300ms ease-in-out;
    color: ${theme.colors.foreground};
  }

  .TabsTrigger--tertiary[data-state='active'] {
    background-color: ${theme.colors.tertiary};
  }

  .TabsTrigger--tertiary:not([data-state='active']):hover {
    color: ${theme.colors.secondary};
    transition: all 300ms ease-in-out;
  }
`;
