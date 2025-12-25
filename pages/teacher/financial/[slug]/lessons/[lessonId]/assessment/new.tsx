import { Div } from '@stylin.js/elements';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import nookies from 'nookies';

import { NextPageWithLesson } from '@/interface/declaration';
import { adminAuth, prisma } from '@/lib';
import CreateAssessment from '@/views/teacher/courses/details/lesson/assessment/create';

const CreateLessonPage: NextPageWithLesson = ({ user, teacher, lessonId }) => {
  if (!user) {
    return (
      <Div>
        You are not authorized to view this page. Please{' '}
        <Link href="/auth">login</Link>.
      </Div>
    );
  }

  if (teacher.role !== 'TEACHER') {
    return (
      <Div>
        Apenas professopres podem acessar esta página. Se você é um professor,
        por favor,
        <br />
        <Link href="/auth">login</Link> again.
      </Div>
    );
  }

  return <CreateAssessment lessonId={lessonId} />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const { query } = ctx;
  const lessonId = query.lessonId as string;
  if (!lessonId) {
    return {
      notFound: true,
    };
  }
  const sessionCookie = cookies.session || '';
  let user = null;
  let teacher = null;
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );
    user = {
      uid: decodedClaims.uid,
      email: decodedClaims.email || null,
    };
    teacher = await prisma.user.findUnique({
      where: { firebaseId: user.uid, role: 'TEACHER' },
    });
    if (!teacher) {
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
      lessonId,
      teacher: JSON.parse(JSON.stringify(teacher)),
    },
  };
};

export default CreateLessonPage;
