import { StylinComponentProps } from '@stylin.js/react';
import { ButtonHTMLAttributes, RefAttributes } from 'react';

import { DesignSystemTheme } from '@/design-system/theme';

export type TButtonVariants = keyof DesignSystemTheme['buttons'];
export type TButtonSizes = 'small' | 'medium' | 'large';

export type ButtonElementProps = Omit<
  ButtonHTMLAttributes<HTMLElement>,
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
