import { Div } from '@stylin.js/elements';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import nookies from 'nookies';

import { NextPageWithCourses } from '@/interface/declaration';
import { adminAuth, prisma } from '@/lib';
import { CoursesView } from '@/views';

const CoursesPage: NextPageWithCourses = ({ user, courses }) => {
  if (!user) {
    return (
      <Div>
        You are not authorized to view this page. Please{' '}
        <Link href="/auth">login</Link>.
      </Div>
    );
  }

  return <CoursesView courses={courses} />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const sessionCookie = cookies.session || '';
  let user = null;
  let courses = null;
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );
    user = {
      uid: decodedClaims.uid,
      email: decodedClaims.email || null,
    };
    courses = await prisma.course.findMany({
      // where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      include: {
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
  return { props: { user, courses: JSON.parse(JSON.stringify(courses)) } };
};

export default CoursesPage;
