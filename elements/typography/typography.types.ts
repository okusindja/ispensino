import { StylinComponentProps } from '@stylin.js/react';
import { HTMLAttributes, RefAttributes } from 'react';

import { DesignSystemTheme } from '@/design-system';

export type TTypographyVariants = keyof DesignSystemTheme['typography'];
export type TTypographySizes =
  | 'large'
  | 'medium'
  | 'small'
  | 'extraSmall'
  | 'micro';

export type TypographyElementProps = Omit<
  HTMLAttributes<HTMLElement>,
  'color' | 'translate' | 'content'
> &
  RefAttributes<unknown> & { variant: TTypographyVariants };

export interface TypographyProps
  extends StylinComponentProps,
    TypographyElementProps {
  as?: keyof JSX.IntrinsicElements;
  size: TTypographySizes;
  lines?: number;
}

export interface ISizeStyle {
  fontSize: string;
  lineHeight?: string;
  fontWeight?: string;
}
