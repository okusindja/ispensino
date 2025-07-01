import { StylinComponentProps } from '@stylin.js/react';
import { HTMLAttributes, RefAttributes } from 'react';

import { Theme } from '@/design-system/theme/primary';

export type TTypographyVariants = keyof Theme['typography'];
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
