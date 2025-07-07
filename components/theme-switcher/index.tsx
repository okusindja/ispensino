// switch-theme.tsx
import { Div } from '@stylin.js/elements';
import { FC } from 'react';
import Switch from 'react-switch';

import { useThemeContext } from '@/components/theme-manager';
import useResize from '@/hooks/use-resize';

import { MoonSVG, SunSVG } from '../svg';

const SwitchTheme: FC = () => {
  const { dark, setDark } = useThemeContext();
  const { isMobile } = useResize();

  const toggleTheme = () => {
    setDark(!dark);
  };

  return (
    <Switch
      onChange={toggleTheme}
      checked={dark}
      offColor="#ccc"
      onColor={!isMobile ? '#505050' : '#ccc'}
      checkedIcon={
        <Div
          display="flex"
          justifyContent="center"
          width="100%"
          height="100%"
          alignItems="center"
          color={!isMobile ? 'white' : 'black'}
        >
          <SunSVG width="100%" maxHeight="1rem" maxWidth="1rem" />
        </Div>
      }
      uncheckedIcon={
        <Div
          display="flex"
          justifyContent="center"
          width="100%"
          height="100%"
          alignItems="center"
          color="text"
        >
          <MoonSVG width="100%" maxHeight="1rem" maxWidth="1rem" />
        </Div>
      }
    />
  );
};

export default SwitchTheme;
