import { Div } from '@stylin.js/elements';
import { FC } from 'react';

import { Layout } from '@/components';
import {
  BookVariantSVG,
  GraduateHatSVG,
  SpinnerSVG,
  TestSVG,
} from '@/components/svg';
import { Box } from '@/elements';
import { Typography } from '@/elements/typography';

import ContentItem from './components/content-item';
import { useAuthenticatedSWR } from '@/lib/swr';
import { Course, Monograph } from '@prisma/client';

const Content: FC = () => {
  const { data: courses, isLoading: coursesLoading } =
    useAuthenticatedSWR<Course[]>('/api/courses');
  const { data: monographs, isLoading: monographsLoading } =
    useAuthenticatedSWR<Monograph[]>('/api/monographs');

  return (
    <Layout>
      <Box variant="container">
        <Div mt="L" width="100%" display="grid" gap="L" gridColumn="1/-1">
          {coursesLoading ? (
            <SpinnerSVG maxWidth="2rem" maxHeight="2rem" width="100%" />
          ) : (
            courses && (
              <ContentItem
                title="Cursos"
                to="content/courses"
                Icon={BookVariantSVG}
                description={
                  courses?.length === 1
                    ? courses?.length + ' Curso'
                    : courses?.length + ' Cursos'
                }
                footerLeft={
                  <Typography variant="fancy" size="small" color="text">
                    Content Author
                  </Typography>
                }
                footerRight={
                  <Typography variant="fancy" size="small" color="text">
                    {courses?.length === 1
                      ? courses?.length + ' Curso'
                      : courses?.length + ' Cursos'}
                  </Typography>
                }
              />
            )
          )}
          {monographsLoading ? (
            <SpinnerSVG maxWidth="2rem" maxHeight="2rem" width="100%" />
          ) : (
            monographs && (
              <ContentItem
                title="Monografias"
                to="content/monographs"
                Icon={GraduateHatSVG}
                description={
                  monographs?.length === 1
                    ? monographs?.length + ' Monografia'
                    : monographs?.length + ' Monografias'
                }
                footerLeft={
                  <Typography variant="fancy" size="small" color="text">
                    Content Author
                  </Typography>
                }
                footerRight={
                  <Typography variant="fancy" size="small" color="text">
                    {monographs?.length === 1
                      ? monographs?.length + ' Monografia'
                      : monographs?.length + ' Monografias'}
                  </Typography>
                }
              />
            )
          )}
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
