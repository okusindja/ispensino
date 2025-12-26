import { Div } from '@stylin.js/elements';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import nookies from 'nookies';

import { NextPageWithUserAndPosts } from '@/interface/declaration';
import { adminAuth, prisma } from '@/lib';
import { SocialProfileView } from '@/views';

const SocialProfilePage: NextPageWithUserAndPosts = ({ user }) => {
  if (!user) {
    return (
      <Div>
        You are not authorized to view this page. Please{' '}
        <Link href="/auth">login</Link>.
      </Div>
    );
  }

  return <SocialProfileView />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const sessionCookie = cookies.session || '';
  let user = null;
  let socialUser = null;
  let posts = null;
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );
    user = {
      uid: decodedClaims.uid,
      email: decodedClaims.email || null,
    };
    socialUser = await prisma.user.findUnique({
      where: { firebaseId: user.uid },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });
    posts = await prisma.post.findMany({
      where: { authorId: socialUser?.id },
      orderBy: { createdAt: 'desc' },
    });
    if (!socialUser) {
      return {
        redirect: {
          destination: '/auth',
          permanent: false,
        },
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
      loggedUser: JSON.parse(JSON.stringify(socialUser)),
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
};

export default SocialProfilePage;
