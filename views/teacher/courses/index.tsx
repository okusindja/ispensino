import { Div } from '@stylin.js/elements';
import { FC } from 'react';

import { Layout, TextField } from '@/components';
import ItemCard from '@/components/item-card';
import { SearchSVG } from '@/components/svg';
import { Box } from '@/elements';

import { UserProps } from '@/interface/declaration';
import { CoursesViewProps } from '@/views/courses/courses.types';
import { Typography } from '@/elements/typography';

const Courses: FC<CoursesViewProps> = ({ courses }) => {
  return (
    <Layout hasGoBack>
      <Box variant="container">
        <Div width="100%" gridColumn="1/-1" mt="M">
          <Typography mt="XL" variant="title" size="medium">
            Meus cursos
          </Typography>
        </Div>
        <Div width="100%" gridColumn="1/-1" mt="M">
          <TextField
            Prefix={<SearchSVG maxWidth="1rem" maxHeight="1rem" width="100%" />}
            placeholder="Procure por um curso..."
          />
        </Div>
        {courses?.map((course) => (
          <ItemCard
            key={course.id}
            to={`/teacher/courses/${course.slug}`}
            title={course.title}
            thumbnail={course.thumbnail || '/icons/icon-512x512.png'}
            introduction={course.price ? `${course.price} AOA` : 'Gratuito'}
            description={
              course.lessons?.length > 0
                ? `${course.lessons.length} Aula${course.lessons.length > 1 ? 's' : ''}`
                : 'Sem aulas ainda'
            }
          />
        ))}
      </Box>
    </Layout>
  );
};

export default Courses;
