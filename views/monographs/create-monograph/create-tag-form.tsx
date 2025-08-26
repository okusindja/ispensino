// src/features/monograph/views/create-tag-form.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@stylin.js/elements';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

import { FormField, SubmitButton } from '@/components/form-elements';
import { Box, Button } from '@/elements';
import { Typography } from '@/elements/typography';
import { z } from 'zod';

const TagSchema = z.object({
  name: z.string().min(2, 'Nome da tag deve ter pelo menos 2 caracteres'),
});

type TagFormData = z.infer<typeof TagSchema>;

interface CreateTagFormProps {
  onSubmit: (data: { name: string }) => Promise<boolean>;
  onCancel: () => void;
  errorMsg?: string | null;
}

const CreateTagForm: FC<CreateTagFormProps> = ({
  onSubmit,
  onCancel,
  errorMsg,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TagFormData>({
    resolver: zodResolver(TagSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleFormSubmit = async (data: TagFormData) => {
    const success = await onSubmit(data);
    if (success) {
      control._reset();
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)} width="100%">
      <FormField<TagFormData>
        name="name"
        type="text"
        control={control}
        label="Nome da Tag"
        error={errors.name?.message}
        placeholder="Ex: Inteligência Artificial"
      />

      {errorMsg && (
        <Typography variant="body" size="small" color="error" mt="S">
          {errorMsg}
        </Typography>
      )}

      <Box display="flex" gap="M" mt="M">
        <Button
          variant="secondary"
          size="medium"
          onClick={onCancel}
          type="button"
        >
          Cancelar
        </Button>
        <SubmitButton loading={isSubmitting}>
          {isSubmitting ? 'Criando...' : 'Criar Tag'}
        </SubmitButton>
      </Box>
    </Form>
  );
};

export default CreateTagForm;
