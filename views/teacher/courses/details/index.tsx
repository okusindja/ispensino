import { Course } from '@prisma/client';
import { Div } from '@stylin.js/elements';
import { FC } from 'react';

import { Layout } from '@/components';
import { Box } from '@/elements';

const CourseDetails: FC<{ course: Course }> = ({ course }) => {
  return (
    <Layout hasGoBack>
      <Box variant="container">
        <Div width="100%" gridColumn="1 / -1" color="text">
          <Div>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
          </Div>
          <h1>Detalhes do Curso</h1>
          <p>Esta página exibirá os detalhes do curso selecionado.</p>
          <p>Você pode editar ou excluir o curso aqui.</p>
          <p>
            Adicione seções, aulas e recursos adicionais conforme necessário.
          </p>
          <p>Use os botões abaixo para gerenciar o curso.</p>
        </Div>
      </Box>
    </Layout>
  );
};

export default CourseDetails;
