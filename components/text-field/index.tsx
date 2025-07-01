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

import { Theme } from '@/design-system/theme/primary';
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
  const { colors } = useTheme() as Theme;
  const [focus, setFocus] = useState(false);
  const [value, setValue] = useState<string>();
  const id = useId();

  const statusColor = focus || status === 'none' ? 'text' : status;

  const handleBorderStatus = () => {
    const isFocused = focus && !disabled;
    const isError = status === 'error';
    const isSuccess = status === 'success';
    const hasStatus = isError || isSuccess;
    if (disabled) return '1px solid ' + colors.disabled;
    if (isFocused) return '2px solid ' + colors.textPlaceholder;
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
      {label && (
        <Label htmlFor={id}>
          <Typography variant="fancy" size="extraSmall" mb="S" color="primary">
            {label}
          </Typography>
        </Label>
      )}
      <Div
        display="flex"
        borderRadius="M"
        height="2.5rem"
        alignItems="center"
        backgroundColor="surface_smoke"
        border={handleBorderStatus() || '1px solid ' + colors.outlineVariant}
        nHover={{
          borderWidth: focus ? '2px' : disabled ? '1px' : '1px',
          borderStyle: 'solid',
          borderColor: !disabled ? colors.outline : colors.outlineVariant,
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
          height="2.5rem"
          display="flex"
          alignItems="stretch"
          flexDirection="column"
          justifyContent="center"
          p={Prefix ? 'XS' : 'M'}
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
            color={statusColor}
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
      {supportingText && (
        <Div
          pt="2XS"
          fontSize="0.75rem"
          color={disabled ? 'surface' : statusColor}
        >
          {supportingText}
        </Div>
      )}
    </Div>
  );
};

TextField.displayName = 'TextField';
export * from './text-field.types';
