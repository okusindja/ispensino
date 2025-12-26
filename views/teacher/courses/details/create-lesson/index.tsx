import { FC } from 'react';
import { Div } from '@stylin.js/elements';
import { Layout } from '@/components';
import { Box } from '@/elements';
import { Typography } from '@/elements/typography';
import { BookOpen, FileText, Video, Upload } from 'lucide-react';
import LessonForm from './create-lesson-form';

const CreateLessonView: FC<{ courseId: string }> = ({ courseId }) => {
  const handleSuccess = () => {
    alert('Aula criada com sucesso!');
  };

  return (
    <Layout hasGoBack>
      <Box variant="container" py="XL">
        {/* Header */}
        <Div width="100%" gridColumn="1/-1" mb="XL">
          <Typography color="text" variant="title" size="medium" mb="XS">
            <BookOpen
              size={24}
              style={{ marginRight: '12px', verticalAlign: 'middle' }}
            />
            Criar Nova Aula
          </Typography>
          <Typography color="textVariant" size="small" variant={'body'}>
            Adicione uma nova aula ao seu curso com vídeo e materiais
          </Typography>
        </Div>

        {/* Main Content Card */}
        <Div
          width="100%"
          gridColumn="1/-1"
          p="XL"
          borderRadius="L"
          border="1px solid"
          borderColor="outline"
          backgroundColor="surface"
        >
          <LessonForm courseId={courseId} onSuccess={handleSuccess} />
        </Div>
      </Box>
    </Layout>
  );
};

export default CreateLessonView;
