import { Div } from '@stylin.js/elements';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import nookies from 'nookies';

// import LessonDetailsView from '@/views/lessons/details';
import { NextPageWithLesson } from '@/interface/declaration';
import { adminAuth, prisma } from '@/lib';

const LessonDetailsView = dynamic(() => import('@/views/lessons/details'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const LessonDetailPage: NextPageWithLesson = ({ user, lesson }) => {
  if (!user) {
    return (
      <Div>
        You are not authorized to view this page. Please{' '}
        <Link href="/auth">login</Link>.
      </Div>
    );
  }

  return <LessonDetailsView lesson={lesson} />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const { slug, id } = ctx.query;
  const sessionCookie = cookies.session || '';

  let user = null;
  let lesson = null;
  let course = null;

  try {
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
        teacherId: true,
        enrollments: {
          where: { user: { firebaseId: decodedClaims.uid } },
          select: { id: true },
        },
      },
    });

    const teacher = await prisma.user.findUnique({
      where: { firebaseId: course?.teacherId },
    });

    if (!course) {
      return { notFound: true };
    }

    const isTeacher = teacher?.firebaseId === decodedClaims.uid;
    const isEnrolled = course.enrollments.length > 0;

    console.log('User:', user);
    console.log('Is Teacher:', isTeacher);
    console.log('Is Enrolled:', isEnrolled);

    // if (!isTeacher || !isEnrolled) {
    //   return {
    //     redirect: {
    //       destination: '/auth',
    //       permanent: false,
    //     },
    //   };
    // }

    const foundLesson = await prisma.lesson.findUnique({
      where: {
        id: id as string,
        courseId: course.id,
      },
      include: {
        materials: true,
        assessment: {
          include: {
            questions: true,
            userAssessments: {
              take: 1,
              orderBy: { startedAt: 'desc' },
              where: { user: { firebaseId: decodedClaims.uid } },
              select: { isPassed: true, score: true },
            },
          },
        },
        course: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                course: true,
                assessment: {
                  include: {
                    userAssessments: {
                      take: 1,
                      orderBy: { startedAt: 'desc' },
                      where: { user: { firebaseId: decodedClaims.uid } },
                      select: { isPassed: true, score: true },
                    },
                  },
                },
              },
            },
            teacher: true,
          },
        },
      },
    });

    if (!foundLesson) {
      return { notFound: true };
    }

    const isPassed =
      foundLesson.assessment?.userAssessments[0]?.isPassed || false;

    lesson = {
      ...foundLesson,
      isPassed,
    };
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
      lesson: JSON.parse(JSON.stringify(lesson)),
      course: JSON.parse(JSON.stringify(lesson.course)),
    },
  };
};

export default LessonDetailPage;
