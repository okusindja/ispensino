import { Div } from '@stylin.js/elements';
import { FC } from 'react';

import { Layout } from '@/components';
import { Box } from '@/elements';
import { UserProps } from '@/interface/declaration';
import { Typography } from '@/elements/typography';
import { useAuthenticatedSWR } from '@/lib/swr';
import { TeacherStudentsResponse } from './teacher-students.types';
import { BlockSVG } from '@/components/svg';

const TeacherStatiscsView: FC<{ user: UserProps }> = ({ user }) => {
  const { data, isLoading } = useAuthenticatedSWR<TeacherStudentsResponse>(
    `/api/users/${user.id}/students`
  );
  console.log(data);
  return (
    <Layout hasGoBack>
      <Box variant="container">
        <Div color="text" width="100%" gridColumn="1 / -1" mt="2XL">
          {user.teachingCourses.length > 0 ? (
            <Div>
              <Typography variant="fancy" size="medium">
                Meus Alunos
              </Typography>
              <Div
                py="M"
                mt="2XL"
                gap="M"
                display="grid"
                borderBottom="1px solid"
                borderColor="outlineVariant"
                gridTemplateColumns="1fr 4rem 4rem 4rem"
              >
                <Typography variant="fancy" size="medium">
                  Nome
                </Typography>
                <Typography variant="fancy" size="medium" textAlign="center">
                  Inscrições
                </Typography>
                <Typography variant="fancy" size="medium" textAlign="center">
                  M. notas
                </Typography>
                <Typography variant="fancy" size="medium" textAlign="center">
                  Ações
                </Typography>
              </Div>
              <Div>
                {data?.students.map((s) => (
                  <Div
                    py="L"
                    gap="M"
                    display="grid"
                    borderBottom="1px solid"
                    borderColor="outlineVariant"
                    gridTemplateColumns="1fr 4rem 4rem 4rem"
                  >
                    <Typography variant="fancy" size="medium">
                      {s.name}
                    </Typography>
                    <Typography
                      variant="fancy"
                      size="medium"
                      textAlign="center"
                    >
                      {s.totalCoursesWithTeacher}
                    </Typography>
                    <Typography
                      variant="fancy"
                      size="medium"
                      textAlign="center"
                    >
                      {s.avgAssessmentScore}
                    </Typography>
                    <Div
                      color="warning"
                      display="flex"
                      justifyContent="center"
                      onClick={() =>
                        alert(
                          'Tem a certeza que deseja bloquear este aluno dos seus cursos?'
                        )
                      }
                    >
                      <BlockSVG maxWidth="1rem" maxHeight="1rem" width="100%" />
                    </Div>
                  </Div>
                ))}
              </Div>
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

export default TeacherStatiscsView;
