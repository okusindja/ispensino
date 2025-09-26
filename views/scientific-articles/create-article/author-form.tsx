// src/features/scientific-article/views/author-form.tsx
import { Form } from '@stylin.js/elements';
import { useZodForm } from '@/components/form-elements';
import { Box, Button } from '@/elements';
import {
  ScientificArticleAuthorSchema,
  ScientificArticleAuthorFormData,
} from '@/zod/scientific-article';
import { FormField } from '@/components/form-elements';
import { FC } from 'react';
import { AuthorFormProps } from './create-article.types';

const AuthorForm: FC<AuthorFormProps> = ({ onSubmit, onCancel }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useZodForm<ScientificArticleAuthorFormData>(
    ScientificArticleAuthorSchema
  );

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormField<ScientificArticleAuthorFormData>
        name="name"
        label="Nome do Autor"
        type="text"
        placeholder="Nome completo do autor"
        control={control}
      />
      <FormField<ScientificArticleAuthorFormData>
        name="affiliation"
        label="Afiliação"
        type="text"
        placeholder="Instituição/Universidade"
        control={control}
      />
      <FormField<ScientificArticleAuthorFormData>
        name="email"
        label="Email"
        type="email"
        placeholder="email@exemplo.com"
        control={control}
      />
      <Box display="flex" gap="M" mt="L">
        <Button
          type="button"
          variant="secondary"
          size="medium"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button type="submit" variant="primary" size="medium">
          Adicionar Autor
        </Button>
      </Box>
    </Form>
  );
};

export default AuthorForm;
