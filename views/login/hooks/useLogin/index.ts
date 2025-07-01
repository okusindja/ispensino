import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import React from 'react';

interface UseLogin {
  errorMsg: string | null;
  loading: boolean;
  handleLogin: (data: { email: string; password: string }) => Promise<void>;
}

const useLogin = (): UseLogin => {
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleLogin = async (data: { email: string; password: string }) => {
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

      const result = await res.json();
      setLoading(false);
      if (!res.ok) {
        setErrorMsg(result.error || 'Login failed');
      } else {
        router.push('/');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setErrorMsg(message);
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
