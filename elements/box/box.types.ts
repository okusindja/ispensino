import { StylinComponentProps } from '@stylin.js/react';
import { HTMLAttributes } from 'react';

export type Boxes = 'container';

export type BoxElementProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'color' | 'translate' | 'content'
>;

export interface BoxProps extends StylinComponentProps, BoxElementProps {
  as?: keyof JSX.IntrinsicElements;
  variant?: Boxes;
}
