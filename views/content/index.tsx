import { Div } from '@stylin.js/elements';
import { FC } from 'react';

import { Layout } from '@/components';
import { BookVariantSVG, GraduateHatSVG, TestSVG } from '@/components/svg';
import { Box } from '@/elements';
import { Typography } from '@/elements/typography';

import ContentItem from './components/content-item';

const Content: FC = () => {
  return (
    <Layout>
      <Box variant="container">
        <Div mt="L" width="100%" display="grid" gap="L" gridColumn="1/-1">
          <ContentItem
            title="Cursos"
            to="content/courses"
            Icon={BookVariantSVG}
            description="2 Cursos"
            footerLeft={
              <Typography variant="fancy" size="small" color="text">
                Content Author
              </Typography>
            }
            footerRight={
              <Typography variant="fancy" size="small" color="text">
                2 Cursos
              </Typography>
            }
          />
          <ContentItem
            title="Monografias"
            to="content/courses"
            Icon={GraduateHatSVG}
            description="1 Monografia"
            footerLeft={
              <Typography variant="fancy" size="small" color="text">
                Content Author
              </Typography>
            }
            footerRight={
              <Typography variant="fancy" size="small" color="text">
                1 Monografia
              </Typography>
            }
          />
          <ContentItem
            Icon={TestSVG}
            to="content/courses"
            description="5 Artigos"
            title="Artigos científicos"
            footerLeft={
              <Typography variant="fancy" size="small" color="text">
                Content Author
              </Typography>
            }
            footerRight={
              <Typography variant="fancy" size="small" color="text">
                5 Artigos
              </Typography>
            }
          />
        </Div>
      </Box>
    </Layout>
  );
};

export default Content;
