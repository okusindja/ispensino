import { Div } from '@stylin.js/elements';
import { Control } from 'react-hook-form';

import { SignupFormData } from '@/zod/auth/signup';

import { FormField } from '../../components/form-elements';

type StepProps = {
  control: Control<SignupFormData>;
};

export const StepOne = ({ control }: StepProps) => (
  <Div>
    <FormField<SignupFormData>
      name="name"
      control={control}
      label="Nome Completo"
    />
    <FormField<SignupFormData>
      name="phone"
      label="Telefone"
      type="tel"
      control={control}
    />
    <FormField<SignupFormData>
      name="address"
      label="Endereço"
      control={control}
    />
  </Div>
);

export const StepTwo = ({ control }: StepProps) => (
  <Div>
    <FormField<SignupFormData>
      name="email"
      label="Email"
      type="email"
      control={control}
    />
    <FormField<SignupFormData>
      name="password"
      label="Senha"
      type="password"
      control={control}
    />
    <FormField<SignupFormData>
      name="confirmPassword"
      label="Confirmar Senha"
      type="password"
      control={control}
    />
  </Div>
);
