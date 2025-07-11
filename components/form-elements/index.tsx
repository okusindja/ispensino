/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod';
import { Div, Input, Label } from '@stylin.js/elements';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { ZodSchema } from 'zod';

import { TextField } from '@/components';
import { Box } from '@/elements';
import { Button } from '@/elements';

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

type SubmitButtonProps = {
  loading: boolean;
  children: React.ReactNode;
};

export const SubmitButton = ({ children }: SubmitButtonProps) => (
  <Button variant="primary" size="medium">
    {children}
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
