import { ScientificArticle, ScientificArticleAuthor } from '@prisma/client';

import { Box } from '@/elements';
import { Typography } from '@/elements/typography';
import Link from 'next/link';
import { Layout } from '@/components';
import { Div } from '@stylin.js/elements';
import { FC } from 'react';

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
                  {scientificArticle.authors
                    .map((author) => author.name)
                    .join(', ')}
                </Typography>
              </Div>

              <Box>
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
                  {formatDate(scientificArticle.publishedAt)}
                </Typography>
              </Box>
            </Div>

            {scientificArticle.keywords.length > 0 && (
              <>
                <Typography
                  mb="XS"
                  size="small"
                  variant="body"
                  color="textSecondary"
                >
                  Keywords
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
                {formatDate(scientificArticle.createdAt)}
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
                {formatDate(scientificArticle.updatedAt)}
              </Typography>
            </Box>
          </Div>

          <Div borderTop="1px solid" borderColor="border" pt="XL">
            <Typography variant="body" size="medium" mb="XL">
              Artigos Relacionados
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

export default ScientificArticleDetailView;
