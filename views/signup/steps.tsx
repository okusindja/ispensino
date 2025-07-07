import { Div } from '@stylin.js/elements';
import { Control, FieldErrors } from 'react-hook-form';

import { SignupFormData } from '@/zod/auth/signup';

import { FormField } from '../../components/form-elements';

type StepProps = {
  control: Control<SignupFormData>;
  errors: FieldErrors<SignupFormData>;
};

export const StepOne = ({ control, errors }: StepProps) => (
  <Div>
    <FormField<SignupFormData>
      name="name"
      control={control}
      label="Nome Completo"
      error={errors.name?.message}
    />
    <FormField<SignupFormData>
      name="phone"
      label="Telefone"
      type="tel"
      control={control}
      error={errors.phone?.message}
    />
    <FormField<SignupFormData>
      name="address"
      label="Endereço"
      control={control}
      error={errors.address?.message}
    />
  </Div>
);

export const StepTwo = ({ control, errors }: StepProps) => (
  <Div>
    <FormField<SignupFormData>
      name="email"
      label="Email"
      type="email"
      control={control}
      error={errors.email?.message}
    />
    <FormField<SignupFormData>
      name="password"
      label="Senha"
      type="password"
      control={control}
      error={errors.password?.message}
    />
    <FormField<SignupFormData>
      name="confirmPassword"
      label="Confirmar Senha"
      type="password"
      control={control}
      error={errors.confirmPassword?.message}
    />
  </Div>
);
