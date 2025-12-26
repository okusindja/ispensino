import { GetServerSideProps } from 'next';
import nookies from 'nookies';
import { Div } from '@stylin.js/elements';

import { adminAuth, prisma } from '@/lib';
import EditCourseView from '@/views/teacher/courses/details/edit';
import { Course, User } from '@prisma/client';

interface EditCoursePageProps {
  course: Course;
  user: User;
}

const EditCoursePage = ({ course, user }: EditCoursePageProps) => {
  if (!user) {
    return (
      <Div>
        Não está autorizado a ver esta página. Por favor{' '}
        <a href="/auth">inicie sessão</a>.
      </Div>
    );
  }

  return <EditCourseView courseId={course.id} initialCourse={course} />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { slug } = ctx.params as { slug: string };
  const cookies = nookies.get(ctx);
  const sessionCookie = cookies.session || '';
  let user = null;
  let course = null;

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );
    user = {
      id: decodedClaims.uid,
      uid: decodedClaims.uid,
      email: decodedClaims.email || null,
      role: decodedClaims.role || 'TEACHER',
    };

    // Fetch course with details
    course = await prisma.course.findUnique({
      where: { slug: slug },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        categories: true,
        lessons: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            order: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true,
          },
        },
      },
    });

    if (!course) {
      return {
        notFound: true,
      };
    }

    // Check if user owns the course or is admin
    if (course.teacherId !== user.id && user.role !== 'ADMIN') {
      return {
        redirect: {
          destination: '/teacher/courses',
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.error('Session verification error:', error);
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
      course: JSON.parse(JSON.stringify(course)),
    },
  };
};

export default EditCoursePage;
