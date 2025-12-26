import { AcademicalCourses } from '@prisma/client';
import { Layout, TextField } from '@/components';
import { Box } from '@/elements';
import { Div, Select } from '@stylin.js/elements';
import { Typography } from '@/elements/typography';
import { SearchSVG } from '@/components/svg';
import ItemCard from '@/components/item-card';
import { useMonographs } from './monographs.hooks';
import { SelectField } from '@/components/select-field';
import { useEffect, useState } from 'react';

const MonographListView = () => {
  const [search, setSearch] = useState('');
  const [course, setCourse] = useState<AcademicalCourses | ''>('');
  const [year, setYear] = useState('');

  const {
    monographs: filteredMonographs,
    loading,
    error,
  } = useMonographs(search, course, year);

  return (
    <Layout hasGoBack>
      <Box variant="container">
        {/* Filtros */}
        <Div
          display="flex"
          gap="M"
          mb="L"
          mt="XL"
          gridColumn="1/-1"
          width="100%"
          flexWrap="wrap"
        >
          <Box width="100%">
            <TextField
              label="Pesquisar"
              Prefix={
                <SearchSVG maxWidth="1rem" maxHeight="1rem" width="100%" />
              }
              placeholder="Pesquisar por título, autor, orientador ou tags"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>

          <Box minWidth="160px" flex="1">
            <SelectField
              label="Ano"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">Todos os anos</option>
              {Array.from({ length: 14 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </SelectField>
          </Box>

          <Box minWidth="160px" flex="1">
            <SelectField
              label="Curso"
              value={course}
              onChange={(e) =>
                setCourse(e.target.value as AcademicalCourses | '')
              }
            >
              <option value="">Todos os cursos</option>
              {Object.values(AcademicalCourses).map((course) => (
                <option key={course} value={course}>
                  {course.replaceAll('_', ' ')}
                </option>
              ))}
            </SelectField>
          </Box>
        </Div>

        {/* Estados */}
        {loading && (
          <Typography textAlign="center" size={'small'} variant={'title'}>
            A carregar monografias...
          </Typography>
        )}

        {error && (
          <Typography
            color="error"
            textAlign="center"
            size={'small'}
            variant={'title'}
          >
            {error}
          </Typography>
        )}

        {!loading && filteredMonographs.length === 0 && (
          <Typography textAlign="center" size={'small'} variant={'title'}>
            Nenhuma monografia encontrada.
          </Typography>
        )}

        {/* Lista */}
        {filteredMonographs.map((monograph) => (
          <ItemCard
            key={monograph.id}
            title={monograph.title}
            introduction={monograph.author}
            description={monograph.tags.join(', ')}
            to={`/content/monographs/${monograph.id}`}
          />
        ))}
      </Box>
    </Layout>
  );
};

export default MonographListView;
