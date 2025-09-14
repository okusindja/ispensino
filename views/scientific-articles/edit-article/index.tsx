import { Div, Form } from '@stylin.js/elements';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';

import {
  FormField,
  SelectField,
  SubmitButton,
  useZodForm,
} from '@/components/form-elements';
import { useDialog } from '@/contexts';
import { Box, Button } from '@/elements';
import { Typography } from '@/elements/typography';
import { LicenseType } from '@prisma/client';
import {
  ScientificArticleFormData,
  ScientificArticleSchema,
} from '@/zod/scientific-article';
import { FileUploader, Layout } from '@/components';
import useEditScientificArticle from './edit-article.hook';
import CreateTagForm from '@/views/monographs/create-monograph/create-tag-form';
import AuthorForm from '../create-article/author-form';
import CreateCategoryForm from '../create-article/create-category-form';

const EditScientificArticleView = () => {
  const [isPdfUploading, setIsPdfUploading] = useState<boolean>(false);
  const [initialData, setInitialData] =
    useState<ScientificArticleFormData | null>(null);
  const router = useRouter();
  const { id } = router.query;
  const { openDialog, closeDialog } = useDialog();
  const { errorMsg, loading, editScientificArticle, fetchScientificArticle } =
    useEditScientificArticle();

  const [tagError, setTagError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    reset,
  } = useZodForm<ScientificArticleFormData>(ScientificArticleSchema, {
    authors: [{ name: '' }],
    keywords: [],
    tags: [],
    categories: [],
    references: [],
  });

  const { fields, append, remove } = useFieldArray<
    ScientificArticleFormData,
    'authors'
  >({
    control,
    name: 'authors',
  });

  const {
    fields: keywordFields,
    append: appendKeyword,
    remove: removeKeyword,
  } = useFieldArray({
    control,
    name: 'keywords' as 'authors',
  });
  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchScientificArticle(id).then(
        (data: ScientificArticleFormData | null) => {
          if (data) {
            setInitialData(data);
            reset({
              ...data,
              publishedAt: data.publishedAt.split('T')[0], // Format date for input
            });
          }
        }
      );
    }
  }, [id, reset, fetchScientificArticle]);

  const handleCreateTag = async (tagData: {
    name: string;
  }): Promise<boolean> => {
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

  const handleCreateCategory = async (categoryData: {
    name: string;
    description: string;
  }): Promise<void> => {
    try {
      setCategoryError(null);
      const currentCategories = getValues().categories || [];
      setValue('categories', [...currentCategories, categoryData.name]);
      closeDialog();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao criar categoria';
      setCategoryError(message);
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

  const handleOpenAuthorDialog = () => {
    openDialog(
      <AuthorForm
        onSubmit={(
          authorData:
            | {
                name: string;
                email?: string | undefined;
                affiliation?: string | undefined;
              }
            | {
                name: string;
                email?: string | undefined;
                affiliation?: string | undefined;
              }[]
        ) => {
          append(authorData);
          closeDialog();
        }}
        onCancel={() => closeDialog()}
      />,
      {
        title: 'Adicionar Autor',
        size: 'md',
        showClose: true,
      }
    );
  };

  const handleFormSubmit = async (data: ScientificArticleFormData) => {
    if (id && typeof id === 'string') {
      await editScientificArticle(id, data);
    }
  };

  const removeTag = (indexToRemove: number) => {
    const currentTags = getValues().tags || [];
    const newTags = currentTags.filter((_, index) => index !== indexToRemove);
    setValue('tags', newTags);
  };

  const removeCategory = (indexToRemove: number) => {
    const currentCategories = getValues().categories || [];
    const newCategories = currentCategories.filter(
      (_, index) => index !== indexToRemove
    );
    setValue('categories', newCategories);
  };

  const addKeyword = () => {
    appendKeyword({ name: '' });
  };

  const currentTags = getValues().tags || [];
  const currentCategories = getValues().categories || [];

  if (!initialData) {
    return (
      <Layout hasGoBack>
        <Box variant="container">
          <Div
            p="L"
            mx="auto"
            width="100%"
            display="flex"
            justifyContent="center"
          >
            <Typography variant="body" size="medium" color="text">
              Carregando...
            </Typography>
          </Div>
        </Box>
      </Layout>
    );
  }

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
            Editar Artigo Científico
          </Typography>

          <Form onSubmit={handleSubmit(handleFormSubmit)} width="100%">
            <FormField<ScientificArticleFormData>
              name="title"
              label="Título do Artigo"
              type="text"
              placeholder="Título da pesquisa ou estudo"
              control={control}
              error={errors.title?.message}
            />

            <FormField<ScientificArticleFormData>
              name="abstract"
              label="Resumo"
              type="textarea"
              placeholder="Resumo do artigo"
              control={control}
              error={errors.abstract?.message}
            />

            <Div mb="M">
              <Typography variant="body" size="medium" color="text" mb="S">
                Palavras-chave
              </Typography>
              {keywordFields.map((field, index) => (
                <Div key={field.id} display="flex" alignItems="center" mb="S">
                  <FormField<ScientificArticleFormData>
                    name={`keywords.${index}`}
                    type="text"
                    label="Keywords"
                    placeholder="Palavra-chave"
                    control={control}
                    error={errors.keywords?.[index]?.message}
                  />
                  <Button
                    ml="S"
                    size="medium"
                    type="button"
                    variant="neutral"
                    onClick={() => removeKeyword(index)}
                  >
                    ×
                  </Button>
                </Div>
              ))}
              <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={addKeyword}
              >
                Adicionar Palavra-chave
              </Button>
            </Div>

            <FormField<ScientificArticleFormData>
              name="doi"
              label="DOI"
              type="text"
              placeholder="Digital Object Identifier"
              control={control}
              error={errors.doi?.message}
            />

            <FormField<ScientificArticleFormData>
              name="journal"
              label="Revista/Journal"
              type="text"
              placeholder="Nome da revista onde foi publicado"
              control={control}
              error={errors.journal?.message}
            />

            <Div display="grid" gridTemplateColumns="1fr 1fr" gap="M">
              <FormField<ScientificArticleFormData>
                name="volume"
                label="Volume"
                type="text"
                placeholder="Volume"
                control={control}
                error={errors.volume?.message}
              />

              <FormField<ScientificArticleFormData>
                name="issue"
                label="Edição"
                type="text"
                placeholder="Número da edição"
                control={control}
                error={errors.issue?.message}
              />
            </Div>

            <FormField<ScientificArticleFormData>
              name="pages"
              label="Páginas"
              type="text"
              placeholder="Ex: 123-145"
              control={control}
              error={errors.pages?.message}
            />

            <FormField<ScientificArticleFormData>
              name="publishedAt"
              label="Data de Publicação"
              type="date"
              control={control}
              error={errors.publishedAt?.message}
            />

            <SelectField<ScientificArticleFormData>
              name="license"
              label="Licença"
              control={control}
              error={errors.license?.message}
              options={Object.values(LicenseType).map((license) => ({
                value: license,
                label: license
                  .split('_')
                  .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
                  .join(' '),
              }))}
            />

            <FileUploader
              onUploadStart={() => setIsPdfUploading(true)}
              onUploadComplete={(file) => {
                setValue('url', file.url);
                setIsPdfUploading(false);
              }}
              folder={`scientific-articles/pdfs`}
              accept={['application/pdf']}
              single={true}
              label="Upload PDF File"
            />

            <Div mb="M">
              <Typography variant="body" size="medium" color="text" mb="S">
                Autores
              </Typography>
              {fields.map((field, index) => (
                <Div
                  key={field.id}
                  mb="M"
                  p="M"
                  border="1px solid"
                  borderColor="border"
                >
                  <FormField<ScientificArticleFormData>
                    name={`authors.${index}.name`}
                    label="Nome do Autor"
                    type="text"
                    placeholder="Nome completo do autor"
                    control={control}
                    error={errors.authors?.[index]?.name?.message}
                  />
                  <FormField<ScientificArticleFormData>
                    name={`authors.${index}.affiliation`}
                    label="Afiliação"
                    type="text"
                    placeholder="Instituição/Universidade"
                    control={control}
                    error={errors.authors?.[index]?.affiliation?.message}
                  />
                  <FormField<ScientificArticleFormData>
                    name={`authors.${index}.email`}
                    label="Email"
                    type="email"
                    placeholder="email@exemplo.com"
                    control={control}
                    error={errors.authors?.[index]?.email?.message}
                  />
                  <Button
                    size="medium"
                    type="button"
                    variant="neutral"
                    onClick={() => remove(index)}
                  >
                    Remover Autor
                  </Button>
                </Div>
              ))}
              <Button
                size="medium"
                type="button"
                variant="secondary"
                onClick={handleOpenAuthorDialog}
              >
                Adicionar Autor
              </Button>
            </Div>

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
            </Div>

            <Div mb="M">
              <Div display="grid" gap="M">
                <Typography variant="body" size="medium" color="text">
                  Categorias
                </Typography>
                <Button
                  size="medium"
                  variant="secondary"
                  onClick={handleOpenCreateCategoryDialog}
                >
                  Adicionar Categoria
                </Button>
              </Div>

              <Div mt="M" gap="S" display="flex" flexWrap="wrap">
                {currentCategories.map((category: string, index: number) => (
                  <Div
                    key={index}
                    p="XS"
                    bg="secondary"
                    color="white"
                    borderRadius="S"
                    fontSize="S"
                    display="flex"
                    alignItems="center"
                  >
                    {category}
                    <Button
                      size="medium"
                      ml="XS"
                      variant="neutral"
                      color="white"
                      onClick={() => removeCategory(index)}
                      type="button"
                    >
                      ×
                    </Button>
                  </Div>
                ))}
              </Div>
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
              <SubmitButton
                loading={isSubmitting || loading || isPdfUploading}
                isValid={!isSubmitting || !loading || !isPdfUploading}
              >
                {isSubmitting || loading
                  ? 'Atualizando artigo...'
                  : isPdfUploading
                    ? 'Fazendo upload do PDF...'
                    : 'Atualizar Artigo'}
              </SubmitButton>
            </Box>
          </Form>
        </Div>
      </Box>
    </Layout>
  );
};

export default EditScientificArticleView;
