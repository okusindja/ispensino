import { StylinComponentProps } from '@stylin.js/react';
import { HTMLAttributes, RefAttributes } from 'react';

import { Theme } from '@/design-system/theme/primary';

export type TButtonVariants = keyof Theme['buttons'];
export type TButtonSizes = 'small' | 'medium' | 'large';

export type ButtonElementProps = Omit<
  HTMLAttributes<HTMLElement>,
  'color' | 'translate' | 'content'
> &
  RefAttributes<unknown> & { variant: TButtonVariants };

export interface ButtonProps extends StylinComponentProps, ButtonElementProps {
  as?: keyof JSX.IntrinsicElements;
  size: TButtonSizes;
  isIcon?: boolean;
}

export interface ISizeStyle {
  fontSize: string;
  borderRadius?: string;
  padding: string;
  height?: string;
  minHeight?: string;
  minWidth?: string;
}
