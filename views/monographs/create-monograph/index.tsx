// src/features/monograph/views/CreateMonographView.tsx
import { Div, Form } from '@stylin.js/elements';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useWatch } from 'react-hook-form';

import {
  FormField,
  SelectField,
  SubmitButton,
  useZodForm,
} from '@/components/form-elements';
import { useDialog } from '@/contexts';
import { Box, Button } from '@/elements';
import { Typography } from '@/elements/typography';
import { AcademicalCourses } from '@prisma/client';
import { MonographFormData, MonographSchema } from '@/zod/monograph';
import useCreateMonograph from './create-monograph.hook';
import CreateTagForm from './create-tag-form';
import { FileUploader, Layout } from '@/components';

const CreateMonographView = () => {
  const [isPdfUploading, setIsPdfUploading] = useState<boolean>(false);
  const router = useRouter();
  const { openDialog, closeDialog } = useDialog();
  const { errorMsg, loading, createMonograph } = useCreateMonograph();

  const [tagError, setTagError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
  } = useZodForm<MonographFormData>(MonographSchema, {
    tags: [],
  });

  const handleCreateTag = async (tagData: { name: string }) => {
    try {
      setTagError(null);
      const currentTags = getValues().tags || [];
      setValue('tags', [...currentTags, tagData.name]);
      closeDialog();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar tag';
      setTagError(message);
      return false;
    }
  };

  const handleOpenCreateTagDialog = () => {
    openDialog(
      <CreateTagForm
        errorMsg={tagError}
        onSubmit={handleCreateTag}
        onCancel={() => closeDialog()}
      />,
      {
        title: 'Criar Nova Tag',
        size: 'md',
        showClose: true,
      }
    );
  };

  const handleFormSubmit = async (data: MonographFormData) => {
    await createMonograph(data);
  };

  const removeTag = (indexToRemove: number) => {
    const currentTags = getValues().tags || [];
    const newTags = currentTags.filter((_, index) => index !== indexToRemove);
    setValue('tags', newTags);
  };

  const currentTags = getValues().tags || [];

  return (
    <Layout hasGoBack>
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
          <Typography variant="title" size="small" color="text" mb="2XL">
            Adicionar Nova Monografia
          </Typography>

          <Form onSubmit={handleSubmit(handleFormSubmit)} width="100%">
            <FormField<MonographFormData>
              name="title"
              label="Título da Monografia"
              type="text"
              placeholder="Título da pesquisa ou estudo"
              control={control}
            />

            <FormField<MonographFormData>
              name="author"
              label="Autor"
              type="text"
              placeholder="Nome completo do autor"
              control={control}
            />

            <FormField<MonographFormData>
              name="advisor"
              label="Orientador"
              type="text"
              placeholder="Nome completo do orientador"
              control={control}
            />

            <SelectField<MonographFormData>
              name="course"
              label="Curso Acadêmico"
              control={control}
              options={Object.values(AcademicalCourses).map((course) => ({
                value: course,
                label: course
                  .split('_')
                  .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
                  .join(' '),
              }))}
            />

            <FormField<MonographFormData>
              name="publishedAt"
              label="Data de Publicação"
              type="date"
              control={control}
            />

            <FileUploader
              onUploadStart={() => setIsPdfUploading(true)}
              onUploadComplete={(file) => {
                setValue('url', file.url);
                setIsPdfUploading(false);
              }}
              folder={`monographs/pdfs`}
              accept={['application/pdf']}
              single={true}
              label="Upload PDF File"
            />

            <Div mb="M">
              <Div display="grid" gap="M">
                <Typography variant="body" size="medium" color="text">
                  Tags
                </Typography>
                <Button
                  size="medium"
                  variant="secondary"
                  onClick={handleOpenCreateTagDialog}
                >
                  Adicionar Tag
                </Button>
              </Div>

              <Div mt="M" gap="S" display="flex" flexWrap="wrap">
                {currentTags.map((tag: string, index: number) => (
                  <Div
                    key={index}
                    p="XS"
                    bg="primary"
                    color="white"
                    borderRadius="S"
                    fontSize="S"
                    display="flex"
                    alignItems="center"
                  >
                    {tag}
                    <Button
                      size="medium"
                      ml="XS"
                      variant="neutral"
                      color="white"
                      onClick={() => removeTag(index)}
                      type="button"
                    >
                      ×
                    </Button>
                  </Div>
                ))}
              </Div>

              {currentTags.length === 0 && (
                <Typography variant="body" size="medium" color="text" my="XL">
                  Nenhuma tag adicionada. Adicione tags para categorizar sua
                  monografia.
                </Typography>
              )}
            </Div>

            {errorMsg && (
              <Div color="error" mb="M" textAlign="center">
                {errorMsg}
              </Div>
            )}

            <Box display="flex" gap="M">
              <Button
                size="medium"
                variant="secondary"
                onClick={() => router.push('/resources')}
                disabled={isSubmitting || loading}
                type="button"
              >
                Cancelar
              </Button>
              <SubmitButton loading={isSubmitting || loading || isPdfUploading}>
                {isSubmitting || loading
                  ? 'Publicando monografia...'
                  : isPdfUploading
                    ? 'Fazendo upload do PDF...'
                    : 'Publicar Monografia'}
              </SubmitButton>
            </Box>
          </Form>
        </Div>
      </Box>
    </Layout>
  );
};

export default CreateMonographView;
