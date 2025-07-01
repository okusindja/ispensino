import { Div } from '@stylin.js/elements';

import { Layout } from '@/components';
import { Box } from '@/elements';

const AboutUsView = () => {
  return (
    <Layout>
      <Box variant="container">
        <Div gridColumn="1/-1" width="100%" pb="3XL">
          <h1>Sobre nós</h1>
        </Div>
      </Box>
    </Layout>
  );
};

export default AboutUsView;
