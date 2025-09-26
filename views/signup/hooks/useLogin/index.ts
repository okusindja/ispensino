import { useRouter } from 'next/router';
import React from 'react';

import { SignupFormData } from '@/zod/auth/signup';

interface UseSignup {
  errorMsg: string | null;
  loading: boolean;
  handleSignup: (data: SignupFormData) => Promise<void>;
}

const firebaseErrorMessages: Record<string, string> = {
  'auth/email-already-in-use': 'Este email já está registado.',
  'auth/invalid-email': 'O email fornecido não é válido.',
  'auth/weak-password': 'A palavra-passe é demasiado fraca.',
  'auth/operation-not-allowed': 'Este tipo de registo não está disponível.',
  'auth/network-request-failed': 'Erro de rede, verifique a sua ligação.',
};

const useSignup = (): UseSignup => {
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleSignup = async (data: SignupFormData) => {
    setErrorMsg(null);
    setLoading(true);

    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email,
          address: data.address,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Signup failed');
      }

      router.push('/');
    } catch (error) {
      let message = 'Ocorreu um erro durante o cadastro';
      if (typeof error === 'object' && error !== null) {
        const code = (error as { code?: string }).code;
        if (code && firebaseErrorMessages[code]) {
          message = firebaseErrorMessages[code];
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
    handleSignup,
  };
};

export default useSignup;
