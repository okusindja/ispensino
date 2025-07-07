import { Div } from '@stylin.js/elements';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import nookies from 'nookies';

import { NextPageWithSession } from '@/interface/declaration';
import { adminAuth } from '@/lib';
import HomeView from '@/views/home';

const HomePage: NextPageWithSession = ({ user }) => {
  if (!user) {
    return (
      <Div>
        You are not authorized to view this page. Please{' '}
        <Link href="/auth">login</Link>.
      </Div>
    );
  }

  return <HomeView />;
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
        destination: '/auth',
        permanent: false,
      },
    };
  }
  return { props: { user } };
};

export default HomePage;
