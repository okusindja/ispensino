import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { ScientificArticle, ScientificArticleAuthor } from '@prisma/client';
import { fetcherWithCredentials } from '@/constants/fetchers';

type ScientificArticleWithRelations = ScientificArticle & {
  authors: ScientificArticleAuthor[];
};

export const useScientificArticles = (
  search: string = '',
  category: string = '',
  year: string = ''
) => {
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [debouncedCategory, setDebouncedCategory] = useState(category);
  const [debouncedYear, setDebouncedYear] = useState(year);

  // 🔁 Debounce para evitar múltiplas chamadas à API
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setDebouncedCategory(category);
      setDebouncedYear(year);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, category, year]);

  // 🔗 Construção segura da query string
  const params = new URLSearchParams();

  if (debouncedSearch) {
    params.append('search', debouncedSearch);
  }

  if (debouncedCategory) {
    params.append('category', debouncedCategory);
  }

  if (debouncedYear) {
    params.append('year', debouncedYear);
  }

  const { data, error, isLoading } = useSWR<ScientificArticleWithRelations[]>(
    `/api/scientific-articles?${params.toString()}`,
    fetcherWithCredentials,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onError: (err) => {
        console.error('Erro ao carregar artigos científicos:', err);
      },
    }
  );

  return {
    articles: Array.isArray(data) ? data : [],
    loading: isLoading,
    error: error?.message ?? null,
  };
};
