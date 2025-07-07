import { Div } from '@stylin.js/elements';
import { FC } from 'react';

import { Layout, TextField } from '@/components';
import AddPostButton from '@/components/add-post-button';
import { SearchSVG } from '@/components/svg';
import { Box } from '@/elements';

import PostItem from './components/post-item';

const Home: FC = () => {
  return (
    <Layout>
      <Box variant="container">
        <Div width="100%" position="relative" height="100%" gridColumn="1/-1">
          <TextField
            py="M"
            Prefix={
              <SearchSVG maxHeight="1.5rem" maxWidth="1.5rem" width="100%" />
            }
            placeholder="Procure um nome ou username"
          />
          <Div display="grid" mt="L" gap="L">
            <PostItem />
            <PostItem />
            <PostItem />
          </Div>
        </Div>
        <AddPostButton />
      </Box>
    </Layout>
  );
};

export default Home;
