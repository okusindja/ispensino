import { Course, Lesson } from '@prisma/client';
import { Div } from '@stylin.js/elements';
import Link from 'next/link';
import { FC } from 'react';

import { Layout } from '@/components';
import { Box, Button } from '@/elements';

const CourseDetails: FC<{ course: Course & { lessons: Lesson[] } }> = ({
  course,
}) => {
  return (
    <Layout hasGoBack>
      <Box variant="container">
        <Div width="100%" gridColumn="1 / -1" color="text">
          <Div>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
          </Div>
          <h1>Detalhes</h1>
          <p>Esta página exibirá os detalhes do curso selecionado.</p>
          <p>Você pode editar ou excluir o curso aqui.</p>
          <p>
            Adicione seções, aulas e recursos adicionais conforme necessário.
          </p>
          <p>Use os botões abaixo para gerenciar o curso.</p>
          <Div mt="XL" display="flex" gap="M">
            <Button
              variant="primary"
              size="medium"
              onClick={() => alert('Editar curso')}
            >
              Editar
            </Button>
            <Button
              variant="secondary"
              size="medium"
              onClick={() => alert('Excluir curso')}
            >
              Excluir
            </Button>
          </Div>

          <Div>
            <h2>Conteúdo do Curso</h2>
            <p>
              Esta seção exibirá o conteúdo do curso, incluindo aulas e
              materiais.
            </p>
            {course.lessons.length > 0 ? (
              <ul>
                {course.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <a
                      href={`/teacher/courses/${course.slug}/lessons/${lesson.id}`}
                    >
                      {lesson.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <p>Este curso ainda não possui aulas.</p>
                <Link href={`/teacher/courses/${course.slug}/lessons/create`}>
                  Adicionar Aula
                </Link>
              </>
            )}
          </Div>
        </Div>
      </Box>
    </Layout>
  );
};

export default CourseDetails;
