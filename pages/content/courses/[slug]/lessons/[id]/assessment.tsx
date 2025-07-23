import { Div } from '@stylin.js/elements';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import nookies from 'nookies';

import { NextPageWithLesson } from '@/interface/declaration';
import { adminAuth, prisma } from '@/lib';

const AssessmentView = dynamic(() => import('@/views/assessment'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const LessonDetailPage: NextPageWithLesson = ({ user, lessonId, courseId }) => {
  if (!user) {
    return (
      <Div>
        You are not authorized to view this page. Please{' '}
        <Link href="/auth">login</Link>.
      </Div>
    );
  }

  return <AssessmentView lessonId={lessonId} courseId={courseId} />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const { slug, id } = ctx.query;
  const sessionCookie = cookies.session || '';

  let user = null;
  let course = null;

  try {
    // Verifica a sessão com Firebase Admin SDK
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );

    user = {
      uid: decodedClaims.uid,
      email: decodedClaims.email || null,
    };

    course = await prisma.course.findUnique({
      where: { slug: slug as string },
      select: {
        id: true,
      },
    });

    if (!course) {
      return {
        notFound: true,
      };
    }
  } catch (error) {
    console.error(
      'Erro na verificação de sessão ou carregamento da lição:',
      error
    );
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
      lessonId: id,
      courseId: JSON.parse(JSON.stringify(course)).id,
    },
  };
};

export default LessonDetailPage;
