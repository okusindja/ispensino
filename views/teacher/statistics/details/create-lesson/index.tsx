import { FC } from 'react';

import { Layout } from '@/components';

import LessonForm from './create-lesson-form';

const CreateLessonView: FC<{ courseId: string }> = ({ courseId }) => {
  const handleSuccess = () => {
    alert('Aula criada com sucesso!');
  };

  return (
    <Layout hasGoBack>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Lesson
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Add a new lesson to your course with video and materials
            </p>
          </div>

          <LessonForm courseId={courseId as string} onSuccess={handleSuccess} />
        </div>
      </div>
    </Layout>
  );
};

export default CreateLessonView;
