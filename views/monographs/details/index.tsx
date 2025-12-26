import { Monograph } from '@prisma/client';

import { Box } from '@/elements';
import { Typography } from '@/elements/typography';
import { AcademicalCourses } from '@prisma/client';
import Link from 'next/link';
import { Layout } from '@/components';
import { Div } from '@stylin.js/elements';
import { PDFSVG } from '@/components/svg';

interface MonographDetailViewProps {
  monograph: Monograph;
}

const MonographDetailView = ({ monograph }: MonographDetailViewProps) => {
  const formatCourseName = (course: AcademicalCourses) => {
    return course
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('pt-BR');
  };

  return (
    <Layout hasGoBack>
      <Box variant="container" color="text">
        <Div width="100%" gridColumn="1/-1">
          <Div mb="XL" pt="L">
            <Typography variant="fancy" size="large" mb="2XL" color="text">
              {monograph.title}
            </Typography>

            <Div
              gap="L"
              mb="XL"
              width="100%"
              display="flex"
              alignItems="center"
              flexDirection="column"
            >
              <Div
                pb="L"
                width="100%"
                display="flex"
                borderColor="outline"
                borderBottom="1px solid"
                justifyContent="space-between"
              >
                <Typography
                  mb="XS"
                  size="small"
                  variant="body"
                  color="textSecondary"
                >
                  Autor
                </Typography>
                <Typography variant="body" size="medium">
                  {monograph.author}
                </Typography>
              </Div>

              <Div
                pb="L"
                width="100%"
                display="flex"
                borderColor="outline"
                borderBottom="1px solid"
                justifyContent="space-between"
              >
                <Typography
                  mb="XS"
                  size="small"
                  variant="body"
                  color="textSecondary"
                >
                  Orientador
                </Typography>
                <Typography variant="body" size="medium">
                  {monograph.advisor}
                </Typography>
              </Div>

              <Div
                pb="L"
                width="100%"
                display="flex"
                borderColor="outline"
                borderBottom="1px solid"
                justifyContent="space-between"
              >
                <Typography
                  mb="XS"
                  size="small"
                  variant="body"
                  color="textSecondary"
                >
                  Curso
                </Typography>
                <Typography variant="body" size="medium">
                  {formatCourseName(monograph.course)}
                </Typography>
              </Div>

              <Div
                pb="L"
                width="100%"
                display="flex"
                borderColor="outline"
                borderBottom="1px solid"
                justifyContent="space-between"
              >
                <Typography
                  mb="XS"
                  size="small"
                  variant="body"
                  color="textSecondary"
                >
                  Publicado em
                </Typography>
                <Typography variant="body" size="medium">
                  {formatDate(monograph.publishedAt)}
                </Typography>
              </Div>
            </Div>

            {monograph.tags.length > 0 && (
              <>
                <Typography
                  mb="M"
                  size="small"
                  variant="body"
                  color="textSecondary"
                >
                  Tags
                </Typography>
                <Div display="flex" flexWrap="wrap" gap="M" mb="L">
                  {monograph.tags.map((tag, index) => (
                    <Div
                      p="M"
                      px="XL"
                      key={index}
                      bg="primary"
                      fontSize="S"
                      borderRadius="S"
                      color="textInverted"
                    >
                      {tag}
                    </Div>
                  ))}
                </Div>
              </>
            )}

            <Link
              target="_blank"
              href={monograph.url}
              rel="noopener noreferrer"
            >
              <Div width="100%" py="3XL" textAlign="center">
                <PDFSVG width="100%" maxWidth="6.25rem" maxHeight="6.25rem" />
                <Typography variant="fancy" size="large" color="text">
                  Acessar Documento
                </Typography>
              </Div>
            </Link>

            <Div
              gap="L"
              mb="XL"
              width="100%"
              display="flex"
              alignItems="center"
              flexDirection="column"
            >
              <Div
                pb="L"
                width="100%"
                display="flex"
                borderColor="outline"
                borderBottom="1px solid"
                justifyContent="space-between"
              >
                <Typography
                  mb="XS"
                  size="small"
                  variant="body"
                  color="textSecondary"
                >
                  Criado em
                </Typography>
                <Typography variant="body" size="medium" mb="M">
                  {formatDate(monograph.createdAt)}
                </Typography>
              </Div>

              <Div
                pb="L"
                width="100%"
                display="flex"
                borderColor="outline"
                borderBottom="1px solid"
                justifyContent="space-between"
              >
                <Typography
                  mb="XS"
                  size="small"
                  variant="body"
                  color="textSecondary"
                >
                  Última atualização
                </Typography>
                <Typography variant="body" size="medium">
                  {formatDate(monograph.updatedAt)}
                </Typography>
              </Div>
            </Div>
          </Div>

          <Div pt="2XL">
            <Typography variant="body" size="medium" mb="XL">
              Monografias Relacionadas
            </Typography>
          </Div>
        </Div>
      </Box>
    </Layout>
  );
};

export default MonographDetailView;
