import { zodResolver } from '@hookform/resolvers/zod';
import { MediaType } from '@prisma/client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Div, Form, Li, Ul } from '@stylin.js/elements';

import { FileUploader } from '@/components';
import { fetcherWithCredentials } from '@/constants/fetchers';
import { Box, Button } from '@/elements';
import { Typography } from '@/elements/typography';
import { TextField } from '@/components/text-field';
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  File,
  Clock,
  PlayCircle,
  Video,
  FileText,
} from 'lucide-react';

// Zod validation schema
const lessonSchema = z.object({
  title: z
    .string()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título não pode exceder 100 caracteres'),
  description: z
    .string()
    .min(10, 'A descrição deve ter pelo menos 10 caracteres')
    .max(1000, 'A descrição não pode exceder 1000 caracteres'),
  estimatedTime: z.coerce
    .number()
    .min(1, 'O tempo estimado deve ser pelo menos 1 minuto')
    .optional(),
  isPreview: z.boolean().default(false).optional(),
  order: z.coerce.number().min(1, 'A ordem deve ser pelo menos 1').optional(),
});

type LessonFormData = z.infer<typeof lessonSchema>;

interface LessonFormProps {
  courseId: string;
  onSuccess: () => void;
}

const LessonForm: React.FC<LessonFormProps> = ({ courseId, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [materials, setMaterials] = useState<
    { name: string; url: string; type: MediaType }[]
  >([]);
  const [videoUploading, setVideoUploading] = useState(false);
  const [materialsUploading, setMaterialsUploading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      isPreview: false,
      estimatedTime: 30,
      order: 1,
    },
  });

  const handleSubmitLesson = async (data: LessonFormData) => {
    if (!videoUrl) {
      setServerError('O vídeo é obrigatório');
      return;
    }

    setIsSubmitting(true);
    setServerError(null);
    setServerSuccess(null);

    try {
      const response = await fetch(`/api/courses/${courseId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          videoUrl,
          materials: materials.map((mat) => ({
            name: mat.name,
            url: mat.url,
            type: mat.type,
          })),
        }),
        credentials: 'include',
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Falha ao criar a aula');
      }

      setServerSuccess('Aula criada com sucesso!');

      // Reset form
      reset();
      setVideoUrl('');
      setMaterials([]);

      // Call success callback after delay
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          // Default redirect if no callback provided
          window.location.href = `/teacher/courses/${courseId}`;
        }
      }, 1500);
    } catch (error) {
      console.error('Erro de submissão:', error);
      setServerError(
        error instanceof Error ? error.message : 'Ocorreu um erro inesperado'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMediaTypeIcon = (type: MediaType) => {
    switch (type) {
      case 'PDF':
        return <FileText size={16} />;
      case 'IMAGE':
        return <File size={16} />;
      case 'VIDEO':
        return <PlayCircle size={16} />;
      case 'AUDIO':
        return <File size={16} />;
      default:
        return <File size={16} />;
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleSubmitLesson)}>
      {/* Error/Success Messages */}
      {serverError && (
        <Div
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

      {/* Two Column Layout for Basic Info */}
      <Div
        display="grid"
        gridTemplateColumns={['1fr', '1fr', '2fr 1fr', '2fr 1fr']}
        gap="L"
        mb="L"
      >
        {/* Left Column - Title & Description */}
        <Div>
          <Div mb="L">
            <Typography
              variant="body"
              size="small"
              fontWeight="500"
              mb="M"
              color="text"
            >
              Título da Aula *
            </Typography>
            <TextField
              {...register('title')}
              placeholder="Introdução à Álgebra"
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
              Descrição *
            </Typography>
            <TextField
              {...register('description')}
              placeholder="Descreva o que os estudantes vão aprender nesta aula..."
              supportingText={errors.description?.message}
              required
            />
          </Div>
        </Div>

        {/* Right Column - Metadata */}
        <Div>
          <Div mb="L">
            <Typography
              variant="body"
              size="small"
              fontWeight="500"
              mb="M"
              color="text"
            >
              Tempo Estimado (minutos)
            </Typography>
            <TextField
              type="number"
              {...register('estimatedTime')}
              placeholder="30"
              Prefix={<Clock size={16} />}
              supportingText={errors.estimatedTime?.message}
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
              Ordem da Aula
            </Typography>
            <TextField
              type="number"
              {...register('order')}
              placeholder="1"
              supportingText={errors.order?.message}
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
              Visibilidade
            </Typography>
            <Div display="flex" alignItems="center" gap="M">
              <input
                id="isPreview"
                type="checkbox"
                {...register('isPreview')}
              />
              <Typography variant="body" size="small">
                Disponível como pré-visualização
              </Typography>
            </Div>
          </Div>
        </Div>
      </Div>

      {/* Video Upload Section */}
      <Div mb="L">
        <Div display="flex" alignItems="center" gap="S" mb="M">
          <Video size={20} color="var(--colors-primary)" />
          <Typography variant="body" size="small" fontWeight="500" color="text">
            Vídeo da Aula *
          </Typography>
        </Div>

        {videoUrl ? (
          <Div
            p="L"
            borderRadius="M"
            border="1px solid"
            borderColor="success"
            backgroundColor="successLight"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb="M"
          >
            <Div display="flex" alignItems="center" gap="M">
              <Div
                width="48px"
                height="48px"
                borderRadius="M"
                backgroundColor="success"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <PlayCircle size={24} color="white" />
              </Div>
              <Div>
                <Typography
                  variant="body"
                  size="small"
                  fontWeight="500"
                  color="text"
                >
                  Vídeo carregado com sucesso
                </Typography>
                <Typography
                  variant="body"
                  size="extraSmall"
                  color="textVariant"
                >
                  Pronto para ser utilizado na aula
                </Typography>
              </Div>
            </Div>
            <Button
              type="button"
              variant="primaryVariant"
              size="small"
              color="error"
              onClick={() => setVideoUrl('')}
            >
              <XCircle size={16} />
              Remover
            </Button>
          </Div>
        ) : (
          <Div
            p="L"
            borderRadius="M"
            border="2px dashed"
            borderColor="outline"
            backgroundColor="surface"
            nHover={{
              borderColor: 'primary',
              backgroundColor: 'primaryVariant',
            }}
            transition="all 0.2s ease"
          >
            <FileUploader
              onUploadStart={() => setVideoUploading(true)}
              onUploadComplete={(file) => {
                setVideoUrl(file.url);
                setVideoUploading(false);
              }}
              folder={`courses/${courseId}/videos`}
              accept={['video/*']}
              single={true}
              label="Carregar Ficheiro de Vídeo. MP4, MOV, AVI, etc. (máx. 500MB)"
            />
          </Div>
        )}

        {videoUploading && (
          <Div display="flex" alignItems="center" gap="S" mt="M">
            <Div
              width="16px"
              height="16px"
              borderWidth="2px"
              borderStyle="solid"
              borderTopColor="primary"
              borderRightColor="transparent"
              borderBottomColor="transparent"
              borderLeftColor="transparent"
              borderRadius="50%"
              animation="spin 1s linear infinite"
            />
            <Typography variant="body" size="extraSmall" color="textVariant">
              A carregar vídeo...
            </Typography>
          </Div>
        )}
      </Div>

      {/* Materials Upload Section */}
      <Div mb="L">
        <Div display="flex" alignItems="center" gap="S" mb="M">
          <FileText size={20} color="var(--colors-primary)" />
          <Typography variant="body" size="small" fontWeight="500" color="text">
            Materiais da Aula
          </Typography>
        </Div>

        <Div
          p="L"
          borderRadius="M"
          border="2px dashed"
          borderColor="outline"
          backgroundColor="surface"
          mb="M"
          nHover={{ borderColor: 'primary', backgroundColor: 'primaryVariant' }}
          transition="all 0.2s ease"
        >
          <FileUploader
            onUploadStart={() => setMaterialsUploading(true)}
            onUploadComplete={(file) => {
              setMaterials((prev) => [
                ...prev,
                {
                  name: file.url.split('/').pop() || 'Material',
                  url: file.url,
                  type: file.type,
                },
              ]);
              setMaterialsUploading(false);
            }}
            folder={`courses/${courseId}/materials`}
            label="Carregar Materiais. PDF, Imagens, Documentos, etc."
          />
        </Div>

        {materialsUploading && (
          <Div display="flex" alignItems="center" gap="S" mb="M">
            <Div
              width="16px"
              height="16px"
              borderWidth="2px"
              borderStyle="solid"
              borderTopColor="primary"
              borderRightColor="transparent"
              borderBottomColor="transparent"
              borderLeftColor="transparent"
              borderRadius="50%"
              animation="spin 1s linear infinite"
            />
            <Typography variant="body" size="extraSmall" color="textVariant">
              A carregar materiais...
            </Typography>
          </Div>
        )}

        {/* Materials List */}
        {materials.length > 0 && (
          <Div>
            <Typography
              variant="body"
              size="small"
              fontWeight="500"
              mb="M"
              color="text"
            >
              Materiais Carregados ({materials.length})
            </Typography>
            <Div
              borderRadius="M"
              border="1px solid"
              borderColor="outline"
              backgroundColor="surface"
              overflow="hidden"
            >
              {materials.map((material, index) => (
                <Div
                  key={index}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  p="M"
                  borderBottom={
                    index < materials.length - 1 ? '1px solid' : 'none'
                  }
                  borderBottomColor="outline"
                  nHover={{ backgroundColor: 'surface' }}
                >
                  <Div display="flex" alignItems="center" gap="M" flex="1">
                    <Div
                      width="40px"
                      height="40px"
                      borderRadius="M"
                      backgroundColor="primaryVariant"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {getMediaTypeIcon(material.type)}
                    </Div>
                    <Div flex="1">
                      <TextField
                        value={material.name}
                        onChange={(e) => {
                          const updated = [...materials];
                          updated[index].name = e.target.value;
                          setMaterials(updated);
                        }}
                        placeholder="Nome do material"
                      />
                      <Typography
                        variant="body"
                        size="extraSmall"
                        color="textVariant"
                        mt="XS"
                      >
                        {material.url.split('/').pop()}
                      </Typography>
                    </Div>
                  </Div>
                  <Button
                    type="button"
                    variant="primaryVariant"
                    size="small"
                    color="error"
                    onClick={() =>
                      setMaterials((prev) => prev.filter((_, i) => i !== index))
                    }
                  >
                    <XCircle size={14} />
                    Remover
                  </Button>
                </Div>
              ))}
            </Div>
          </Div>
        )}
      </Div>

      {/* Form Actions */}
      <Div
        pt="L"
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
          onClick={() => window.history.back()}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="medium"
          disabled={
            isSubmitting || videoUploading || materialsUploading || !videoUrl
          }
        >
          {isSubmitting ? 'A criar aula...' : 'Criar Aula'}
        </Button>
      </Div>

      {/* Form Requirements */}
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
          color="textVariant"
          fontWeight="500"
          mb="XS"
        >
          Requisitos para criar a aula:
        </Typography>
        <Ul pl="M">
          <Li style={{ marginBottom: '4px' }}>
            <Typography
              variant="body"
              size="extraSmall"
              color={videoUrl ? 'success' : 'textVariant'}
            >
              {videoUrl ? '✓ Vídeo carregado' : '• Vídeo é obrigatório'}
            </Typography>
          </Li>
          <Li style={{ marginBottom: '4px' }}>
            <Typography variant="body" size="extraSmall" color="textVariant">
              • Título (3-100 caracteres)
            </Typography>
          </Li>
          <Li>
            <Typography variant="body" size="extraSmall" color="textVariant">
              • Descrição (10-1000 caracteres)
            </Typography>
          </Li>
        </Ul>
      </Div>
    </Form>
  );
};

export default LessonForm;
