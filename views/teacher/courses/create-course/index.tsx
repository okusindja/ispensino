// src/features/course/views/CreateCourseView.tsx
import { Div, Form } from '@stylin.js/elements';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useWatch } from 'react-hook-form';

import {
  CheckboxField,
  FormField,
  SubmitButton,
  useZodForm,
} from '@/components/form-elements';
import { useDialog } from '@/contexts';
import { Box, Button } from '@/elements';
import { Typography } from '@/elements/typography';
import { CourseFormData, CourseSchema } from '@/zod/course';

import useCategories from '../hooks/use-categories.hooks';
import useCreateCourse from '../hooks/use-create-course.hooks';
import CreateCategoryForm from './create-category';

const CreateCourseView = () => {
  const router = useRouter();
  const { openDialog, closeDialog } = useDialog();
  const { errorMsg, loading, createCourse } = useCreateCourse();
  const { categories, isLoading, createCategory, refetch } = useCategories();

  const [categoryError, setCategoryError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm<CourseFormData>(CourseSchema, {
    categories: [],
    isFree: true,
    isPublished: false,
  });

  const price = useWatch({ control, name: 'price' });
  const isFree = !price || price <= 0;

  const handleCreateCategory = async (categoryData: {
    name: string;
    description: string;
  }) => {
    try {
      setCategoryError(null);
      await createCategory(categoryData);
      refetch();
      closeDialog();
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao criar categoria';
      setCategoryError(message);
      return false;
    }
  };

  const handleOpenCreateCategoryDialog = () => {
    openDialog(
      <CreateCategoryForm
        errorMsg={categoryError}
        onSubmit={handleCreateCategory}
        onCancel={() => closeDialog()}
      />,
      {
        title: 'Criar Nova Categoria',
        size: 'md',
        showClose: true,
      }
    );
  };

  return (
    // <Layout hasGoBack>
    <Box variant="container">
      <Div
        p="L"
        mx="auto"
        width="100%"
        display="flex"
        maxWidth="800px"
        gridColumn="1/-1"
        flexDirection="column"
      >
        <Typography variant="body" size="medium" mb="L">
          Criar Novo Curso
        </Typography>

        <Form onSubmit={handleSubmit(createCourse)} width="100%">
          <FormField<CourseFormData>
            name="title"
            label="Título do Curso"
            type="text"
            placeholder="Introdução ao React Avançado"
            control={control}
            error={errors.title?.message}
          />

          <FormField<CourseFormData>
            name="description"
            label="Descrição"
            type="textarea"
            placeholder="Detalhes sobre o curso..."
            control={control}
            error={errors.description?.message}
          />

          <FormField<CourseFormData>
            name="price"
            label="Preço (USD)"
            type="number"
            placeholder="29.99"
            control={control}
            error={errors.price?.message}
            step="0.01"
            min="0"
          />

          {!isFree && (
            <Box color="textSecondary" fontSize="S" mb="M">
              Curso será vendido por ${price}
            </Box>
          )}

          {isFree && (
            <Box color="success" fontSize="S" mb="M">
              Este será um curso gratuito
            </Box>
          )}

          <Box mb="M">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb="XS"
            >
              <Typography variant="body" size="medium">
                Categorias
              </Typography>
              <Button
                size="medium"
                variant="neutral"
                onClick={handleOpenCreateCategoryDialog}
              >
                <Typography variant="body" size="medium">
                  Adicionar Categoria
                </Typography>
              </Button>
            </Box>

            {isLoading ? (
              <Box mt="M">Carregando categorias...</Box>
            ) : (
              <Box
                mt="M"
                gap="S"
                display="grid"
                gridTemplateColumns="repeat(auto-fill, minmax(150px, 1fr))"
              >
                {categories.map((category) => (
                  <CheckboxField
                    key={category.id}
                    name="categories"
                    control={control}
                    value={category.id}
                    label={category.name}
                  />
                ))}
              </Box>
            )}

            {categories.length === 0 && (
              <Box mt="M" color="text">
                Nenhuma categoria disponível. Crie uma nova categoria para
                continuar.
              </Box>
            )}

            {errors.categories?.message && (
              <Div color="error" mt="XS" fontSize="S">
                {errors.categories.message}
              </Div>
            )}
          </Box>

          <Box mb="L">
            <CheckboxField
              control={control}
              name="isPublished"
              label="Publicar imediatamente"
            />
          </Box>

          {errorMsg && (
            <Div color="error" mb="M" textAlign="center">
              {errorMsg}
            </Div>
          )}

          <Box display="flex" gap="M">
            <Box
              as="button"
              onClick={() => router.push('/teacher/courses')}
              // disabled={isSubmitting || loading}
              p="M"
              border="none"
              bg="lightGray"
              borderRadius="S"
              cursor="pointer"
            >
              Cancelar
            </Box>
            <SubmitButton loading={isSubmitting || loading}>
              {isSubmitting || loading ? 'Criando curso...' : 'Criar Curso'}
            </SubmitButton>
          </Box>
        </Form>
      </Div>
    </Box>
    // </Layout>
  );
};

export default CreateCourseView;
