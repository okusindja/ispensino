import { useState } from 'react';
import { Box } from '@/elements';
import { Typography } from '@/elements/typography';
import { Layout, TextField } from '@/components';
import { Div, Select } from '@stylin.js/elements';
import ItemCard from '@/components/item-card';
import { useScientificArticles } from './scientific-articles.hook';
import { SelectField } from '@/components/select-field';

const YEARS = Array.from(
  { length: new Date().getFullYear() - 2000 + 1 },
  (_, i) => `${2012 + i}`
).reverse();

const ScientificArticlesView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const { articles, loading, error } = useScientificArticles(
    searchTerm,
    selectedCategory,
    selectedYear
  );

  return (
    <Layout hasGoBack>
      <Box variant="container">
        <Div gridColumn="1/-1" width="100%" mb="L">
          {/* 🔴 ERRO */}
          {error && (
            <Box color="error" mb="M" textAlign="center">
              {error}
            </Box>
          )}

          {/* 🔄 LOADING */}
          {loading && (
            <Box textAlign="center" p="XL">
              <Typography variant="body" size="medium">
                A carregar artigos científicos…
              </Typography>
            </Box>
          )}

          {/* 🔍 FILTROS */}
          <Box my="L">
            <Div>
              <TextField
                label="Pesquisar"
                placeholder="Título, autor ou palavra-chave"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Div display="flex" gap="1rem" mt="1rem">
                <SelectField
                  flex="1"
                  width="100%"
                  label="Categoria"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Todas</option>
                  {/* Estas opções devem vir de /api/categories */}
                  <option value="engenharia">Engenharia</option>
                  <option value="informatica">Informática</option>
                  <option value="gestao">Gestão</option>
                </SelectField>

                <SelectField
                  flex="1"
                  width="100%"
                  label="Ano de publicação"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">Todos</option>
                  {YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </SelectField>
              </Div>
            </Div>
          </Box>

          {/* 📭 SEM RESULTADOS */}
          {!loading && articles.length === 0 && (
            <Box textAlign="center" p="XL">
              <Typography variant="body" size="medium">
                Nenhum artigo científico encontrado.
              </Typography>
            </Box>
          )}

          {/* 📚 LISTA DE ARTIGOS */}
          {!loading &&
            articles.map((article) => (
              <Box variant="container" px="0 !important">
                <ItemCard
                  key={article.id}
                  title={article.title}
                  introduction={article.journal || 'Revista não especificada'}
                  description={article.authors
                    .map((author) => author.name)
                    .join(', ')}
                  to={`/content/scientific-articles/${article.id}`}
                />
              </Box>
            ))}
        </Div>
      </Box>
    </Layout>
  );
};

export default ScientificArticlesView;
