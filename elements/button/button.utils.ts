import fontSizes from '@/design-system/common/font-sizes';
import radii from '@/design-system/common/radii';

import { ISizeStyle, TButtonSizes } from './button.types';

export const getSizeStyle = (
  size: TButtonSizes,
  isIcon: boolean = false
): ISizeStyle =>
  ({
    large: {
      padding: '0 2rem',
      height: '3rem',
      fontSize: fontSizes.M,
      ...(isIcon && {
        padding: '0',
        width: '3rem',
        height: '3rem',
        borderRadius: radii.full,
      }),
    },
    medium: {
      padding: '1rem',
      fontSize: fontSizes.S,
      ...(isIcon && {
        padding: '0',
        width: '2.5rem',
        height: '2.5rem',
        borderRadius: radii.full,
      }),
    },
    small: {
      padding: '0 1rem',
      height: '2rem',
      fontSize: fontSizes.XS,
      ...(isIcon && {
        padding: '0',
        width: '2rem',
        height: '2rem',
        borderRadius: radii.full,
      }),
    },
  })[size];
