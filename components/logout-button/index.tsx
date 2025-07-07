import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

import { Button } from '@/elements';

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);

      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Logout failed on the server');
      }

      router.push('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Button variant="secondary" size="medium" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
