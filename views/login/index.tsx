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
          variant="headline"
          width="100%"
          lineHeight="100%"
          color="text"
          size="small"
          mb="M"
        >
          Seja bem-vindo de volta!
        </Typography>
        <Typography
          variant="body"
          width="100%"
          lineHeight="100%"
          color="text"
          size="medium"
          mb="2XL"
        >
          Faça login com o seu email e senha.
        </Typography>
        <Form onSubmit={handleSubmit(handleLogin)} width="100%">
          <FormField<LoginFormData>
            name="email"
            label="Email"
            type="email"
            placeholder="seu@email.com"
            control={control}
            error={errors.email?.message}
          />
          <FormField<LoginFormData>
            name="password"
            label="Senha"
            type="password"
            placeholder="••••••"
            control={control}
            error={errors.password?.message}
          />

          {errorMsg && (
            <Div color="error" mb="1rem" textAlign="center">
              {errorMsg}
            </Div>
          )}

          <SubmitButton loading={isSubmitting || loading}>
            {isSubmitting || loading ? 'A carregar...' : 'Iniciar Sessão'}
          </SubmitButton>
        </Form>
      </Div>
    </Box>
  );
};

export default LoginView;
