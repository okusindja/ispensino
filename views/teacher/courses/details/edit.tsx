import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Div, Li, Ul } from '@stylin.js/elements';
import {
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Calendar,
  DollarSign,
  BookOpen,
  Globe,
  Lock,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
} from 'lucide-react';

import { FileUploader, Layout } from '@/components';
import { Box, Button } from '@/elements';
import { Typography } from '@/elements/typography';
import { TextField } from '@/components/text-field';
import { SelectField } from '@/components/select-field';
import { fetcherWithCredentials } from '@/constants/fetchers';
import { useDialog } from '@/contexts';

// Validation schema
const courseSchema = z.object({
  title: z
    .string()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título não pode exceder 100 caracteres'),
  description: z
    .string()
    .min(10, 'A descrição deve ter pelo menos 10 caracteres')
    .max(2000, 'A descrição não pode exceder 2000 caracteres'),
  price: z.string().optional(),
  startDate: z.string().optional(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  isPublished: z.boolean().optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface EditCourseViewProps {
  courseId: string;
  initialCourse?: any;
}

const EditCourseView = ({ courseId, initialCourse }: EditCourseViewProps) => {
  const router = useRouter();
  const { openDialog } = useDialog();

  const [course, setCourse] = useState(initialCourse);
  const [isLoading, setIsLoading] = useState(!initialCourse);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(
    initialCourse?.thumbnail || null
  );
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCourse?.categories?.map((cat: any) => cat.id) || []
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: initialCourse?.title || '',
      description: initialCourse?.description || '',
      price: initialCourse?.price?.toString() || '0',
      startDate: initialCourse?.startDate
        ? new Date(initialCourse.startDate).toISOString().split('T')[0]
        : '',
      level: initialCourse?.level || 'BEGINNER',
      isPublished: initialCourse?.isPublished || false,
    },
  });

  const price = watch('price');
  const isFree = !price || parseFloat(price) <= 0;

  // Fetch course data if not provided
  useEffect(() => {
    if (!initialCourse && courseId) {
      fetchCourseData();
    }
  }, [courseId, initialCourse]);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCourseData = async () => {
    setIsLoading(true);
    try {
      const response = await fetcherWithCredentials(`/api/courses/${courseId}`);
      if (!response.ok) throw new Error('Falha ao carregar o curso');

      const data = await response.json();
      setCourse(data);

      // Reset form with new data
      reset({
        title: data.title,
        description: data.description,
        price: data.price?.toString() || '0',
        startDate: data.startDate
          ? new Date(data.startDate).toISOString().split('T')[0]
          : '',
        level: data.level,
        isPublished: data.isPublished,
      });

      setThumbnail(data.thumbnail);
      setSelectedCategories(data.categories?.map((cat: any) => cat.id) || []);
    } catch (error) {
      setServerError('Não foi possível carregar os dados do curso');
      console.error('Error fetching course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleUpdateCourse = async (data: CourseFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    setServerSuccess(null);

    try {
      const response = await fetcherWithCredentials(
        `/api/courses/${courseId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            thumbnail,
            categories: selectedCategories,
            price: isFree ? null : parseFloat(data.price || '0'),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao atualizar o curso');
      }

      const result = await response.json();
      setServerSuccess('Curso atualizado com sucesso!');

      // Update local state
      setCourse(result.course);

      // Redirect after delay
      setTimeout(() => {
        router.push(`/teacher/courses/${courseId}`);
      }, 1500);
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : 'Ocorreu um erro inesperado'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = () => {
    openDialog(
      <DeleteConfirmationDialog
        courseId={courseId}
        courseTitle={course?.title}
        onSuccess={() => router.push('/teacher/courses')}
      />,
      {
        title: 'Confirmar Eliminação',
        size: 'md',
        showClose: true,
      }
    );
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'Iniciante';
      case 'INTERMEDIATE':
        return 'Intermediário';
      case 'ADVANCED':
        return 'Avançado';
      default:
        return level;
    }
  };

  if (isLoading) {
    return (
      <Layout hasGoBack>
        <Box variant="container" py="XL">
          <Div
            width="100%"
            gridColumn="1/-1"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="60vh"
            gap="M"
          >
            <Div
              width="3rem"
              height="3rem"
              borderWidth="3px"
              borderStyle="solid"
              borderTopColor="primary"
              borderRightColor="transparent"
              borderBottomColor="transparent"
              borderLeftColor="transparent"
              borderRadius="50%"
              animation="spin 1s linear infinite"
            />
            <Typography size="small" variant="body">
              A carregar curso...
            </Typography>
          </Div>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout hasGoBack>
      <Box variant="container" py="XL">
        {/* Header */}
        <Div width="100%" gridColumn="1/-1" mb="XL">
          <Button
            variant="primaryVariant"
            size="small"
            mb="M"
            onClick={() => router.push(`/teacher/courses/${courseId}`)}
          >
            <ArrowLeft size={16} />
            Voltar ao Curso
          </Button>

          <Typography color="text" variant="title" size="large" mb="XS">
            Editar Curso
          </Typography>
          <Typography color="textVariant" size="small" variant={'body'}>
            Atualize os detalhes do seu curso
          </Typography>
        </Div>

        {/* Error/Success Messages */}
        {serverError && (
          <Div
            width="100%"
            gridColumn="1/-1"
            mb="L"
            p="M"
            borderRadius="M"
            backgroundColor="error"
            color="white"
            display="flex"
            alignItems="center"
            gap="S"
          >
            <AlertCircle size={18} />
            <Typography variant="body" size="small">
              {serverError}
            </Typography>
          </Div>
        )}

        {serverSuccess && (
          <Div
            width="100%"
            gridColumn="1/-1"
            mb="L"
            p="M"
            borderRadius="M"
            backgroundColor="success"
            color="white"
            display="flex"
            alignItems="center"
            gap="S"
          >
            <CheckCircle size={18} />
            <Typography variant="body" size="small">
              {serverSuccess}
            </Typography>
          </Div>
        )}

        <form onSubmit={handleSubmit(handleUpdateCourse)}>
          <Div
            width="100%"
            gridColumn="1/-1"
            display="grid"
            gridTemplateColumns={['1fr', '1fr', '2fr 1fr', '2fr 1fr']}
            gap="L"
          >
            {/* Left Column - Main Course Details */}
            <Div>
              {/* Thumbnail Upload */}
              <Div mb="L">
                <Typography
                  variant="body"
                  size="small"
                  fontWeight="500"
                  mb="M"
                  color="text"
                >
                  Imagem de Capa
                </Typography>

                {thumbnail ? (
                  <Div position="relative" mb="M">
                    <Div
                      width="100%"
                      height="200px"
                      borderRadius="M"
                      backgroundImage={`url(${thumbnail})`}
                      backgroundSize="cover"
                      backgroundPosition="center"
                      nHover={{ opacity: 0.9 }}
                    />
                    <Button
                      type="button"
                      variant="primaryVariant"
                      size="small"
                      color="error"
                      position="absolute"
                      top="M"
                      right="M"
                      onClick={() => setThumbnail(null)}
                    >
                      <X size={14} />
                      Remover
                    </Button>
                  </Div>
                ) : (
                  <Div
                    p="XL"
                    borderRadius="M"
                    border="2px dashed"
                    borderColor="outline"
                    backgroundColor="surface"
                    textAlign="center"
                    nHover={{
                      borderColor: 'primary',
                      backgroundColor: 'primaryLight',
                    }}
                    transition="all 0.2s ease"
                  >
                    <FileUploader
                      onUploadStart={() => setThumbnailUploading(true)}
                      onUploadComplete={(file) => {
                        setThumbnail(file.url);
                        setThumbnailUploading(false);
                      }}
                      folder={`courses/${courseId}/thumbnails`}
                      accept={['image/*']}
                      single={true}
                      label="Carregar Imagem de Capa. Recomendado: 1280x720px (16:9)"
                    />
                  </Div>
                )}

                {thumbnailUploading && (
                  <Div display="flex" alignItems="center" gap="S" mt="M">
                    <Loader2 size={16} className="animate-spin" />
                    <Typography
                      variant="body"
                      size="extraSmall"
                      color="textVariant"
                    >
                      A carregar imagem...
                    </Typography>
                  </Div>
                )}
              </Div>

              {/* Title & Description */}
              <Div mb="L">
                <Typography
                  variant="body"
                  size="small"
                  fontWeight="500"
                  mb="M"
                  color="text"
                >
                  Título do Curso *
                </Typography>
                <TextField
                  {...register('title')}
                  placeholder="Ex: Introdução ao JavaScript Moderno"
                  supportingText={errors.title?.message}
                  required
                />
              </Div>

              <Div mb="L">
                <Typography
                  variant="body"
                  size="small"
                  fontWeight="500"
                  mb="M"
                  color="text"
                >
                  Descrição do Curso *
                </Typography>
                <TextField
                  {...register('description')}
                  placeholder="Descreva o que os estudantes vão aprender neste curso..."
                  supportingText={errors.description?.message}
                  required
                />
              </Div>
            </Div>

            {/* Right Column - Course Settings */}
            <Div>
              {/* Price */}
              <Div mb="L">
                <Typography
                  variant="body"
                  size="small"
                  fontWeight="500"
                  mb="M"
                  color="text"
                >
                  Preço do Curso
                </Typography>
                <TextField
                  type="number"
                  {...register('price')}
                  placeholder="0.00"
                  Prefix={<DollarSign size={16} />}
                  Suffix="AOA"
                  min="0"
                  step="0.01"
                  disabled={isFree}
                />
                <Div display="flex" alignItems="center" gap="M" mt="M">
                  <input
                    id="isFree"
                    type="checkbox"
                    checked={isFree}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setValue('price', '0');
                      }
                    }}
                    className="h-4 w-4 text-primary focus:ring-primary border-outline rounded"
                  />
                  <label htmlFor="isFree" className="text-sm text-text">
                    Curso Gratuito
                  </label>
                </Div>
                {!isFree && (
                  <Typography
                    variant="body"
                    size="extraSmall"
                    color="textVariant"
                    mt="XS"
                  >
                    Deixe em 0 para tornar o curso gratuito
                  </Typography>
                )}
              </Div>

              {/* Level */}
              <Div mb="L">
                <Typography
                  variant="body"
                  size="small"
                  fontWeight="500"
                  mb="M"
                  color="text"
                >
                  Nível do Curso
                </Typography>
                <SelectField
                  value={watch('level')}
                  onChange={(e) => setValue('level', e.target.value as any)}
                >
                  <option value="BEGINNER">Iniciante</option>
                  <option value="INTERMEDIATE">Intermediário</option>
                  <option value="ADVANCED">Avançado</option>
                </SelectField>
              </Div>

              {/* Start Date */}
              <Div mb="L">
                <Typography
                  variant="body"
                  size="small"
                  fontWeight="500"
                  mb="M"
                  color="text"
                >
                  Data de Início
                </Typography>
                <TextField
                  type="date"
                  {...register('startDate')}
                  Prefix={<Calendar size={16} />}
                />
              </Div>

              {/* Categories */}
              {categories.length > 0 && (
                <Div mb="L">
                  <Typography
                    variant="body"
                    size="small"
                    fontWeight="500"
                    mb="M"
                    color="text"
                  >
                    Categorias
                  </Typography>
                  <Div
                    maxHeight="200px"
                    overflowY="auto"
                    borderRadius="M"
                    border="1px solid"
                    borderColor="outline"
                    backgroundColor="surface"
                    p="M"
                  >
                    {categories.map((category) => (
                      <Div key={category.id} mb="XS">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCategories([
                                  ...selectedCategories,
                                  category.id,
                                ]);
                              } else {
                                setSelectedCategories(
                                  selectedCategories.filter(
                                    (id) => id !== category.id
                                  )
                                );
                              }
                            }}
                            className="h-4 w-4 text-primary focus:ring-primary border-outline rounded"
                          />
                          <span className="text-sm text-text">
                            {category.name}
                          </span>
                        </label>
                      </Div>
                    ))}
                  </Div>
                </Div>
              )}

              {/* Publishing Status */}
              <Div mb="L">
                <Typography
                  variant="body"
                  size="small"
                  fontWeight="500"
                  mb="M"
                  color="text"
                >
                  Estado de Publicação
                </Typography>
                <Div display="flex" alignItems="center" gap="M">
                  <Button
                    type="button"
                    variant={
                      watch('isPublished') ? 'primary' : 'primaryVariant'
                    }
                    size="small"
                    onClick={() => setValue('isPublished', true)}
                  >
                    <Globe size={14} />
                    Público
                  </Button>
                  <Button
                    type="button"
                    variant={
                      !watch('isPublished') ? 'primary' : 'primaryVariant'
                    }
                    size="small"
                    onClick={() => setValue('isPublished', false)}
                  >
                    <Lock size={14} />
                    Rascunho
                  </Button>
                </Div>
                <Typography
                  variant="body"
                  size="extraSmall"
                  color="textVariant"
                  mt="XS"
                >
                  {watch('isPublished')
                    ? 'O curso está visível para todos os estudantes'
                    : 'O curso está visível apenas para si'}
                </Typography>
              </Div>

              {/* Course Stats (Read-only) */}
              <Div
                p="L"
                borderRadius="M"
                border="1px solid"
                borderColor="outline"
                backgroundColor="surface"
              >
                <Typography
                  variant="body"
                  size="small"
                  fontWeight="500"
                  mb="M"
                  color="text"
                >
                  Estatísticas do Curso
                </Typography>
                <Div display="flex" flexDirection="column" gap="XS">
                  <Div display="flex" justifyContent="space-between">
                    <Typography
                      variant="body"
                      size="extraSmall"
                      color="textVariant"
                    >
                      Aulas
                    </Typography>
                    <Typography
                      variant="body"
                      size="extraSmall"
                      fontWeight="500"
                    >
                      {course?._count?.lessons || 0}
                    </Typography>
                  </Div>
                  <Div display="flex" justifyContent="space-between">
                    <Typography
                      variant="body"
                      size="extraSmall"
                      color="textVariant"
                    >
                      Inscrições
                    </Typography>
                    <Typography
                      variant="body"
                      size="extraSmall"
                      fontWeight="500"
                    >
                      {course?._count?.enrollments || 0}
                    </Typography>
                  </Div>
                  <Div display="flex" justifyContent="space-between">
                    <Typography
                      variant="body"
                      size="extraSmall"
                      color="textVariant"
                    >
                      Nível
                    </Typography>
                    <Typography
                      variant="body"
                      size="extraSmall"
                      fontWeight="500"
                      color={
                        getLevelLabel(watch('level')) === 'Iniciante'
                          ? 'success'
                          : getLevelLabel(watch('level')) === 'Intermediário'
                            ? 'warning'
                            : 'error'
                      }
                    >
                      {getLevelLabel(watch('level'))}
                    </Typography>
                  </Div>
                  <Div display="flex" justifyContent="space-between">
                    <Typography
                      variant="body"
                      size="extraSmall"
                      color="textVariant"
                    >
                      Estado
                    </Typography>
                    <Typography
                      variant="body"
                      size="extraSmall"
                      fontWeight="500"
                      color={watch('isPublished') ? 'success' : 'warning'}
                    >
                      {watch('isPublished') ? 'Publicado' : 'Rascunho'}
                    </Typography>
                  </Div>
                </Div>
              </Div>
            </Div>
          </Div>

          {/* Form Actions */}
          <Div
            width="100%"
            gridColumn="1/-1"
            pt="L"
            mt="L"
            borderTop="1px solid"
            borderTopColor="outline"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap="M"
          >
            <Button
              type="button"
              variant="primaryVariant"
              size="medium"
              onClick={handleDeleteCourse}
            >
              <X size={16} />
              Eliminar Curso
            </Button>

            <Div display="flex" gap="M">
              <Button
                type="button"
                variant="primaryVariant"
                size="medium"
                onClick={() => router.push(`/teacher/courses/${courseId}`)}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="medium"
                disabled={isSubmitting}
              >
                <Save size={16} />
                {isSubmitting ? 'A guardar...' : 'Guardar Alterações'}
              </Button>
            </Div>
          </Div>

          {/* Form Validation Summary */}
          {(errors.title || errors.description) && (
            <Div
              mt="L"
              p="M"
              borderRadius="M"
              backgroundColor="surface"
              border="1px solid"
              borderColor="outline"
            >
              <Typography
                variant="body"
                size="extraSmall"
                fontWeight="500"
                mb="XS"
                color="error"
              >
                Erros de Validação:
              </Typography>
              <Ul pl="M">
                {errors.title && (
                  <Li>
                    <Typography variant="body" size="extraSmall" color="error">
                      • {errors.title.message}
                    </Typography>
                  </Li>
                )}
                {errors.description && (
                  <Li>
                    <Typography variant="body" size="extraSmall" color="error">
                      • {errors.description.message}
                    </Typography>
                  </Li>
                )}
              </Ul>
            </Div>
          )}
        </form>
      </Box>
    </Layout>
  );
};

// Delete Confirmation Dialog Component
const DeleteConfirmationDialog = ({
  courseId,
  courseTitle,
  onSuccess,
}: any) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');

    try {
      const response = await fetcherWithCredentials(
        `/api/courses/${courseId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao eliminar o curso');
      }

      onSuccess();
      // Close dialog
      (
        document.querySelector('[data-radix-dialog-close]') as HTMLElement
      )?.click();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Ocorreu um erro inesperado'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Div p="XL">
      <Div
        mb="L"
        p="M"
        borderRadius="M"
        border="1px solid"
        borderColor="error"
        backgroundColor="surface"
      >
        <Div display="flex" alignItems="center" gap="S" mb="XS">
          <AlertCircle size={16} color="var(--colors-error)" />
          <Typography
            variant="body"
            size="small"
            fontWeight="500"
            color="error"
          >
            Atenção: Esta ação é irreversível
          </Typography>
        </Div>
        <Typography variant="body" size="extraSmall" color="textVariant">
          Você está prestes a eliminar permanentemente o curso "{courseTitle}".
          Esta ação eliminará todas as aulas, materiais e dados associados ao
          curso.
        </Typography>
      </Div>

      {error && (
        <Div
          mb="L"
          p="M"
          borderRadius="M"
          backgroundColor="error"
          color="white"
        >
          <Typography variant="body" size="small">
            {error}
          </Typography>
        </Div>
      )}

      <Div display="flex" justifyContent="flex-end" gap="M">
        <Button
          variant="primaryVariant"
          size="medium"
          onClick={() =>
            (
              document.querySelector('[data-radix-dialog-close]') as HTMLElement
            )?.click()
          }
          disabled={isDeleting}
        >
          Cancelar
        </Button>
        <Button
          variant="primaryVariant"
          size="medium"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <X size={16} />
          {isDeleting ? 'A eliminar...' : 'Eliminar Permanentemente'}
        </Button>
      </Div>
    </Div>
  );
};

export default EditCourseView;
