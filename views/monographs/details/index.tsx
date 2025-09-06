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

            <Div mb="L">
              <Div display="flex" justifyContent="space-between">
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

              <Box>
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
              </Box>

              <Box>
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
              </Box>

              <Box>
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
              </Box>
            </Div>

            {monograph.tags.length > 0 && (
              <>
                <Typography
                  mb="XS"
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
              Acessar Documento
            </Link>

            <Box mt="L" pt="L" borderTop="1px solid" borderColor="border">
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
            </Box>
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
