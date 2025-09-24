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
import { Course, Monograph, ScientificArticle } from '@prisma/client';

const Content: FC = () => {
  const { data: courses, isLoading: coursesLoading } =
    useAuthenticatedSWR<Course[]>('/api/courses');
  const { data: monographs, isLoading: monographsLoading } =
    useAuthenticatedSWR<Monograph[]>('/api/monographs');
  const { data: articles, isLoading: articlesLoading } = useAuthenticatedSWR<
    ScientificArticle[]
  >('/api/scientific-articles');

  if (coursesLoading || monographsLoading || articlesLoading) {
    return (
      <Layout>
        <Div
          height="80vh"
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          color="text"
        >
          <SpinnerSVG maxWidth="6rem" maxHeight="6rem" width="100%" />
        </Div>
      </Layout>
    );
  }

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
          {monographs && (
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
          )}
          {articles && (
            <ContentItem
              title="Artigos científicos"
              to="content/scientific-articles"
              Icon={TestSVG}
              description={
                articles?.length === 1
                  ? articles?.length + ' Artigo Científico'
                  : articles?.length + ' Artigos Científicos'
              }
              footerLeft={
                <Typography variant="fancy" size="small" color="text">
                  Content Author
                </Typography>
              }
              footerRight={
                <Typography variant="fancy" size="small" color="text">
                  {articles?.length === 1
                    ? articles?.length + ' Artigo Científico'
                    : articles?.length + ' Artigos Científicos'}
                </Typography>
              }
            />
          )}
        </Div>
      </Box>
    </Layout>
  );
};

export default Content;
