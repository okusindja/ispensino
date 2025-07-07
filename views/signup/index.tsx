import { Div, Form } from '@stylin.js/elements';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { ThemeSwitcher } from '@/components';
import { MultiStep, Step } from '@/components/multi-step-form';
import { Box } from '@/elements';
import { Button } from '@/elements/button';
import { SignupFormData, SignupSchema } from '@/zod/auth/signup';

import { SubmitButton, useZodForm } from '../../components/form-elements';
import useSignup from './hooks/useLogin';
import { StepOne, StepTwo } from './steps';

const SignupView = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const { errorMsg, handleSignup, loading } = useSignup();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
  } = useZodForm<SignupFormData>(SignupSchema);

  const nextStep = async () => {
    const fields =
      activeStep === 0
        ? (['name', 'phone', 'address'] as const)
        : (['email', 'password', 'confirmPassword'] as const);
    const isValidStep = await trigger(Array.from(fields));

    if (isValidStep) {
      setActiveStep((prev) => Math.min(prev + 1, 1));
    }
  };

  const prevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: SignupFormData) => {
    await handleSignup(data);
    router.push('/');
  };

  return (
    <Box variant="container" bg="background">
      <Div
        px="L"
        py="M"
        mb="1rem"
        height="3rem"
        width="100%"
        gridColumn="1/-1"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        {/* <LogoSVG maxWidth="3rem" maxHeight="3rem" width="100%" /> */}
        <ThemeSwitcher />
      </Div>
      <Div
        p="L"
        mx="auto"
        width="100%"
        display="flex"
        gridColumn="1/-1"
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
      >
        <Form onSubmit={handleSubmit(onSubmit)} width="100%">
          <MultiStep
            activeStep={activeStep}
            prevButton={
              activeStep > 0 && (
                <Button variant="secondary" size="medium" onClick={prevStep}>
                  Voltar
                </Button>
              )
            }
            nextButton={
              activeStep < 1 ? (
                <Button variant="primary" size="medium" onClick={nextStep}>
                  Próximo
                </Button>
              ) : (
                <SubmitButton loading={isSubmitting || loading}>
                  {isSubmitting || loading ? 'Criando conta...' : 'Criar Conta'}
                </SubmitButton>
              )
            }
          >
            <Step title="Informações Pessoais">
              <StepOne control={control} errors={errors} />
            </Step>

            <Step title="Informações de Contacto">
              <StepTwo control={control} errors={errors} />
            </Step>
          </MultiStep>

          {errorMsg && (
            <Div color="error" mt="1rem" textAlign="center">
              {errorMsg}
            </Div>
          )}
        </Form>
      </Div>
    </Box>
  );
};

export default SignupView;
