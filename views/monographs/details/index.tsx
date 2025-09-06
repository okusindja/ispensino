import { useRouter } from 'next/router';
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
  const router = useRouter();

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
            <Typography variant="fancy" size="large" mb="XL" color="text">
              {monograph.title}
            </Typography>

            <Div mb="XL" display="grid" gridTemplateColumns="repeat(2, 1fr)">
              <Typography
                p="M"
                size="small"
                variant="body"
                borderColor="text"
                border="1px solid"
                color="textSecondary"
              >
                Autor
              </Typography>
              <Typography
                p="M"
                size="medium"
                variant="body"
                borderColor="text"
                border="1px solid"
              >
                {monograph.author}
              </Typography>
              <Typography
                p="M"
                size="small"
                variant="body"
                border="1px solid"
                borderColor="text"
                color="textSecondary"
              >
                Orientador
              </Typography>
              <Typography
                p="M"
                variant="body"
                size="medium"
                border="1px solid"
                borderColor="text"
              >
                {monograph.advisor}
              </Typography>

              <Typography
                p="M"
                size="small"
                variant="body"
                border="1px solid"
                borderColor="text"
                color="textSecondary"
              >
                Curso
              </Typography>
              <Typography
                p="M"
                size="medium"
                variant="body"
                border="1px solid"
                borderColor="text"
              >
                {formatCourseName(monograph.course)}
              </Typography>

              <Typography
                p="M"
                size="small"
                variant="body"
                border="1px solid"
                borderColor="text"
                color="textSecondary"
              >
                Publicado em
              </Typography>
              <Typography
                p="M"
                size="medium"
                variant="body"
                border="1px solid"
                borderColor="text"
              >
                {formatDate(monograph.publishedAt)}
              </Typography>
            </Div>

            {monograph.tags.length > 0 && (
              <>
                <Typography
                  my="L"
                  size="large"
                  variant="fancy"
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

            <Div my="2XL">
              <Link
                target="_blank"
                href={monograph.url}
                rel="noopener noreferrer"
              >
                <Div
                  p="L"
                  gap="2XL"
                  display="flex"
                  borderRadius="S"
                  alignItems="center"
                  border="1px dashed"
                >
                  <PDFSVG maxWidth="6rem" maxHeight="6rem" width="100%" />
                  Acessar Documento
                </Div>
              </Link>
            </Div>

            <Div
              mt="L"
              pt="L"
              gap="XL"
              display="grid"
              borderTop="1px solid"
              borderColor="border"
            >
              <Div display="flex" justifyContent="space-between">
                <Typography size="small" variant="body" color="textSecondary">
                  Criado em
                </Typography>
                <Typography variant="body" size="medium" mb="M">
                  {formatDate(monograph.createdAt)}
                </Typography>
              </Div>

              <Div display="flex" justifyContent="space-between">
                <Typography size="small" variant="body" color="textSecondary">
                  Última atualização
                </Typography>
                <Typography variant="body" size="medium">
                  {formatDate(monograph.updatedAt)}
                </Typography>
              </Div>
            </Div>
          </Div>

          <Div borderTop="1px solid" borderColor="border" pt="XL">
            <Typography variant="body" size="medium" mb="XL">
              Monografias Relacionadas
            </Typography>
            <Typography variant="body" size="small" color="textSecondary">
              Funcionalidade de recomendações em desenvolvimento.
            </Typography>
          </Div>
        </Div>
      </Box>
    </Layout>
  );
};

export default MonographDetailView;
