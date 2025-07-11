import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@stylin.js/elements';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

import { FormField, SubmitButton } from '@/components/form-elements';
import { Box, Button } from '@/elements';
import { Typography } from '@/elements/typography';
import { CategoryFormData, CategorySchema } from '@/zod';

interface CreateCategoryProps {
  onSubmit: (data: { name: string; description: string }) => Promise<boolean>;
  onCancel: () => void;
  errorMsg?: string | null;
}

const CreateCategoryForm: FC<CreateCategoryProps> = ({
  onSubmit,
  onCancel,
  errorMsg,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const handleFormSubmit = async (data: CategoryFormData) => {
    const success = await onSubmit(data);
    if (success) {
      control._reset();
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)} width="100%">
      <FormField<CategoryFormData>
        name="name"
        type="text"
        control={control}
        label="Nome da Categoria"
        error={errors.name?.message}
        placeholder="Ex: Desenvolvimento Web"
      />

      <FormField<CategoryFormData>
        type="textarea"
        label="Descrição da Categoria"
        control={control}
        name="description"
        error={errors.description?.message}
        placeholder="Ex: Cursos relacionados ao desenvolvimento web"
      />

      {errorMsg && (
        <Typography variant="body" size="small" color="error" mt="S">
          {errorMsg}
        </Typography>
      )}

      <Box display="flex" gap="M" mt="M">
        <Button variant="secondary" size="medium" onClick={onCancel}>
          Cancelar
        </Button>
        <SubmitButton loading={isSubmitting}>
          {isSubmitting ? 'Criando...' : 'Criar Categoria'}
        </SubmitButton>
      </Box>
    </Form>
  );
};

export default CreateCategoryForm;
