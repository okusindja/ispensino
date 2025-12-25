import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { AcademicalCourses, Monograph } from '@prisma/client';
import { fetcherWithCredentials } from '@/constants/fetchers';

export type MonographWithRelations = Monograph & {};

export const useMonographs = (
  search: string = '',
  course: AcademicalCourses | '' = '',
  year: string = ''
) => {
  const [debouncedParams, setDebouncedParams] = useState({
    search,
    course,
    year,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedParams({ search, course, year });
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, course, year]);

  // 🔗 Build query string safely
  const params = new URLSearchParams();
  if (debouncedParams.search) params.append('search', debouncedParams.search);
  if (debouncedParams.course) params.append('course', debouncedParams.course);
  if (debouncedParams.year) params.append('year', debouncedParams.year);

  const shouldFetch =
    debouncedParams.search || debouncedParams.course || debouncedParams.year;

  const { data, error, isLoading } = useSWR<Monograph[]>(
    shouldFetch ? `/api/monographs?${params.toString()}` : '/api/monographs',
    fetcherWithCredentials,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    monographs: Array.isArray(data) ? data : [],
    loading: isLoading,
    error: error?.message ?? null,
  };
};
