// pages/monographs/index.tsx
import { Div } from '@stylin.js/elements';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import nookies from 'nookies';

import { NextPageWithMonographs } from '@/interface/declaration';
import { adminAuth, prisma } from '@/lib';
import { MonographListView } from '@/views';

const MonographsPage: NextPageWithMonographs = ({ user, monographs }) => {
  if (!user) {
    return (
      <Div>
        You are not authorized to view this page. Please{' '}
        <Link href="/auth">login</Link>.
      </Div>
    );
  }

  return <MonographListView monographs={monographs} />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const sessionCookie = cookies.session || '';
  let user = null;
  let monographs = null;

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );
    user = {
      uid: decodedClaims.uid,
      email: decodedClaims.email || null,
    };

    monographs = await prisma.monograph.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Session cookie verification error:', error);
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
      monographs: JSON.parse(JSON.stringify(monographs)),
    },
  };
};

export default MonographsPage;
