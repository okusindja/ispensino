import { Div } from '@stylin.js/elements';
import { FC } from 'react';

import { Layout } from '@/components';
import { Box } from '@/elements';

import { NewsCollection } from './news.types';

const News: FC<NewsCollection> = ({ news }) => {
  return (
    <Layout>
      <Box container="container">
        <Div gridColumn="1/-1" width="100%">
          <Div
            px={['M', 'XL', 'XL', 'XL']}
            gap="XL"
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
          >
            {news &&
              news.map((n) => (
                <Div key={n.slug} width="100%">
                  {n.title.pt}
                </Div>
              ))}
          </Div>
        </Div>
      </Box>
    </Layout>
  );
};

export default News;
