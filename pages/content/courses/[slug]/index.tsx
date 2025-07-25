import { Div } from '@stylin.js/elements';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import nookies from 'nookies';

import { NextPageWithCourse } from '@/interface/declaration';
import { adminAuth, prisma } from '@/lib';
import { CourseDetailsView } from '@/views';

const CourseDetailsPage: NextPageWithCourse = ({ user, course }) => {
  if (!user) {
    return (
      <Div>
        You are not authorized to view this page. Please{' '}
        <Link href="/auth">login</Link>.
      </Div>
    );
  }

  return <CourseDetailsView course={course} />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const sessionCookie = cookies.session || '';
  const slug = ctx.params?.slug;
  let user = null;
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
      include: {
        lessons: true,
        teacher: true,
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
  return { props: { user, course: JSON.parse(JSON.stringify(course)) } };
};

export default CourseDetailsPage;
