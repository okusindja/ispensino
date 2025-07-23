import { Div } from '@stylin.js/elements';
import { FC } from 'react';

import { Layout, TextField } from '@/components';
import ItemCard from '@/components/item-card';
import { SearchSVG } from '@/components/svg';
import { Box } from '@/elements';

import { CoursesViewProps } from './courses.types';

const Courses: FC<CoursesViewProps> = ({ courses }) => {
  return (
    <Layout hasGoBack>
      <Box variant="container">
        <Div width="100%" gridColumn="1/-1" mt="M">
          <TextField
            Prefix={<SearchSVG maxWidth="1rem" maxHeight="1rem" width="100%" />}
            placeholder="Procure por um curso..."
          />
        </Div>
        {courses.map((course) => (
          <ItemCard
            key={course.id}
            to={`/content/courses/${course.slug}`}
            title={course.title}
            thumbnail={course.thumbnail || 'https://picsum.photos/200/300'}
            introduction={course.price ? `${course.price} AOA` : 'Gratuito'}
            description={
              course.lessons.length > 0
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
