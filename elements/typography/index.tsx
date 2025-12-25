import stylin, { variant as stylinVariant } from '@stylin.js/react';
import { FC, PropsWithChildren, RefAttributes } from 'react';

import { TypographyElementProps, TypographyProps } from './typography.types';
import { getSizeStyle } from './typography.utils';

export const Typography: FC<PropsWithChildren<TypographyProps>> = ({
  as,
  variant,
  size,
  lines,
  color = 'text',
  ...props
}) => {
  const TypographyElement = stylin<
    TypographyElementProps & RefAttributes<unknown>
  >(as || 'p')(
    stylinVariant({
      scale: 'typography',
      property: 'variant',
    })
  );

  return (
    <TypographyElement
      variant={variant}
      {...getSizeStyle(variant, size)}
      overflow="hidden"
      color={color}
      WebkitLineClamp={lines}
      display="-webkit-box"
      textOverflow="ellipsis"
      WebkitBoxOrient="vertical"
      {...props}
    />
  );
};

Typography.displayName = 'Typography';
export * from './typography.types';
