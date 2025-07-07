import { User } from '@prisma/client';
import { FC } from 'react';
import useSWR from 'swr';

import { Layout } from '@/components';
import { fetcherWithCredentials } from '@/constants/swr';

const Content: FC = () => {
  const { data, isLoading, error } = useSWR<User>(
    `/api/users/me`,
    fetcherWithCredentials
  );

  const user = data;

  return (
    <Layout>
      <div>
        <h1>Content Page</h1>
        {isLoading ? <p>Loading...</p> : <p>Welcome, {user?.name}!</p>}
        {error && <p>Error loading user data: {error.message}</p>}
      </div>
    </Layout>
  );
};

export default Content;
