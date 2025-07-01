import breakpoints from '@/design-system/common/breakpoints';
import fontSizes from '@/design-system/common/font-sizes';
import { lineHeights } from '@/design-system/common/line-heights';
import radii from '@/design-system/common/radii';
import space from '@/design-system/common/space';
import {
  boxes,
  buttons as ThemeButtons,
  typography as ThemeTypography,
} from '@/design-system/theme/primary/variants';

import ThemeColors from './colors';

const PrimaryTheme = {
  radii,
  space,
  colors: ThemeColors,
  buttons: ThemeButtons,
  fontSizes,
  boxes,
  lineHeights,
  typography: ThemeTypography,
  breakpoints,
};

export type Theme = typeof PrimaryTheme;

export default PrimaryTheme;
