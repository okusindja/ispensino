// src/features/scientific-article/views/reference-form.tsx
import { Form } from '@stylin.js/elements';
import { FC, useState } from 'react';
import { useZodForm } from '@/components/form-elements';
import { Box, Button } from '@/elements';
import { FormField } from '@/components/form-elements';
import { z } from 'zod';

interface ReferenceFormProps {
  onSubmit: (reference: string) => Promise<void>;
  onCancel: () => void;
}

const referenceSchema = z.object({
  citation: z.string().min(10, 'Citação deve ter pelo menos 10 caracteres'),
  doi: z.string().optional().or(z.literal('')),
  url: z.string().url('URL deve ser válida').optional().or(z.literal('')),
});

const ReferenceForm: FC<ReferenceFormProps> = ({ onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useZodForm(referenceSchema);

  const handleFormSubmit = async (data: z.infer<typeof referenceSchema>) => {
    setLoading(true);
    try {
      const referenceText =
        data.doi || data.url
          ? `${data.citation} ${data.doi ? `DOI: ${data.doi}` : ''} ${data.url ? `URL: ${data.url}` : ''}`
          : data.citation;

      await onSubmit(referenceText.trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <FormField
        name="citation"
        label="Citação*"
        type="textarea"
        placeholder="Ex: Autor, A. (2023). Título do artigo. Nome da Revista, 12(3), 123-145."
        control={control}
      />

      <FormField
        name="doi"
        label="DOI"
        type="text"
        placeholder="10.1234/abc.2023.01.001"
        control={control}
      />

      <FormField
        name="url"
        label="URL"
        type="url"
        placeholder="https://example.com/article"
        control={control}
      />

      <Box display="flex" gap="M" mt="L">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
          size={'small'}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          size={'small'}
        >
          Adicionar Referência
        </Button>
      </Box>
    </Form>
  );
};

export default ReferenceForm;
