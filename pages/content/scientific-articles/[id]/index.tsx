import { Div } from '@stylin.js/elements';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import nookies from 'nookies';

import { NextPageWithScientificArticle } from '@/interface/declaration';
import { adminAuth, prisma } from '@/lib';
import { DetailedScientificArticleView } from '@/views';

const DetailedCreateScientificArticlePage: NextPageWithScientificArticle = ({
  user,
  scientificArticle,
}) => {
  if (!user) {
    return (
      <Div>
        You are not authorized to view this page. Please{' '}
        <Link href="/auth">login</Link>.
      </Div>
    );
  }

  return (
    <DetailedScientificArticleView scientificArticle={scientificArticle} />
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const sessionCookie = cookies.session || '';
  const id = ctx.params?.id;
  let user = null;
  let scientificArticle = null;

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );
    user = {
      uid: decodedClaims.uid,
      email: decodedClaims.email || null,
    };
    scientificArticle = await prisma.scientificArticle.findUnique({
      where: { id: id as string },
      include: {
        authors: true,
        references: true,
        categories: true,
      },
    });

    if (!scientificArticle) {
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
      scientificArticle: JSON.parse(JSON.stringify(scientificArticle)),
    },
  };
};

export default DetailedCreateScientificArticlePage;
