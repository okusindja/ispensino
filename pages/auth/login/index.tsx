import { GetServerSideProps } from 'next';
import nookies from 'nookies';

import { adminAuth } from '@/lib';
import LoginView from '@/views/login';

const Login = () => {
  return <LoginView />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const sessionCookie = cookies.session || '';

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );
    if (decodedClaims) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    console.error(
      `[ERROR] pages/login/index.tsx getServerSideProps: ${message}`
    );
  }

  return { props: {} };
};

export default Login;
