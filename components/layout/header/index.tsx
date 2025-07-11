import { User } from '@prisma/client';
import { Div, Header as StylinHeader } from '@stylin.js/elements';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';
import useSWR from 'swr';

import { ArrowLeftSVG, FolderSVG, LogoSVG } from '@/components/svg';
import { Routes, RoutesEnum } from '@/constants';
import { fetcher } from '@/constants/swr';
import { Box, Button } from '@/elements';

const Header: FC<{ hasGoBack?: boolean }> = ({ hasGoBack = false }) => {
  const router = useRouter();
  const { data, isLoading } = useSWR<User>('/api/users/me', fetcher);
  console.log('Header data:', data);
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
        backgroundColor="surface"
        boxShadow="1px 5px 10px rgba(0, 0, 0, 0.06)"
      >
        <Box variant="container">
          <Div
            gridColumn="1/-1"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            {!hasGoBack ? (
              <Link href={Routes[RoutesEnum.Home]}>
                <LogoSVG width="100%" maxWidth="2.5rem" maxHeight="2.5rem" />
              </Link>
            ) : (
              <Button
                variant="neutral"
                size="medium"
                isIcon
                onClick={() => router.back()}
              >
                <ArrowLeftSVG width="100%" maxWidth="3rem" maxHeight="3rem" />
              </Button>
            )}
            {isTeacher && (
              <Button
                variant="neutral"
                size="medium"
                isIcon
                color="text"
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
