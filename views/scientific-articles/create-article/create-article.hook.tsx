import { Div } from '@stylin.js/elements';
// src/features/scientific-article/hooks/use-create-scientific-article.hook.ts
import { useState } from 'react';
import { useRouter } from 'next/router';

import { ScientificArticleFormData } from '@/zod/scientific-article';
import { mutateWithAuth } from '@/lib/swr';
import { useDialog } from '@/contexts';
import { SuccessMessage } from '@/components';

const useCreateScientificArticle = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { openDialog } = useDialog();
  const router = useRouter();

  const createScientificArticle = async (data: ScientificArticleFormData) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      await mutateWithAuth('/api/scientific-articles', data, 'POST');
      openDialog(
        <SuccessMessage message="Artigo científico criado com sucesso!" />,
        {
          title: 'Sucesso',
          description: 'Artigo científico criado com sucesso!',
          showClose: true,
          size: 'sm',
        }
      );
    } catch (error) {
      console.error('Error creating scientific article:', error);
      setErrorMsg(
        error instanceof Error
          ? error.message
          : 'Erro desconhecido ao criar artigo científico'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    errorMsg,
    createScientificArticle,
  };
};

export default useCreateScientificArticle;
