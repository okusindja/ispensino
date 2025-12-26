import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { LoginFormData } from '@/zod';

interface UseLogin {
  errorMsg: string | null;
  loading: boolean;
  handleLogin: (data: LoginFormData) => Promise<void>;
}

const errorMessages: Record<string, string> = {
  'auth/invalid-credential':
    'Credenciais inválidas. Verifique o email e a palavra-passe.',
  'auth/user-not-found': 'Não encontrámos nenhuma conta com este email.',
  'auth/wrong-password': 'A palavra-passe está incorreta.',
  'auth/too-many-requests':
    'A sua conta foi temporariamente bloqueada devido a várias tentativas falhadas. Tente novamente mais tarde.',
  'auth/network-request-failed':
    'Erro de ligação à rede. Verifique a sua internet.',
  'auth/invalid-email': 'O email introduzido não é válido.',
};

const useLogin = (): UseLogin => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (data: LoginFormData) => {
    setErrorMsg(null);
    try {
      setLoading(true);
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + idToken,
        },
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Login falhou');
      }

      router.push('/');
    } catch (error) {
      let message = 'Ocorreu um erro durante o login';
      if (typeof error === 'object' && error !== null) {
        const code = (error as { code?: string }).code;
        if (code && errorMessages[code]) {
          message = errorMessages[code];
        } else if (error instanceof Error) {
          message = error.message;
        }
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    errorMsg,
    loading,
    handleLogin,
  };
};

export default useLogin;
