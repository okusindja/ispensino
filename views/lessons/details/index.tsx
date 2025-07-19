import { useRouter } from 'next/router';
import { FC } from 'react';

import { Layout } from '@/components';
import { Button } from '@/elements';

const LessonDetailsView: FC<{
  lessonId: string;
  teacherId: string;
  courseSlug: string;
}> = ({ lessonId, teacherId, courseSlug }) => {
  const router = useRouter();
  return (
    <Layout hasGoBack>
      <div>
        LessonDetailsView for lesson {lessonId} and teacher {teacherId} in
        course {courseSlug}
      </div>
      <Button
        variant="secondary"
        size="medium"
        onClick={() =>
          router.push(
            `/teacher/courses/${courseSlug}/lessons/${lessonId}/assessment/new`
          )
        }
      >
        Criar avaliação
      </Button>
    </Layout>
  );
};

export default LessonDetailsView;
