import { Div } from '@stylin.js/elements';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import nookies from 'nookies';

import { NextPageWithUser } from '@/interface/declaration';
import { adminAuth, prisma } from '@/lib';
import CoursesView from '@/views/teacher/courses';

const TeacherCoursesPage: NextPageWithUser = ({ user, loggedUser }) => {
  if (!user) {
    return (
      <Div>
        You are not authorized to view this page. Please{' '}
        <Link href="/auth">login</Link>.
      </Div>
    );
  }

  if (loggedUser.role !== 'TEACHER') {
    return (
      <Div>
        Apenas professopres podem acessar esta página. Se você é um professor,
        por favor,
        <br />
        <Link href="/auth">login</Link> again.
      </Div>
    );
  }

  return <CoursesView user={loggedUser} />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
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
      include: {
        teachingCourses: true,
      },
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
  return { props: { user, loggedUser: JSON.parse(JSON.stringify(teacher)) } };
};

export default TeacherCoursesPage;
