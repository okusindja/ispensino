import { useEffect } from 'react';

import { DarkTheme, LightTheme } from '@/design-system';

import useLocalStorage from '../use-local-storage';

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>(
    'ISPENSINO-theme',
    'light'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return {
    theme,
    toggleTheme,
    themeObject: theme === 'light' ? LightTheme : DarkTheme,
  };
};

export default useTheme;
