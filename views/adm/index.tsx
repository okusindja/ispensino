import { Layout } from '@/components';
import { Box } from '@/elements';
import { Div } from '@stylin.js/elements';
import { useRouter } from 'next/router';
import React from 'react';

const AdminDashboard = () => {
  const router = useRouter();
  return (
    <Layout>
      <Box variant="container">
        <Div gridColumn="1/-1" width="100%">
          <button onClick={() => router.push('/adm/monographs')}>
            Monografias
          </button>
          <button onClick={() => router.push('/adm/monographs/create')}>
            Criar Monografia
          </button>
        </Div>
      </Box>
    </Layout>
  );
};

export default AdminDashboard;
