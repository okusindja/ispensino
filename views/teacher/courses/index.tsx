import { Div } from '@stylin.js/elements';
import { FC } from 'react';

import { Layout } from '@/components';
import { Box } from '@/elements';
import { UserProps } from '@/interface/declaration';

const CoursesView: FC<{ user: UserProps }> = ({ user }) => {
  return (
    <Layout hasGoBack>
      <Box variant="container">
        <Div color="text" width="100%" gridColumn="1 / -1">
          {user.teachingCourses.length > 0 ? (
            <Div>
              <h1>Meus Cursos</h1>
              <ul>
                {user.teachingCourses.map((course) => (
                  <li key={course.id}>
                    <a href={`/teacher/courses/${course.slug}`}>
                      {course.title}
                    </a>
                  </li>
                ))}
              </ul>
            </Div>
          ) : (
            <Div>
              <h1>Você ainda não tem cursos</h1>
              <p>Crie seu primeiro curso para começar a ensinar!</p>
              <a href="/teacher/courses/create">Criar Curso</a>
            </Div>
          )}
        </Div>
      </Box>
    </Layout>
  );
};

export default CoursesView;
