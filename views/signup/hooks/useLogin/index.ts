import { useRouter } from 'next/router';
import React from 'react';

import { SignupFormData } from '@/zod/auth/signup';

interface UseSignup {
  errorMsg: string | null;
  loading: boolean;
  handleSignup: (data: SignupFormData) => Promise<void>;
}

const useSignup = (): UseSignup => {
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleSignup = async (data: SignupFormData) => {
    setErrorMsg(null);
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
      const message =
        error instanceof Error
          ? error.message
          : 'Ocorreu um erro durante o registo';
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
