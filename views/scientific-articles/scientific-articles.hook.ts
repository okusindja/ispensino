// src/features/scientific-article/hooks/use-scientific-articles.hook.ts
import { fetcherWithCredentials } from '@/constants/fetchers';
import { ScientificArticle, ScientificArticleAuthor } from '@prisma/client';
import { useState, useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch articles');
    }
    return res.json();
  });

export const useScientificArticles = (
  searchTerm: string = '',
  journalFilter: string = ''
) => {
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [debouncedJournal, setDebouncedJournal] = useState(journalFilter);

  // Debounce search and filter inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setDebouncedJournal(journalFilter);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, journalFilter]);

  const { data, error, isLoading } = useSWR<
    Array<ScientificArticle & { authors: ScientificArticleAuthor[] }>
  >(
    `/api/scientific-articles?${debouncedSearch ? `search=${encodeURIComponent(debouncedSearch)}` : ''}${debouncedJournal ? `&journal=${encodeURIComponent(debouncedJournal)}` : ''}`,
    fetcherWithCredentials,
    {
      revalidateOnFocus: false,
      onError: (err) => {
        console.error('Error fetching articles:', err);
      },
    }
  );

  // Ensure articles is always an array
  const articles = Array.isArray(data) ? data : [];

  return {
    articles,
    loading: isLoading,
    error: error?.message,
  };
};
