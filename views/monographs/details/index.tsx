// src/features/monograph/views/MonographDetailView.tsx (updated)
import { useRouter } from 'next/router';
import { Monograph } from '@prisma/client';

import { Box, Button } from '@/elements';
import { Typography } from '@/elements/typography';
import { AcademicalCourses } from '@prisma/client';
import Link from 'next/link';
import { Layout } from '@/components';
import { Div } from '@stylin.js/elements';

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
      <Box variant="container">
        <Div width="100%" gridColumn="1/-1">
          <Box mb="XL">
            <Typography variant="title" size="medium" mb="M" color="text">
              {monograph.title}
            </Typography>

            <Div mb="L">
              <Div display="flex" justifyContent="space-between">
                <Typography
                  variant="body"
                  size="small"
                  color="textSecondary"
                  mb="XS"
                >
                  Autor
                </Typography>
                <Typography variant="body" size="medium">
                  {monograph.author}
                </Typography>
              </Div>

              <Box>
                <Typography
                  variant="body"
                  size="small"
                  color="textSecondary"
                  mb="XS"
                >
                  Orientador
                </Typography>
                <Typography variant="body" size="medium">
                  {monograph.advisor}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body"
                  size="small"
                  color="textSecondary"
                  mb="XS"
                >
                  Curso
                </Typography>
                <Typography variant="body" size="medium">
                  {formatCourseName(monograph.course)}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body"
                  size="small"
                  color="textSecondary"
                  mb="XS"
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
                  variant="body"
                  size="small"
                  color="textSecondary"
                  mb="XS"
                >
                  Tags
                </Typography>
                <Box display="flex" flexWrap="wrap" gap="XS" mb="L">
                  {monograph.tags.map((tag, index) => (
                    <Box
                      key={index}
                      px="S"
                      py="XXS"
                      bg="primary"
                      fontSize="S"
                      color="white"
                      borderRadius="S"
                    >
                      {tag}
                    </Box>
                  ))}
                </Box>
              </>
            )}

            <Link
              href={monograph.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Acessar Documento
            </Link>

            <Box mt="L" pt="L" borderTop="1px solid" borderColor="border">
              <Typography
                variant="body"
                size="small"
                color="textSecondary"
                mb="XS"
              >
                Criado em
              </Typography>
              <Typography variant="body" size="medium" mb="M">
                {formatDate(monograph.createdAt)}
              </Typography>

              <Typography
                variant="body"
                size="small"
                color="textSecondary"
                mb="XS"
              >
                Última atualização
              </Typography>
              <Typography variant="body" size="medium">
                {formatDate(monograph.updatedAt)}
              </Typography>
            </Box>
          </Box>

          <Box borderTop="1px solid" borderColor="border" pt="L">
            <Typography variant="body" size="medium" mb="M">
              Monografias Relacionadas
            </Typography>
            <Typography variant="body" size="small" color="textSecondary">
              Funcionalidade de recomendações em desenvolvimento.
            </Typography>
          </Box>
        </Div>
      </Box>
    </Layout>
  );
};

export default MonographDetailView;
