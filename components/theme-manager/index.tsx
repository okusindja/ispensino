import { Global } from '@emotion/react';
import { ThemeProvider } from '@stylin.js/elements';
import { ThemeProvider as ThemePoviderNormal } from '@stylin.js/react';
import { FC, PropsWithChildren } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';

import { GlobalStyles } from '@/design-system';
import PrimaryTheme from '@/design-system/theme/primary';

const Theme: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider theme={PrimaryTheme}>
      <ThemePoviderNormal theme={PrimaryTheme}>
        <Global styles={GlobalStyles} />
        {children}
      </ThemePoviderNormal>
    </ThemeProvider>
  );
};

const ThemeManager: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Theme>
      <SkeletonTheme
        baseColor={PrimaryTheme.colors.background}
        highlightColor={PrimaryTheme.colors.foreground}
      >
        {children}
      </SkeletonTheme>
    </Theme>
  );
};

export default ThemeManager;
