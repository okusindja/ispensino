import { GetServerSideProps } from 'next';
import nookies from 'nookies';

import { NextPageWithSession } from '@/interface/declaration';
import { adminAuth } from '@/lib';

const Protected: NextPageWithSession = ({ user }) => {
  if (!user) {
    return (
      <div>
        You are not authorized to view this page. Please{' '}
        <a href="/auth/login">login</a>.
      </div>
    );
  }

  return <div>Protected</div>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const sessionCookie = cookies.session || '';
  let user = null;
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );
    user = {
      uid: decodedClaims.uid,
      email: decodedClaims.email || null,
    };
  } catch (error) {
    console.error('Session cookie verification error:', error);
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }
  return { props: { user } };
};

export default Protected;
