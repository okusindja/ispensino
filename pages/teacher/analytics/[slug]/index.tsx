import { Div } from '@stylin.js/elements';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import nookies from 'nookies';

import { NextPageWithCourseAndTeacher } from '@/interface/declaration';
import { adminAuth, prisma } from '@/lib';
import CourseDetails from '@/views/teacher/courses/details';

const TeacherCourseDetailPage: NextPageWithCourseAndTeacher = ({
  user,
  teacher,
  course,
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

  return <CourseDetails course={course} />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const { query } = ctx;
  const courseSlug = query.slug as string;
  const sessionCookie = cookies.session || '';
  let user = null;
  let teacher = null;
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
    course = await prisma.course.findUnique({
      where: { slug: courseSlug, teacherId: teacher.id },
      include: {
        categories: true,
        enrollments: true,
        lessons: true,
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
      course: JSON.parse(JSON.stringify(course)),
      teacher: JSON.parse(JSON.stringify(teacher)),
    },
  };
};

export default TeacherCourseDetailPage;
