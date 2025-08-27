// src/components/form-elements/index.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod';
import { Div, Input, Label } from '@stylin.js/elements';
import React from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import Select from 'react-select';
import { ZodSchema } from 'zod';

import { TextField } from '@/components';
import { Box } from '@/elements';
import { Button } from '@/elements';
import { Typography } from '@/elements/typography';

type FormFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const FormField = <T extends FieldValues>({
  name,
  label,
  control,
  error,
  ...props
}: FormFieldProps<T>) => (
  <Div mb="1.5rem">
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          width="100%"
          label={label}
          id={String(name)}
          borderRadius="0.5rem"
          type={props.type || 'text'}
          status={error ? 'error' : 'none'}
          supportingText={error ? error : ''}
          borderColor={error ? 'error' : 'border'}
          {...field}
          {...props}
        />
      )}
    />
  </Div>
);

type SelectFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
  error?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  isMulti?: boolean;
};

export const SelectField = <T extends FieldValues>({
  name,
  label,
  control,
  error,
  options,
  placeholder = 'Selecione...',
  isMulti = false,
}: SelectFieldProps<T>) => (
  <Div mb="1.5rem">
    <Typography variant="fancy" size="small" mb="M" color="primary">
      <Label htmlFor={String(name)} display="block">
        {label}:
      </Label>
    </Typography>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          {...field}
          options={options}
          placeholder={placeholder}
          isMulti={isMulti}
          classNamePrefix="react-select"
          styles={{
            control: (base, state) => ({
              ...base,
              borderColor: error
                ? '#e53935'
                : state.isFocused
                  ? '#1976d2'
                  : '#ccc',
              borderRadius: '0.5rem',
              padding: '0.25rem',
              boxShadow: state.isFocused
                ? error
                  ? '0 0 0 1px #e53935'
                  : '0 0 0 1px #1976d2'
                : 'none',
              '&:hover': {
                borderColor: error ? '#e53935' : '#1976d2',
              },
            }),
            menu: (base) => ({
              ...base,
              borderRadius: '0.5rem',
              zIndex: 9999,
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected
                ? '#1976d2'
                : state.isFocused
                  ? '#e3f2fd'
                  : 'white',
              color: state.isSelected ? 'white' : 'black',
            }),
          }}
          value={
            isMulti
              ? options.filter((option) => field.value?.includes(option.value))
              : options.find((option) => option.value === field.value)
          }
          onChange={(selected) => {
            if (isMulti) {
              const values = Array.isArray(selected)
                ? selected.map((item) => item.value)
                : [];
              field.onChange(values);
            } else {
              const value = (selected as { value: string })?.value || '';
              field.onChange(value);
            }
          }}
        />
      )}
    />
    {error && (
      <Div color="error" fontSize="0.875rem" mt="0.25rem">
        {error}
      </Div>
    )}
  </Div>
);

type RadioButtonProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  value: string;
  control: Control<T>;
  error?: string;
};

export const RadioButton = <T extends FieldValues>({
  name,
  label,
  value,
  control,
  error,
}: RadioButtonProps<T>) => (
  <Box display="flex" alignItems="center" mb="0.5rem">
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <>
          <Input
            type="radio"
            id={`${String(name)}-${value}`}
            checked={field.value === value}
            onChange={() => field.onChange(value)}
            style={{ marginRight: '0.5rem' }}
          />
          <Label htmlFor={`${String(name)}-${value}`} fontWeight="normal">
            {label}
          </Label>
        </>
      )}
    />
  </Box>
);

type RadioGroupProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
  error?: string;
  options: Array<{ value: string; label: string }>;
  direction?: 'horizontal' | 'vertical';
};

export const RadioGroup = <T extends FieldValues>({
  name,
  label,
  control,
  error,
  options,
  direction = 'vertical',
}: RadioGroupProps<T>) => (
  <Div mb="1.5rem">
    <Label htmlFor={String(name)} mb="0.5rem" display="block" fontWeight="500">
      {label}
    </Label>
    <Box
      display="flex"
      flexDirection={direction === 'horizontal' ? 'row' : 'column'}
      gap={direction === 'horizontal' ? '1rem' : '0.5rem'}
    >
      {options.map((option) => (
        <RadioButton
          key={option.value}
          name={name}
          label={option.label}
          value={option.value}
          control={control}
        />
      ))}
    </Box>
    {error && (
      <Div color="error" fontSize="0.875rem" mt="0.25rem">
        {error}
      </Div>
    )}
  </Div>
);

type SubmitButtonProps = {
  loading: boolean;
  children: React.ReactNode;
};

export const SubmitButton = ({ loading, children }: SubmitButtonProps) => (
  <Button variant="primary" size="medium" type="submit" disabled={loading}>
    {loading ? 'Carregando...' : children}
  </Button>
);

type UseZodFormReturn<T extends FieldValues> = {
  control: Control<T>;
  handleSubmit: (
    onSubmit: SubmitHandler<T>
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  formState: {
    errors: FieldErrors<T>;
    isSubmitting: boolean;
    isValid: boolean;
  };
  trigger: (fieldNames?: (keyof T)[]) => Promise<boolean>;
  getValues: () => T;
  setValue: (name: Path<T>, value: any) => void;
  reset: (values?: Partial<T>) => void;
};

export const useZodForm = <T extends FieldValues>(
  schema: ZodSchema<T>,
  defaultValues?: Partial<T>
): UseZodFormReturn<T> => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    trigger,
    getValues,
    setValue,
    reset,
  } = useForm<T>({
    resolver: zodResolver(schema as any),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: defaultValues || ({} as any),
  });

  return {
    control,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
      isValid,
    },
    trigger: async (fieldNames) => {
      const names = fieldNames ? fieldNames.map((f) => f as string) : undefined;
      return trigger(names as any);
    },
    getValues,
    setValue: (name: Path<T>, value: any) => setValue(name, value),
    reset: (values?: Partial<T>) => reset(values as any),
  };
};

export const CheckboxField = ({
  name,
  label,
  value,
  control,
}: {
  name: string;
  label: string;
  value?: string;
  control: any;
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <Box display="flex" alignItems="center">
        <Input
          type="checkbox"
          id={`${name}-${value || ''}`}
          checked={value ? (field.value || []).includes(value) : field.value}
          onChange={(e) => {
            if (value) {
              const newValue = [...(field.value || [])];
              if (e.target.checked) {
                newValue.push(value);
              } else {
                const index = newValue.indexOf(value);
                if (index !== -1) newValue.splice(index, 1);
              }
              field.onChange(newValue);
            } else {
              field.onChange(e.target.checked);
            }
          }}
          style={{ marginRight: '0.5rem' }}
        />
        <Label htmlFor={`${name}-${value || ''}`}>{label}</Label>
      </Box>
    )}
  />
);
