// src/features/monograph/views/MonographListView.tsx (updated)
import { useState, useEffect, SetStateAction } from 'react';
import { useRouter } from 'next/router';

import { Box, Button } from '@/elements';
import { Typography } from '@/elements/typography';
import { AcademicalCourses, Monograph } from '@prisma/client';
import { Layout, TextField } from '@/components';
import { Div, Select } from '@stylin.js/elements';
import { SearchSVG } from '@/components/svg';
import ItemCard from '@/components/item-card';

interface MonographListViewProps {
  monographs: Monograph[];
}

const MonographListView = ({
  monographs: initialMonographs,
}: MonographListViewProps) => {
  const router = useRouter();
  const [monographs, setMonographs] = useState<Monograph[]>(initialMonographs);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState<AcademicalCourses | ''>('');
  const [error, setError] = useState<string | null>(null);

  return (
    <Layout hasGoBack>
      <Box variant="container">
        <Div gridColumn="1/-1" width="100%" mb="L">
          {/* <Box
            as="form"
            onSubmit={handleSearch}
            mb="L"
            display="flex"
            gap="M"
            alignItems="end"
          >
            <Box flex="1">
              <TextField
                label="Buscar"
                placeholder="Buscar por título, autor, orientador ou tags"
                value={searchTerm}
                onChange={(e: { target: { value: SetStateAction<string> } }) =>
                  setSearchTerm(e.target.value)
                }
              />
            </Box>

            <Box width="200px">
              <Select
                // label="Filtrar por curso"
                value={courseFilter}
                onChange={(e: { target: { value: string } }) =>
                  setCourseFilter(e.target.value as AcademicalCourses | '')
                }
              >
                <option value="">Todos os cursos</option>
                {Object.values(AcademicalCourses).map((course) => (
                  <option key={course} value={course}>
                    {formatCourseName(course)}
                  </option>
                ))}
              </Select>
            </Box>

            <Button type="submit" size="medium" variant="primary">
              Buscar
            </Button>
          </Box> */}

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
              <Div width="100%" gridColumn="1/-1" mt="M">
                <TextField
                  Prefix={
                    <SearchSVG maxWidth="1rem" maxHeight="1rem" width="100%" />
                  }
                  placeholder="Procure por uma monografia..."
                />
              </Div>
              {monographs.map((monograph) => (
                <ItemCard
                  key={monograph.id}
                  title={monograph.title}
                  introduction={monograph.author}
                  description={monograph.tags.join(', ')}
                  to={`/content/monographs/${monograph.id}`}
                  thumbnail={'https://picsum.photos/200/300'}
                />
              ))}
            </Box>
          )}
        </Div>
      </Box>
    </Layout>
  );
};

export default MonographListView;
