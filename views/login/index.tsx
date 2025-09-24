import { Div, Form } from '@stylin.js/elements';

import { ThemeSwitcher } from '@/components';
import { Box } from '@/elements';
import { Typography } from '@/elements/typography';
import { LoginFormData, LoginSchema } from '@/zod';

import {
  FormField,
  SubmitButton,
  useZodForm,
} from '../../components/form-elements';
import useLogin from './hooks/useLogin';

const LoginView = () => {
  const { errorMsg, handleLogin, loading } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm<LoginFormData>(LoginSchema);

  return (
    <Box variant="container">
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
        <Typography
          mb="M"
          width="100%"
          color="text"
          size="small"
          lineHeight="100%"
          variant="headline"
        >
          Seja bem-vindo de volta!
        </Typography>
        <Typography
          mb="2XL"
          width="100%"
          color="text"
          size="medium"
          variant="body"
          lineHeight="100%"
        >
          Faça login com o seu email e senha.
        </Typography>
        <Form onSubmit={handleSubmit(handleLogin)} width="100%">
          <FormField<LoginFormData>
            name="email"
            type="email"
            label="Email"
            control={control}
            placeholder="seu@email.com"
            error={errors.email?.message}
          />
          <FormField<LoginFormData>
            label="Senha"
            name="password"
            type="password"
            control={control}
            placeholder="••••••"
            error={errors.password?.message}
          />

          {errorMsg && (
            <Div color="error" mb="1rem" textAlign="center">
              {errorMsg}
            </Div>
          )}

          <SubmitButton
            loading={isSubmitting || loading}
            isValid={!isSubmitting && !loading}
          >
            {isSubmitting || loading ? 'A carregar...' : 'Iniciar Sessão'}
          </SubmitButton>
        </Form>
      </Div>
    </Box>
  );
};

export default LoginView;
