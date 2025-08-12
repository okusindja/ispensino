import { User as PrismaUser } from '@prisma/client';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import useSWR from 'swr';

import { fetcherWithCredentials } from '@/constants/fetchers';
import { auth } from '@/lib/firebase';

// type Roles = 'admin' | 'promoter' | 'common';
interface AuthContextType {
  user: (User & PrismaUser) | null;
  // role: Roles;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  // role: 'common',
  loading: true,
});

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<(User & PrismaUser) | null>(null);
  // const [role, setRole] = useState<Roles>('common');
  const [loading, setLoading] = useState(true);
  const { data: userData } = useSWR<PrismaUser>(
    `/api/users/me`,
    fetcherWithCredentials
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && userData) {
        setUser({ ...currentUser, ...userData });
      } else {
        setUser(null);
      }
      // if (currentUser) {
      //   const tokenResult = await getIdTokenResult(currentUser);
      //   setRole(tokenResult.claims.role as Roles);
      // } else {
      //   setRole('common');
      // }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userData]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
