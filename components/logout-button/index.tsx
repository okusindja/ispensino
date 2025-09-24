import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

import { Button } from '@/elements';
import { LogoutSVG } from '../svg';

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
    <Button variant="secondary" size="medium" isIcon onClick={handleLogout}>
      <LogoutSVG maxWidth="1.5rem" maxHeight="1.5rem" width="100%" />
    </Button>
  );
};

export default LogoutButton;
