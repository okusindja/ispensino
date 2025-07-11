import { Div } from '@stylin.js/elements';
import { FC } from 'react';

import { Layout } from '@/components';
import { Box } from '@/elements';

import ContentItem from './components/content-item';

const Content: FC = () => {
  return (
    <Layout>
      <Box variant="container">
        <Div mt="L" width="100%" display="grid" gap="L" gridColumn="1/-1">
          <ContentItem to="content/courses" title="courses" />
          <ContentItem to="content/courses" title="courses" />
          <ContentItem to="content/courses" title="courses" />
        </Div>
      </Box>
    </Layout>
  );
};

export default Content;
