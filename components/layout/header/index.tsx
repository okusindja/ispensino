import { User } from '@prisma/client';
import { Div, Header as StylinHeader } from '@stylin.js/elements';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';
import useSWR from 'swr';

import { ArrowLeftSVG, FolderSVG, LogoSVG } from '@/components/svg';
import { Routes, RoutesEnum } from '@/constants';
import { fetcherWithCredentials } from '@/constants/swr';
import { Box, Button } from '@/elements';

const Header: FC<{ hasGoBack?: boolean }> = ({ hasGoBack = false }) => {
  const router = useRouter();
  const path = router.pathname;
  const isCoursesPage =
    path.includes('/content/courses/') || path.includes('/teacher/courses/');
  const { data, isLoading } = useSWR<User>(
    '/api/users/me',
    fetcherWithCredentials
  );
  const isTeacher = data?.role === 'TEACHER';

  if (!data && !isLoading) return <>Erro</>;

  if (isLoading) return <>Loading</>;

  return (
    <>
      <StylinHeader
        top="0"
        zIndex="10"
        width="100%"
        position="fixed"
        boxShadow="1px 5px 10px rgba(0, 0, 0, 0.06)"
        backgroundColor={!isCoursesPage ? 'surface' : 'primary'}
      >
        <Box variant="container">
          <Div
            width="100%"
            display="flex"
            gridColumn="1/-1"
            alignItems="center"
            justifyContent="space-between"
          >
            {!hasGoBack ? (
              <Link href={Routes[RoutesEnum.Home]}>
                <LogoSVG width="100%" maxWidth="2.5rem" maxHeight="2.5rem" />
              </Link>
            ) : (
              <Button
                isIcon
                size="medium"
                variant="neutral"
                onClick={() => router.back()}
                color={!isCoursesPage ? 'text' : 'textInverted'}
              >
                <ArrowLeftSVG width="100%" maxWidth="3rem" maxHeight="3rem" />
              </Button>
            )}
            {isTeacher && (
              <Button
                isIcon
                color={!isCoursesPage ? 'text' : 'textInverted'}
                size="medium"
                variant="neutral"
                onClick={() => router.push('/teacher')}
              >
                <FolderSVG width="100%" maxWidth="1.5rem" maxHeight="1.5rem" />
              </Button>
            )}
          </Div>
        </Box>
      </StylinHeader>
    </>
  );
};

export default Header;
