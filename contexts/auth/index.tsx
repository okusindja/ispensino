import { onAuthStateChanged, User } from 'firebase/auth';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import { auth } from '@/lib/firebase';

// type Roles = 'admin' | 'promoter' | 'common';
interface AuthContextType {
  user: User | null;
  // role: Roles;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  // role: 'common',
  loading: true,
});

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  // const [role, setRole] = useState<Roles>('common');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // if (currentUser) {
      //   const tokenResult = await getIdTokenResult(currentUser);
      //   setRole(tokenResult.claims.role as Roles);
      // } else {
      //   setRole('common');
      // }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
