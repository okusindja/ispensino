import { useRouter } from 'next/router';
import { FC, useState } from 'react';

import { Layout } from '@/components';
import { fetcherWithCredentials } from '@/constants/fetchers';
import { AssessmentType } from '@/zod';

import AssessmentForm from './assessment-form';
import { CreateAssessmentProps } from './create.types';

const CreateAssessment: FC<CreateAssessmentProps> = ({ lessonId }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: AssessmentType) => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetcherWithCredentials(`/api/assessments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((res) => res.json());

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.back();
        }, 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create assessment');
      }
    } catch (error) {
      console.error('Error creating assessment:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to create assessment. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout hasGoBack>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create Assessment</h1>

        {success ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
            Assessment created successfully! Redirecting...
          </div>
        ) : loading ? (
          <div className="text-center py-8">
            <p>Creating assessment...</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-600 mb-6">
              Fill out the form below to create a new assessment for the lesson.
              Students must score at least 75% to proceed to the next lesson.
            </p>
            <AssessmentForm lessonId={lessonId} onSubmit={handleSubmit} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CreateAssessment;
