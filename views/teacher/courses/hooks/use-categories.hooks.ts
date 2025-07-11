// src/hooks/useCategories.ts
import useSWR from 'swr';

import { fetcherWithCredentials } from '@/constants/swr';
import { CategoryFormData } from '@/zod';

interface Category {
  id: string;
  name: string;
}

const useCategories = () => {
  const { data, isLoading, mutate, error } = useSWR<Category[]>(
    '/api/categories',
    fetcherWithCredentials
  );

  const createCategory = async (data: CategoryFormData) => {
    try {
      const response = await fetcherWithCredentials('/api/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to create category');
      }

      const newCategory = await response.json();

      mutate((prevCategories) => {
        if (!prevCategories) return [newCategory];
        return [...prevCategories, newCategory];
      }, false);

      return newCategory;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      throw new Error(message);
    }
  };

  return {
    categories: data || [],
    isLoading,
    error,
    createCategory,
    refetch: () => mutate(),
  };
};

export default useCategories;
