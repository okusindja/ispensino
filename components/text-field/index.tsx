import { Div, Input, Label } from '@stylin.js/elements';
import { useTheme } from '@stylin.js/react';
import {
  ChangeEvent,
  FC,
  FocusEvent,
  PropsWithRef,
  startTransition,
  useId,
  useState,
} from 'react';

import { DesignSystemTheme } from '@/design-system/theme';
import { Typography } from '@/elements/typography';

import { TextFieldProps } from './text-field.types';

export const TextField: FC<PropsWithRef<TextFieldProps>> = ({
  Suffix,
  Prefix,
  label,
  onBlur,
  status,
  onFocus,
  disabled,
  fieldProps,
  supportingText,
  ...props
}) => {
  const { colors } = useTheme() as DesignSystemTheme;
  const [focus, setFocus] = useState(false);
  const [value, setValue] = useState<string>();
  const id = useId();

  const statusColor = focus || status === 'none' ? 'transparent' : status;

  const handleBorderStatus = () => {
    const isError = status === 'error';
    const isSuccess = status === 'success';
    const hasStatus = isError || isSuccess;
    if (disabled) return '1px solid ' + colors.disabled;
    if (hasStatus) return '1px solid ' + colors[status as 'error' | 'success'];
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement, Element>) => {
    if (!focus) startTransition(() => setFocus(true));

    onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement, Element>) => {
    if (focus) startTransition(() => setFocus(false));

    onBlur?.(e);
  };

  const changeValue = (input: string) => setValue(input);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    changeValue(e.target.value);

  return (
    <Div
      opacity={disabled ? 0.32 : 1}
      cursor={disabled ? 'not-allowed' : 'normal'}
    >
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
      <Div
        display="flex"
        borderRadius="M"
        alignItems="center"
        backgroundColor="surface_light"
        border={handleBorderStatus()}
        nHover={{
          borderWidth: focus ? '2px' : disabled ? '1px' : '1px',
          borderStyle: 'solid',
          borderColor: !disabled ? colors.outline : colors.outline,
        }}
        transition="all 300ms ease-in-out"
        {...fieldProps}
      >
        {Prefix && (
          <Div
            p="M"
            display="flex"
            color="textVariant"
            alignItems="center"
            justifyContent="center"
          >
            {Prefix}
          </Div>
        )}
        <Div
          flex="1"
          width="100%"
          display="flex"
          alignItems="stretch"
          flexDirection="column"
          justifyContent="center"
          p={Prefix ? 'XS' : '0'}
          mr={status ? '0.5rem' : 'unset'}
        >
          <Input
            id={id}
            all="unset"
            type="text"
            width="100%"
            fontSize="2XS"
            lineHeight="M"
            fontWeight="400"
            disabled={disabled}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={focus}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onChange={handleChange}
            color={'text'}
            backgroundColor="transparent"
            fontFamily="'Poppins', serif"
            defaultValue={value || props.defaultValue}
            nPlaceholder={{
              color: 'textVariant',
            }}
            {...props}
          />
        </Div>
        {Suffix && (
          <Div
            p="M"
            display="flex"
            color="textVariant"
            alignItems="center"
            justifyContent="center"
          >
            {Suffix}
          </Div>
        )}
      </Div>
    </Div>
  );
};

TextField.displayName = 'TextField';
export * from './text-field.types';
