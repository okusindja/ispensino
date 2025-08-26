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
import { FileUploader } from '@/components';

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
        <Typography variant="body" size="large" mb="L">
          Adicionar Nova Monografia
        </Typography>

        <Form onSubmit={handleSubmit(handleFormSubmit)} width="100%">
          <FormField<MonographFormData>
            name="title"
            label="Título da Monografia"
            type="text"
            placeholder="Título da pesquisa ou estudo"
            control={control}
            error={errors.title?.message}
          />

          <FormField<MonographFormData>
            name="author"
            label="Autor"
            type="text"
            placeholder="Nome completo do autor"
            control={control}
            error={errors.author?.message}
          />

          <FormField<MonographFormData>
            name="advisor"
            label="Orientador"
            type="text"
            placeholder="Nome completo do orientador"
            control={control}
            error={errors.advisor?.message}
          />

          <SelectField<MonographFormData>
            name="course"
            label="Curso Acadêmico"
            control={control}
            error={errors.course?.message}
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
            error={errors.publishedAt?.message}
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

          <Box mb="M">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb="XS"
            >
              <Typography variant="body" size="medium">
                Tags
              </Typography>
              <Button
                size="medium"
                variant="neutral"
                onClick={handleOpenCreateTagDialog}
              >
                <Typography variant="body" size="medium">
                  Adicionar Tag
                </Typography>
              </Button>
            </Box>

            <Box mt="M" gap="S" display="flex" flexWrap="wrap">
              {currentTags.map((tag: string, index: number) => (
                <Box
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
                </Box>
              ))}
            </Box>

            {currentTags.length === 0 && (
              <Box mt="M" color="textSecondary">
                Nenhuma tag adicionada. Adicione tags para categorizar sua
                monografia.
              </Box>
            )}
          </Box>

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
  );
};

export default CreateMonographView;
