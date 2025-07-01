import stylin, { variant as stylinVariant } from '@stylin.js/react';
import { FC, PropsWithChildren, RefAttributes } from 'react';

import { ButtonElementProps, ButtonProps } from './button.types';
import { getSizeStyle } from './button.utils';

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  as,
  variant,
  size,
  isIcon,
  ...props
}) => {
  const ButtonElement = stylin<ButtonElementProps & RefAttributes<unknown>>(
    as || 'button'
  )(
    stylinVariant({
      scale: 'buttons',
      property: 'variant',
    })
  );

  return (
    <ButtonElement variant={variant} {...getSizeStyle(size, isIcon)} {...props}>
      {props.children}
    </ButtonElement>
  );
};

Button.displayName = 'Button';
export * from './button.types';
