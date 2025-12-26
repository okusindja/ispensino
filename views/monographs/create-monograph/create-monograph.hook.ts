// src/features/monograph/hooks/use-create-monograph.hooks.ts
import { useState } from 'react';
import { useRouter } from 'next/router';

import { MonographFormData } from '@/zod/monograph';
import { mutateWithAuth } from '@/lib/swr';
import { useDialog } from '@/contexts';

const useCreateMonograph = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { openDialog } = useDialog();
  const router = useRouter();

  const createMonograph = async (data: MonographFormData) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const monograph = await mutateWithAuth('/api/monographs', data, 'POST');

      // router.push(`/adm/${monograph.id}`);
    } catch (error) {
      console.error('Error creating monograph:', error);
      setErrorMsg(
        error instanceof Error
          ? error.message
          : 'Erro desconhecido ao criar monografia'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    errorMsg,
    createMonograph,
  };
};

export default useCreateMonograph;
