import { User } from '@prisma/client';
import { Div } from '@stylin.js/elements';
import Link from 'next/link';
import { FC } from 'react';

import { Layout } from '@/components';
import { Box } from '@/elements';
import { Typography } from '@/elements/typography';
import ItemCard from '@/components/item-card';

const TeacherHome: FC<{ user: User }> = ({ user }) => {
  return (
    <Layout>
      <Box variant="container">
        <Div width="100%" gridColumn="1/-1" mt="2XL" mb="XL">
          <Div color="text">
            <Typography variant="fancy" size="large">
              Bem-vindo, {user.name}!
            </Typography>
            <Typography variant="body" size="medium">
              Você pode gerenciar seus cursos e interagir com os alunos.
            </Typography>
          </Div>
        </Div>
        <ItemCard
          title="Criar Curso"
          to="/teacher/courses/create"
          thumbnail="/icons/icon-512x512.png"
        />
        <ItemCard
          title="Alunos"
          to="/teacher/students"
          thumbnail="/icons/icon-512x512.png"
        />
        <ItemCard
          title="Estatísticas"
          to="/teacher/analytics"
          thumbnail="/icons/icon-512x512.png"
        />
        <ItemCard
          title="Financeiro"
          to="/teacher/financial"
          thumbnail="/icons/icon-512x512.png"
        />
      </Box>
    </Layout>
  );
};

export default TeacherHome;
