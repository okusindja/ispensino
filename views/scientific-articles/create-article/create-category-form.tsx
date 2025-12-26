// src/features/scientific-article/views/create-category-form.tsx
import { Form } from '@stylin.js/elements';
import { FC, useState } from 'react';
import { useZodForm } from '@/components/form-elements';
import { Box, Button } from '@/elements';
import { FormField } from '@/components/form-elements';
import z from 'zod';

interface CreateCategoryFormProps {
  onSubmit: (data: { name: string; description: string }) => Promise<void>;
  onCancel: () => void;
  errorMsg?: string | null;
}

const CreateCategoryForm: FC<CreateCategoryFormProps> = ({
  onSubmit,
  onCancel,
  errorMsg,
}) => {
  const [loading, setLoading] = useState(false);
  const schema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    description: z
      .string()
      .min(5, 'Descrição deve ter pelo menos 5 caracteres'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useZodForm(schema);

  const handleFormSubmit = async (data: z.infer<typeof schema>) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <FormField
        name="name"
        label="Nome da Categoria"
        type="text"
        placeholder="Nome da categoria"
        control={control}
      />
      <FormField
        name="description"
        label="Descrição"
        type="textarea"
        placeholder="Descrição da categoria"
        control={control}
      />
      {errorMsg && (
        <Box color="error" mb="M" textAlign="center">
          {errorMsg}
        </Box>
      )}
      <Box display="flex" gap="M" mt="L">
        <Button
          type="button"
          variant="secondary"
          size="medium"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="medium"
          disabled={loading}
        >
          Criar Categoria
        </Button>
      </Box>
    </Form>
  );
};

export default CreateCategoryForm;
