import breakpoints from '@/design-system/common/breakpoints';
import fontSizes from '@/design-system/common/font-sizes';
import { lineHeights } from '@/design-system/common/line-heights';
import radii from '@/design-system/common/radii';
import space from '@/design-system/common/space';
import {
  boxes,
  buttons as LightThemeButtons,
  typography as ThemeTypography,
} from '@/design-system/theme/primary/variants';
import { buttons as DarkThemeButtons } from '@/design-system/theme/secondary/variants';

import LightThemeColors from './primary/colors';
import DarkThemeColors from './secondary/colors';

const LightTheme = {
  radii,
  space,
  colors: LightThemeColors,
  buttons: LightThemeButtons,
  fontSizes,
  boxes,
  lineHeights,
  typography: ThemeTypography,
  breakpoints,
};

const DarkTheme = {
  radii,
  space,
  colors: DarkThemeColors,
  buttons: DarkThemeButtons,
  fontSizes,
  boxes,
  lineHeights,
  typography: ThemeTypography,
  breakpoints,
};

export type DesignSystemTheme = typeof LightTheme;

export { DarkTheme, LightTheme };
