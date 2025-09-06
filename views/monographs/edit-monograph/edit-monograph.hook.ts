import { useState } from 'react';
import { useRouter } from 'next/router';

import { MonographFormData } from '@/zod/monograph';

const useUpdateMonograph = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const updateMonograph = async (id: string, data: MonographFormData) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch(`/api/monographs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar monografia');
      }

      const monograph = await response.json();
      router.push(`/monographs/${monograph.id}`);
    } catch (error) {
      console.error('Error updating monograph:', error);
      setErrorMsg(
        error instanceof Error
          ? error.message
          : 'Erro desconhecido ao atualizar monografia'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    errorMsg,
    updateMonograph,
  };
};

export default useUpdateMonograph;
