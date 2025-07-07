import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { LoginFormData } from '@/zod';

interface UseLogin {
  errorMsg: string | null;
  loading: boolean;
  handleLogin: (data: LoginFormData) => Promise<void>;
}

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
      const message =
        error instanceof Error
          ? error.message
          : 'Ocorreu um erro durante o login';
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
