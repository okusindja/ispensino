import { User } from '@prisma/client';
import { Div } from '@stylin.js/elements';
import Link from 'next/link';
import { FC } from 'react';

import { Layout } from '@/components';
import { Box } from '@/elements';
import { Typography } from '@/elements/typography';

const TeacherHome: FC<{ user: User }> = ({ user }) => {
  return (
    <Layout>
      <Box variant="container">
        <Div width="100%" gridColumn="1/-1">
          <Div color="text">
            <Typography variant="fancy" size="large" as="h1">
              Bem-vindo, {user.name}!
            </Typography>
            <Typography variant="body" size="medium">
              Você está logado como professor.
            </Typography>
            <Typography variant="body" size="medium">
              Você pode gerenciar seus cursos e interagir com os alunos.
            </Typography>
            <Link href="/teacher/courses">Ir para meus cursos</Link>
          </Div>
        </Div>
      </Box>
    </Layout>
  );
};

export default TeacherHome;
