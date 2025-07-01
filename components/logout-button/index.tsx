import { Button } from '@stylin.js/elements';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

// Adjust the import as needed

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

      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;
