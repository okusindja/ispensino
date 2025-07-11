// src/features/course/hooks/useCreateCourse.ts
import { useRouter } from 'next/router';
import { useState } from 'react';

import { fetcherWithCredentials } from '@/constants/swr';
import { CourseFormData } from '@/zod/course';

interface UseCreateCourse {
  errorMsg: string | null;
  loading: boolean;
  createCourse: (data: CourseFormData) => Promise<void>;
}

const useCreateCourse = (): UseCreateCourse => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createCourse = async (data: CourseFormData) => {
    setErrorMsg(null);
    try {
      setLoading(true);

      // Determine if course is free
      const isFree = !data.price || data.price <= 0;

      const response = await fetcherWithCredentials('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          isFree,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Falha ao criar curso');
      }

      const course = await response.json();
      router.push(`/courses/${course.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro desconhecido';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    errorMsg,
    loading,
    createCourse,
  };
};

export default useCreateCourse;
