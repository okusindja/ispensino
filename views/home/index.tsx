import { Div } from '@stylin.js/elements';
import { FC } from 'react';

import { Layout } from '@/components';
import Tabs from '@/components/tabs';
import { Box } from '@/elements';
import { Typography } from '@/elements/typography';

const Home: FC = () => {
  return (
    <Layout>
      <Div mt="XL">
        <Tabs
          px="M"
          variant="secondary"
          tabList={['Notícias recentes', 'Tudo']}
          tabContent={[
            <Div key="tab1">
              <Typography
                as="h3"
                variant="large"
                color="primary"
                size="small"
                mb="XL"
              >
                Notícias recentes
              </Typography>
            </Div>,
            <Box key="tab2" variant="container">
              <Div gridColumn="1/-1" width="100%" pb="XL">
                Informacoes
              </Div>
            </Box>,
          ]}
        />
      </Div>
    </Layout>
  );
};

export default Home;
