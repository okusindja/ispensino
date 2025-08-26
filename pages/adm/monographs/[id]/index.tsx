// pages/monographs/[id].tsx
import { Div } from '@stylin.js/elements';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import nookies from 'nookies';

import { NextPageWithMonograph } from '@/interface/declaration';
import { adminAuth, prisma } from '@/lib';
import { MonographDetailView } from '@/views';

const MonographDetailsPage: NextPageWithMonograph = ({ user, monograph }) => {
  if (!user) {
    return (
      <Div>
        You are not authorized to view this page. Please{' '}
        <Link href="/auth">login</Link>.
      </Div>
    );
  }

  return <MonographDetailView monograph={monograph} />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const sessionCookie = cookies.session || '';
  const id = ctx.params?.id;
  let user = null;
  let monograph = null;

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );
    user = {
      uid: decodedClaims.uid,
      email: decodedClaims.email || null,
    };

    monograph = await prisma.monograph.findUnique({
      where: { id: id as string },
    });

    if (!monograph) {
      return {
        notFound: true,
      };
    }
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
      monograph: JSON.parse(JSON.stringify(monograph)),
    },
  };
};

export default MonographDetailsPage;
