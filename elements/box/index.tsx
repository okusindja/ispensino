import stylin, { variant } from '@stylin.js/react';
import {
  FC,
  forwardRef,
  PropsWithChildren,
  PropsWithRef,
  RefAttributes,
} from 'react';

import { BoxElementProps, BoxProps } from '../box/box.types';

export const Box: FC<PropsWithRef<PropsWithChildren<BoxProps>>> = forwardRef(
  ({ as, ...props }, ref) => {
    const BoxElement = stylin<BoxElementProps & RefAttributes<unknown>>(
      as || 'div'
    )(
      variant({
        scale: 'boxes',
        property: 'variant',
      })
    );

    return <BoxElement {...props} ref={ref} />;
  }
);

Box.displayName = 'Box';
export * from '../box/box.types';
