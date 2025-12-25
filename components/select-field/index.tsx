import { Div, Label, Select as NativeSelect } from '@stylin.js/elements';
import { StylinComponentProps, useTheme } from '@stylin.js/react';
import {
  FC,
  FocusEvent,
  PropsWithRef,
  ReactNode,
  startTransition,
  useId,
  useState,
} from 'react';

import { DesignSystemTheme } from '@/design-system/theme';
import { Typography } from '@/elements/typography';
import { SelectFieldProps } from './select-field.types';

export const SelectField: FC<
  PropsWithRef<SelectFieldProps & StylinComponentProps>
> = ({
  label,
  supportingText,
  status = 'none',
  disabled,
  Prefix,
  Suffix,
  onBlur,
  onFocus,
  children,
  fieldProps,
  ...props
}) => {
  const { colors } = useTheme() as DesignSystemTheme;
  const [focus, setFocus] = useState(false);
  const id = useId();

  const statusColor = focus || status === 'none' ? 'transparent' : status;

  const handleBorderStatus = () => {
    if (disabled) return `1px solid ${colors.disabled}`;
    if (status === 'error' || status === 'success') {
      return `1px solid ${colors[status as keyof typeof colors]}`;
    }
    return `1px solid ${colors.outline}`;
  };

  const handleFocus = (e: FocusEvent<HTMLSelectElement>) => {
    if (!focus) startTransition(() => setFocus(true));
    onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLSelectElement>) => {
    if (focus) startTransition(() => setFocus(false));
    onBlur?.(e);
  };

  return (
    <Div
      opacity={disabled ? 0.32 : 1}
      cursor={disabled ? 'not-allowed' : 'normal'}
    >
      {/* LABEL + SUPPORT */}
      <Div display="flex" gap="M" alignItems="center" mb="S">
        {label && (
          <Label htmlFor={id}>
            <Typography variant="fancy" size="extraSmall" color="primary">
              {label}:
            </Typography>
          </Label>
        )}

        {supportingText && (
          <Typography
            variant="fancy"
            size="extraSmall"
            fontSize="0.75rem"
            color={disabled ? 'surface' : statusColor || 'text'}
          >
            {supportingText}
          </Typography>
        )}
      </Div>

      {/* SELECT CONTAINER */}
      <Div
        py="L"
        display="flex"
        borderRadius="M"
        alignItems="center"
        backgroundColor="surface"
        border={handleBorderStatus()}
        nHover={{
          borderWidth: focus ? '2px' : '1px',
          borderStyle: 'solid',
          borderColor: colors.outline,
        }}
        transition="all 300ms ease-in-out"
        {...fieldProps}
      >
        {Prefix && (
          <Div p="M" display="flex" color="textVariant" alignItems="center">
            {Prefix}
          </Div>
        )}

        <Div
          flex="1"
          width="100%"
          display="flex"
          alignItems="stretch"
          px={Prefix ? 'XS' : 'L'}
        >
          <NativeSelect
            id={id}
            all="unset"
            width="100%"
            fontSize="2XS"
            lineHeight="M"
            fontWeight="400"
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            color="text"
            backgroundColor="transparent"
            fontFamily="'Poppins', serif"
            {...props}
          >
            {children}
          </NativeSelect>
        </Div>

        {Suffix && (
          <Div p="M" display="flex" color="textVariant" alignItems="center">
            {Suffix}
          </Div>
        )}
      </Div>
    </Div>
  );
};

SelectField.displayName = 'SelectField';
