import { ScientificArticle, ScientificArticleAuthor } from '@prisma/client';

import { Box } from '@/elements';
import { Typography } from '@/elements/typography';
import Link from 'next/link';
import { Layout } from '@/components';
import { Div } from '@stylin.js/elements';
import { FC } from 'react';
import { PDFSVG } from '@/components/svg';

interface ScientificArticleDetailViewProps {
  scientificArticle: ScientificArticle & { authors: ScientificArticleAuthor[] };
}

const ScientificArticleDetailView: FC<ScientificArticleDetailViewProps> = ({
  scientificArticle,
}) => {
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
              {scientificArticle.title}
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
                  {scientificArticle.authors
                    .map((author) => author.name)
                    .join(', ')}
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
                  Revista/Journal
                </Typography>
                <Typography variant="body" size="medium">
                  {scientificArticle.journal}
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
                  {formatDate(scientificArticle.publishedAt)}
                </Typography>
              </Div>
            </Div>

            {scientificArticle.keywords.length > 0 && (
              <>
                <Typography
                  mb="L"
                  size="small"
                  variant="body"
                  color="textSecondary"
                >
                  Tags
                </Typography>
                <Div display="flex" flexWrap="wrap" gap="M" mb="L">
                  {scientificArticle.keywords.map((keyword, index) => (
                    <Div
                      p="M"
                      px="XL"
                      key={index}
                      bg="primary"
                      fontSize="S"
                      borderRadius="S"
                      color="textInverted"
                    >
                      {keyword}
                    </Div>
                  ))}
                </Div>
              </>
            )}

            <Link
              target="_blank"
              href={scientificArticle.url}
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
                  {formatDate(scientificArticle.createdAt)}
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
                  {formatDate(scientificArticle.updatedAt)}
                </Typography>
              </Div>
            </Div>
          </Div>

          <Div pt="XL">
            <Typography variant="body" size="medium" mb="XL">
              Artigos Relacionados
            </Typography>
          </Div>
        </Div>
      </Box>
    </Layout>
  );
};

export default ScientificArticleDetailView;
