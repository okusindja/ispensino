import { Box } from '@/elements';
import { Typography } from '@/elements/typography';
import { Layout, TextField } from '@/components';
import { useState } from 'react';
import { useScientificArticles } from './scientific-articles.hook';
import ItemCard from '@/components/item-card';
import { Div } from '@stylin.js/elements';
import monographs from '../monographs';

const ScientificArticlesView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { articles, loading, error } = useScientificArticles(searchTerm);

  return (
    <Layout hasGoBack>
      <Box variant="container">
        <Div gridColumn="1/-1" width="100%" mb="L">
          {error && (
            <Box color="error" mb="M" textAlign="center">
              {error}
            </Box>
          )}

          {loading ? (
            <Box textAlign="center" p="XL">
              <Typography variant="body" size="medium">
                Carregando monografias...
              </Typography>
            </Box>
          ) : monographs.length === 0 ? (
            <Box textAlign="center" p="XL">
              <Typography variant="body" size="medium">
                Nenhuma monografia encontrada.
              </Typography>
            </Box>
          ) : (
            <Box variant="container">
              <Div gridColumn="1/-1" width="100%" gap="M">
                <Div>
                  <TextField
                    type="text"
                    label="Pesquisar"
                    placeholder="Pesquisar por título, autor ou palavra-chave..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Div>
              </Div>
              {articles.map((article) => (
                <ItemCard
                  key={article.id}
                  title={article.title}
                  introduction={article.journal}
                  to={`/content/scientific-articles/${article.id}`}
                  description={article.authors
                    .map((author) => author.name)
                    .join(', ')}
                />
              ))}
            </Box>
          )}
        </Div>
      </Box>
    </Layout>
  );
};

export default ScientificArticlesView;
