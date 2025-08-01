import { Div, Li, Ul, Video } from '@stylin.js/elements';
import Image from 'next/image';
import { FC } from 'react';

import { Layout } from '@/components';
import ListItemCard from '@/components/list-item-card';
import { Box } from '@/elements';
import { Typography } from '@/elements/typography';

import { CourseDetailsProps } from './details.types';

const CourseDetails: FC<CourseDetailsProps> = ({ course }) => {
  return (
    <Layout hasGoBack>
      <Div backgroundColor="primary" width="100%" py="M" pt="L">
        <Box variant="container">
          <Div width="100%" gridColumn="1 / -1">
            <Typography variant="body" size="medium" color="textInverted">
              Início:{' '}
              {new Date(
                course.startDate ? course.startDate : course.createdAt
              ).toLocaleDateString()}
            </Typography>
          </Div>
        </Box>
      </Div>
      <Div>
        <Video
          controls
          autoPlay
          width="100%"
          height="14rem"
          style={{ objectFit: 'contain' }}
          src="https://www.youtube.com/watch?v=cTWN0ERBSM8"
          poster={course.thumbnail || 'https://picsum.photos/200/300'}
        />
      </Div>
      <Box variant="container" backgroundColor="surface">
        <Div width="100%" gridColumn="1 / -1">
          <Typography variant="headline" size="extraSmall" color="text">
            {course.title} - {course.price ? `${course.price} AOA` : 'Gratuito'}
          </Typography>
          <Typography variant="body" size="small" color="text" mt="M">
            {course.description}
          </Typography>
          <Div display="flex" alignItems="center" gap="M" mt="XL">
            <Image
              src={'https://picsum.photos/200/300'}
              alt={course.title}
              style={{ borderRadius: '100%' }}
              width={35}
              height={35}
            />
            <Typography variant="body" size="small" color="text">
              Com professor: {course.teacher.name}
            </Typography>
          </Div>
        </Div>
      </Box>
      <Box variant="container" mt="L">
        <Div width="100%" gridColumn="1 / -1" color="text">
          <Ul
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
            gap="L"
          >
            {course.lessons.map((lesson) => (
              <Li key={lesson.id}>
                <ListItemCard
                  to={`/content/courses/${course.slug}/lessons/${lesson.id}`}
                  title={lesson.title}
                  footerLeft={
                    <Typography
                      variant="body"
                      size="small"
                      color="text"
                      display="flex"
                    >
                      Por:{' '}
                      <Typography
                        as="span"
                        ml="S"
                        variant="body"
                        size="small"
                        color="primary"
                      >
                        {course.teacher.name}
                      </Typography>
                    </Typography>
                  }
                />
              </Li>
            ))}
          </Ul>
          {course.lessons.length === 0 && (
            <Typography variant="body" size="medium" color="text">
              Nenhuma aula disponível
            </Typography>
          )}
        </Div>
      </Box>
    </Layout>
  );
};

export default CourseDetails;
