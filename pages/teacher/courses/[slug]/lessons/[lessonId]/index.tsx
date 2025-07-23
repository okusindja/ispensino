import { Div } from '@stylin.js/elements';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import nookies from 'nookies';

import { NextPageWithLesson } from '@/interface/declaration';
import { adminAuth, prisma } from '@/lib';
import LessonDetailsView from '@/views/lessons/details';

const TeacherLessonDetailPage: NextPageWithLesson = ({
  user,
  teacher,
  lesson,
}) => {
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

  return <LessonDetailsView lesson={lesson} />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const { query } = ctx;
  const lessonId = query.lessonId as string;
  const sessionCookie = cookies.session || '';
  let user = null;
  let lesson = null;
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );
    user = {
      uid: decodedClaims.uid,
      email: decodedClaims.email || null,
    };
    lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        assessment: true,
        course: {
          select: {
            slug: true,
          },
        },
      },
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
      lesson: JSON.parse(JSON.stringify(lesson)),
    },
  };
};

export default TeacherLessonDetailPage;
