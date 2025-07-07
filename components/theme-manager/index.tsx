// theme-manager.tsx
import { Global } from '@emotion/react';
import { ThemeProvider } from '@stylin.js/elements';
import { ThemeProvider as ThemePoviderNormal } from '@stylin.js/react';
import { createContext, FC, PropsWithChildren, useContext } from 'react';

import { DarkTheme, GlobalStyles, LightTheme } from '@/design-system';
import { useLocalStorage } from '@/hooks';

import { ThemeProps } from './theme-manager.types';

export const ThemeContext = createContext<ThemeProps>({
  dark: false,
  setDark: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

const Theme: FC<PropsWithChildren<{ dark: boolean }>> = ({
  dark,
  children,
}) => {
  const theme = dark ? DarkTheme : LightTheme;

  return (
    <ThemeProvider theme={theme}>
      <ThemePoviderNormal theme={theme}>
        <Global styles={GlobalStyles(theme)} />
        {children}
      </ThemePoviderNormal>
    </ThemeProvider>
  );
};

const ThemeManager: FC<PropsWithChildren> = ({ children }) => {
  const [dark, setDark] = useLocalStorage('ISPENSINO-theme', false);

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      <Theme dark={dark}>{children}</Theme>
    </ThemeContext.Provider>
  );
};

export default ThemeManager;
