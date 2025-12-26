import { useState } from 'react';
import { useRouter } from 'next/router';

import { ScientificArticleFormData } from '@/zod/scientific-article';
import { mutateWithAuth } from '@/lib/swr';
import { useDialog } from '@/contexts';
import { ErrorMessage, SuccessMessage } from '@/components';

const useEditScientificArticle = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { openDialog } = useDialog();
  const router = useRouter();

  const fetchScientificArticle = async (id: string) => {
    try {
      const response = await fetch(`/api/scientific-articles?id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch scientific article');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching scientific article:', error);
      openDialog(
        <ErrorMessage message="Erro ao carregar o artigo científico." />,
        {
          title: 'Ocorreu um erro ao carregar o artigo',
          size: 'md',
          showClose: true,
        }
      );
      return null;
    }
  };

  const editScientificArticle = async (
    id: string,
    data: ScientificArticleFormData
  ) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const article = await mutateWithAuth(
        `/api/scientific-articles/${id}`,
        data,
        'PUT'
      );
      openDialog(
        <SuccessMessage message="Artigo científico atualizado com sucesso!" />,
        {
          title: 'Sucesso',
          size: 'md',
          showClose: true,
        }
      );
    } catch (error) {
      console.error('Error updating scientific article:', error);
      setErrorMsg(
        error instanceof Error
          ? error.message
          : 'Erro desconhecido ao atualizar artigo científico'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    errorMsg,
    editScientificArticle,
    fetchScientificArticle,
  };
};

export default useEditScientificArticle;
