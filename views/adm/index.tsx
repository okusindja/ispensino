import { Layout } from '@/components';
import ItemCard from '@/components/item-card';
import user from '@/components/svg/user';
import { Box } from '@/elements';
import { Typography } from '@/elements/typography';
import { Div } from '@stylin.js/elements';
import { useRouter } from 'next/router';
import React from 'react';

const AdminDashboard = () => {
  const router = useRouter();
  return (
    <Layout>
      <Box variant="container">
        <Div gridColumn="1/-1" width="100%" mt="2XL" mb="XL">
          <Div color="text">
            <Typography variant="fancy" size="large">
              Bem-vindo, {user.name}!
            </Typography>
            <Typography variant="body" size="medium">
              Você pode gerenciar monografias e artigos científicos.
            </Typography>
          </Div>
        </Div>
        <ItemCard
          title="Monografias"
          to="/adm/monographs"
          thumbnail="/icons/icon-512x512.png"
        />
        <ItemCard
          title="Criar Monografia"
          to="/adm/monographs/create"
          thumbnail="/icons/icon-512x512.png"
        />
        <ItemCard
          title="Artigos Científicos"
          to="/adm/scientific-articles"
          thumbnail="/icons/icon-512x512.png"
        />
        <ItemCard
          title="Criar Artigo Científico"
          to="/adm/scientific-articles/create"
          thumbnail="/icons/icon-512x512.png"
        />
      </Box>
    </Layout>
  );
};

export default AdminDashboard;
