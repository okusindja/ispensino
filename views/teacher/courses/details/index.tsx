import { Course, Lesson } from '@prisma/client';
import { Div } from '@stylin.js/elements';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import {
  Edit,
  Trash2,
  Plus,
  BookOpen,
  Clock,
  Users,
  DollarSign,
  Calendar,
  ChevronRight,
  PlayCircle,
  FileText,
  Video,
  Download,
  Share2,
  Eye,
  Lock,
  CheckCircle,
  BarChart3,
  Settings,
} from 'lucide-react';

import { Layout } from '@/components';
import { Box, Button } from '@/elements';
import { Typography } from '@/elements/typography';
import { useDialog } from '@/contexts';
interface CourseDetailsProps {
  course: Course & { lessons: Lesson[] };
}

const CourseDetails: FC<CourseDetailsProps> = ({ course }) => {
  const router = useRouter();
  const { openDialog } = useDialog();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'lessons' | 'analytics' | 'settings'
  >('overview');

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const calculateTotalDuration = () => {
    const totalMinutes = course.lessons.reduce((total, lesson) => {
      return total + (lesson.estimatedTime || 0);
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const handleDeleteCourse = () => {
    openDialog(
      <Div p="XL">
        <Typography variant="title" size="medium" mb="M" color="error">
          Confirmar Eliminação
        </Typography>
        <Typography variant="body" size="small" mb="L" color="textVariant">
          Tem a certeza que pretende eliminar o curso "{course.title}"? Esta
          ação é irreversível e eliminará todas as aulas e conteúdos associados.
        </Typography>
        <Div display="flex" justifyContent="flex-end" gap="M">
          <Button
            variant="primaryVariant"
            size="medium"
            onClick={() =>
              (
                document.querySelector(
                  '[data-radix-dialog-close]'
                ) as HTMLElement
              )?.click()
            }
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="medium"
            onClick={() => {
              // Handle delete logic here
              alert('Curso eliminado');
              (
                document.querySelector(
                  '[data-radix-dialog-close]'
                ) as HTMLElement
              )?.click();
              router.push('/teacher/courses');
            }}
          >
            <Trash2 size={16} />
            Eliminar Curso
          </Button>
        </Div>
      </Div>,
      {
        title: 'Eliminar Curso',
        size: 'md',
        showClose: true,
      }
    );
  };

  const handleShareCourse = () => {
    const shareUrl = `${window.location.origin}/courses/${course.slug}`;
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: course.description,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copiado para a área de transferência!');
    }
  };

  const getCourseLevelColor = () => {
    switch (course.level) {
      case 'BEGINNER':
        return 'success';
      case 'INTERMEDIATE':
        return 'warning';
      case 'ADVANCED':
        return 'error';
      default:
        return 'primary';
    }
  };

  const getCourseLevelLabel = () => {
    switch (course.level) {
      case 'BEGINNER':
        return 'Iniciante';
      case 'INTERMEDIATE':
        return 'Intermediário';
      case 'ADVANCED':
        return 'Avançado';
      default:
        return course.level;
    }
  };

  return (
    <Layout hasGoBack>
      <Box variant="container" py="XL">
        {/* Course Header */}
        <Div
          width="100%"
          gridColumn="1/-1"
          mb="XL"
          p="XL"
          borderRadius="L"
          backgroundImage={
            course.thumbnail
              ? `url(${course.thumbnail})`
              : 'linear-gradient(135deg, var(--colors-primary) 0%, var(--colors-primaryDark) 100%)'
          }
          backgroundSize="cover"
          backgroundPosition="center"
          position="relative"
          color="text"
        >
          {/* Overlay */}
          <Div
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            backgroundColor="surface"
            borderRadius="L"
          />

          <Div position="relative" zIndex="1">
            {/* Badge */}
            <Div
              display="inline-block"
              px="M"
              py="XS"
              borderRadius="M"
              backgroundColor={`var(--colors-${getCourseLevelColor()})`}
              mb="M"
            >
              <Typography variant="body" size="extraSmall" fontWeight="500">
                {getCourseLevelLabel()}
              </Typography>
            </Div>

            <Typography variant="title" size="medium" mb="XS">
              {course.title}
            </Typography>

            <Typography variant="body" size="medium" mb="L" opacity="0.9">
              {course.description}
            </Typography>

            {/* Course Stats */}
            <Div display="flex" gap="L" flexWrap="wrap" mb="XL">
              <Div display="flex" alignItems="center" gap="XS">
                <Clock size={18} />
                <Typography variant="body" size="small">
                  {calculateTotalDuration()}
                </Typography>
              </Div>

              <Div display="flex" alignItems="center" gap="XS">
                <BookOpen size={18} />
                <Typography variant="body" size="small">
                  {course.lessons.length} aulas
                </Typography>
              </Div>

              <Div display="flex" alignItems="center" gap="XS">
                <Calendar size={18} />
                <Typography variant="body" size="small">
                  Criado em {formatDate(course.createdAt)}
                </Typography>
              </Div>

              {course.price && course.price > 0 ? (
                <Div display="flex" alignItems="center" gap="XS">
                  <DollarSign size={18} />
                  <Typography variant="body" size="small" fontWeight="500">
                    {course.price.toLocaleString('pt-PT', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </Typography>
                </Div>
              ) : (
                <Div display="flex" alignItems="center" gap="XS">
                  <CheckCircle size={18} />
                  <Typography variant="body" size="small" fontWeight="500">
                    Gratuito
                  </Typography>
                </Div>
              )}
            </Div>

            {/* Action Buttons */}
            <Div display="flex" gap="M" flexWrap="wrap">
              <Button
                variant="primary"
                size="medium"
                onClick={() =>
                  router.push(`/teacher/courses/${course.slug}/edit`)
                }
              >
                <Edit size={16} />
                Editar Curso
              </Button>

              <Button
                variant="primaryVariant"
                size="medium"
                onClick={() =>
                  router.push(`/teacher/courses/${course.slug}/lessons/create`)
                }
              >
                <Plus size={16} />
                Adicionar Aula
              </Button>

              <Button
                variant="primaryVariant"
                size="medium"
                onClick={handleShareCourse}
              >
                <Share2 size={16} />
                Partilhar
              </Button>

              <Button
                variant="primaryVariant"
                size="medium"
                color="error"
                onClick={handleDeleteCourse}
              >
                <Trash2 size={16} />
                Eliminar
              </Button>
            </Div>
          </Div>
        </Div>

        {/* Tabs Navigation */}
        <Div
          width="100%"
          gridColumn="1/-1"
          mb="L"
          borderBottom="1px solid"
          borderBottomColor="outline"
        >
          <Div display="flex" gap="L" overflowX="auto">
            <Button
              variant="neutral"
              size="medium"
              onClick={() => setActiveTab('overview')}
              color={activeTab === 'overview' ? 'primary' : 'textVariant'}
              borderBottom={activeTab === 'overview' ? '2px solid' : 'none'}
              borderBottomColor="primary"
              borderRadius="0"
              pb="M"
            >
              <BookOpen size={16} style={{ marginRight: '8px' }} />
              Visão Geral
            </Button>

            <Button
              variant="neutral"
              size="medium"
              onClick={() => setActiveTab('lessons')}
              color={activeTab === 'lessons' ? 'primary' : 'textVariant'}
              borderBottom={activeTab === 'lessons' ? '2px solid' : 'none'}
              borderBottomColor="primary"
              borderRadius="0"
              pb="M"
            >
              <PlayCircle size={16} style={{ marginRight: '8px' }} />
              Aulas ({course.lessons.length})
            </Button>

            <Button
              variant="neutral"
              size="medium"
              onClick={() =>
                router.push(`/teacher/analytics?courseId=${course.id}`)
              }
              color="textVariant"
              borderRadius="0"
              pb="M"
            >
              <BarChart3 size={16} style={{ marginRight: '8px' }} />
              Análises
            </Button>

            <Button
              variant="neutral"
              size="medium"
              onClick={() => setActiveTab('settings')}
              color={activeTab === 'settings' ? 'primary' : 'textVariant'}
              borderBottom={activeTab === 'settings' ? '2px solid' : 'none'}
              borderBottomColor="primary"
              borderRadius="0"
              pb="M"
            >
              <Settings size={16} style={{ marginRight: '8px' }} />
              Configurações
            </Button>
          </Div>
        </Div>

        {/* Tab Content */}
        <Div width="100%" gridColumn="1/-1">
          {activeTab === 'overview' && (
            <Div
              display="grid"
              gridTemplateColumns={['1fr', '1fr', '2fr 1fr', '2fr 1fr']}
              gap="L"
            >
              {/* Left Column - Course Details */}
              <Div>
                <Div
                  p="XL"
                  borderRadius="M"
                  border="1px solid"
                  borderColor="outline"
                  backgroundColor="surface"
                  mb="L"
                >
                  <Typography variant="title" size="medium" mb="M">
                    Sobre este Curso
                  </Typography>

                  <Typography
                    variant="body"
                    size="small"
                    mb="L"
                    color="textVariant"
                  >
                    {course.description ||
                      'Este curso não tem uma descrição detalhada. Adicione uma descrição para ajudar os estudantes a entenderem melhor o conteúdo.'}
                  </Typography>

                  <Div
                    display="grid"
                    gridTemplateColumns="repeat(2, 1fr)"
                    gap="M"
                  >
                    <Div>
                      <Typography
                        variant="body"
                        size="extraSmall"
                        color="textVariant"
                        mb="XS"
                      >
                        Nível
                      </Typography>
                      <Div
                        display="inline-flex"
                        alignItems="center"
                        gap="XS"
                        px="M"
                        py="XS"
                        borderRadius="M"
                        backgroundColor={`${getCourseLevelColor()}Light`}
                      >
                        <Div
                          width="8px"
                          height="8px"
                          borderRadius="50%"
                          backgroundColor={getCourseLevelColor()}
                        />
                        <Typography
                          variant="body"
                          size="small"
                          color={getCourseLevelColor()}
                        >
                          {getCourseLevelLabel()}
                        </Typography>
                      </Div>
                    </Div>

                    <Div>
                      <Typography
                        variant="body"
                        size="extraSmall"
                        color="textVariant"
                        mb="XS"
                      >
                        Estado
                      </Typography>
                      <Div
                        display="inline-flex"
                        alignItems="center"
                        gap="XS"
                        px="M"
                        py="XS"
                        borderRadius="M"
                        backgroundColor={
                          course.isPublished ? 'successLight' : 'warningLight'
                        }
                      >
                        <Div
                          width="8px"
                          height="8px"
                          borderRadius="50%"
                          backgroundColor={
                            course.isPublished ? 'success' : 'warning'
                          }
                        />
                        <Typography
                          variant="body"
                          size="small"
                          color={course.isPublished ? 'success' : 'warning'}
                        >
                          {course.isPublished ? 'Publicado' : 'Rascunho'}
                        </Typography>
                      </Div>
                    </Div>

                    <Div>
                      <Typography
                        variant="body"
                        size="extraSmall"
                        color="textVariant"
                        mb="XS"
                      >
                        Preço
                      </Typography>
                      <Typography variant="body" size="small" fontWeight="500">
                        {course.isFree
                          ? 'Gratuito'
                          : `${course.price?.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}`}
                      </Typography>
                    </Div>

                    <Div>
                      <Typography
                        variant="body"
                        size="extraSmall"
                        color="textVariant"
                        mb="XS"
                      >
                        Data de Início
                      </Typography>
                      <Typography variant="body" size="small">
                        {course.startDate
                          ? formatDate(course.startDate)
                          : 'Não definida'}
                      </Typography>
                    </Div>
                  </Div>
                </Div>

                {/* Preview Button */}
                <Button
                  variant="primary"
                  size="large"
                  width="100%"
                  onClick={() => router.push(`/courses/${course.slug}`)}
                >
                  <Eye size={18} />
                  Ver Pré-visualização do Curso
                </Button>
              </Div>

              {/* Right Column - Quick Stats */}
              <Div>
                <Div
                  p="XL"
                  borderRadius="M"
                  border="1px solid"
                  borderColor="outline"
                  backgroundColor="surface"
                  mb="L"
                >
                  <Typography variant="title" size="medium" mb="M">
                    Estatísticas Rápidas
                  </Typography>

                  <Div display="flex" flexDirection="column" gap="M">
                    <Div
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        variant="body"
                        size="small"
                        color="textVariant"
                      >
                        Total de Aulas
                      </Typography>
                      <Typography variant="title" size="medium">
                        {course.lessons.length}
                      </Typography>
                    </Div>

                    <Div
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        variant="body"
                        size="small"
                        color="textVariant"
                      >
                        Duração Total
                      </Typography>
                      <Typography variant="title" size="medium">
                        {calculateTotalDuration()}
                      </Typography>
                    </Div>

                    <Div
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        variant="body"
                        size="small"
                        color="textVariant"
                      >
                        Nível
                      </Typography>
                      <Typography
                        variant="title"
                        size="medium"
                        color={getCourseLevelColor()}
                      >
                        {getCourseLevelLabel()}
                      </Typography>
                    </Div>

                    <Div
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        variant="body"
                        size="small"
                        color="textVariant"
                      >
                        Estado
                      </Typography>
                      <Typography
                        variant="title"
                        size="medium"
                        color={course.isPublished ? 'success' : 'warning'}
                      >
                        {course.isPublished ? 'Publicado' : 'Rascunho'}
                      </Typography>
                    </Div>
                  </Div>
                </Div>

                {/* Quick Actions */}
                <Div
                  p="L"
                  borderRadius="M"
                  border="1px solid"
                  borderColor="outline"
                  backgroundColor="surface"
                >
                  <Typography variant="title" size="small" mb="M">
                    Ações Rápidas
                  </Typography>

                  <Div display="flex" flexDirection="column" gap="XS">
                    <Button
                      variant="primaryVariant"
                      size="small"
                      justifyContent="flex-start"
                      onClick={() =>
                        router.push(
                          `/teacher/courses/${course.slug}/lessons/create`
                        )
                      }
                    >
                      <Plus size={14} />
                      Adicionar Nova Aula
                    </Button>

                    <Button
                      variant="primaryVariant"
                      size="small"
                      justifyContent="flex-start"
                      onClick={() =>
                        router.push(`/teacher/courses/${course.id}/edit`)
                      }
                    >
                      <Edit size={14} />
                      Editar Detalhes do Curso
                    </Button>

                    <Button
                      variant="primaryVariant"
                      size="small"
                      justifyContent="flex-start"
                      onClick={() =>
                        router.push(`/teacher/analytics?courseId=${course.id}`)
                      }
                    >
                      <BarChart3 size={14} />
                      Ver Análises
                    </Button>

                    <Button
                      variant="primaryVariant"
                      size="small"
                      justifyContent="flex-start"
                      color="error"
                      onClick={handleDeleteCourse}
                    >
                      <Trash2 size={14} />
                      Eliminar Curso
                    </Button>
                  </Div>
                </Div>
              </Div>
            </Div>
          )}

          {activeTab === 'lessons' && (
            <Div>
              {course.lessons.length > 0 ? (
                <Div
                  borderRadius="M"
                  border="1px solid"
                  borderColor="outline"
                  backgroundColor="surface"
                  overflow="hidden"
                >
                  {course.lessons.map((lesson, index) => (
                    <Div
                      key={lesson.id}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      p="L"
                      borderBottom={
                        index < course.lessons.length - 1 ? '1px solid' : 'none'
                      }
                      borderBottomColor="outline"
                      nHover={{ backgroundColor: 'surface' }}
                    >
                      <Div display="flex" alignItems="center" gap="M" flex="1">
                        <Div
                          width="40px"
                          height="40px"
                          borderRadius="M"
                          backgroundColor="primaryLight"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          flexShrink="0"
                        >
                          {lesson.videoUrl ? (
                            <PlayCircle
                              size={20}
                              color="var(--colors-primary)"
                            />
                          ) : (
                            <FileText size={20} color="var(--colors-primary)" />
                          )}
                        </Div>

                        <Div flex="1">
                          <Typography
                            variant="body"
                            size="small"
                            fontWeight="500"
                            mb="XS"
                          >
                            Aula {lesson.order}: {lesson.title}
                          </Typography>
                          <Typography
                            variant="body"
                            size="extraSmall"
                            color="textVariant"
                          >
                            {lesson.description || 'Sem descrição'}
                          </Typography>
                          {lesson.estimatedTime && (
                            <Div
                              display="flex"
                              alignItems="center"
                              gap="XS"
                              mt="XS"
                            >
                              <Clock
                                size={12}
                                color="var(--colors-textVariant)"
                              />
                              <Typography
                                variant="body"
                                size="extraSmall"
                                color="textVariant"
                              >
                                {lesson.estimatedTime} minutos
                              </Typography>
                            </Div>
                          )}
                        </Div>
                      </Div>

                      <Div display="flex" gap="XS" alignItems="center">
                        <Button
                          variant="primaryVariant"
                          size="small"
                          onClick={() =>
                            router.push(
                              `/content/courses/${course.slug}/lessons/${lesson.id}`
                            )
                          }
                        >
                          <Eye size={14} />
                          Ver
                        </Button>

                        <Button
                          variant="primaryVariant"
                          size="small"
                          onClick={() =>
                            router.push(
                              `/teacher/courses/${course.slug}/lessons/${lesson.id}/edit`
                            )
                          }
                        >
                          <Edit size={14} />
                          Editar
                        </Button>

                        <ChevronRight
                          size={16}
                          color="var(--colors-textVariant)"
                        />
                      </Div>
                    </Div>
                  ))}
                </Div>
              ) : (
                <Div
                  p="XL"
                  borderRadius="M"
                  border="1px dashed"
                  borderColor="outline"
                  backgroundColor="surface"
                  textAlign="center"
                >
                  <BookOpen
                    size={48}
                    color="var(--colors-textVariant)"
                    style={{ margin: '0 auto 16px' }}
                  />
                  <Typography variant="title" size="medium" mb="XS">
                    Este curso ainda não tem aulas
                  </Typography>
                  <Typography
                    variant="body"
                    size="small"
                    color="textVariant"
                    mb="L"
                  >
                    Crie a sua primeira aula para começar a construir o conteúdo
                    do curso.
                  </Typography>
                  <Button
                    variant="primary"
                    size="medium"
                    onClick={() =>
                      router.push(
                        `/teacher/courses/${course.slug}/lessons/create`
                      )
                    }
                  >
                    <Plus size={16} />
                    Criar Primeira Aula
                  </Button>
                </Div>
              )}
            </Div>
          )}

          {activeTab === 'settings' && (
            <Div
              p="XL"
              borderRadius="M"
              border="1px solid"
              borderColor="outline"
              backgroundColor="surface"
            >
              <Typography variant="title" size="medium" mb="L">
                Configurações do Curso
              </Typography>

              <Div
                display="grid"
                gridTemplateColumns={['1fr', '1fr', '1fr 1fr', '1fr 1fr']}
                gap="L"
              >
                <Div>
                  <Typography
                    variant="body"
                    size="small"
                    fontWeight="500"
                    mb="M"
                  >
                    Visibilidade do Curso
                  </Typography>
                  <Div display="flex" alignItems="center" gap="M" mb="L">
                    <Button
                      variant={course.isPublished ? 'primary' : 'secondary'}
                      size="small"
                      onClick={() => {
                        /* Handle publish */
                      }}
                    >
                      Público
                    </Button>
                    <Button
                      variant={!course.isPublished ? 'primary' : 'secondary'}
                      size="small"
                      onClick={() => {
                        /* Handle draft */
                      }}
                    >
                      Rascunho
                    </Button>
                  </Div>
                </Div>

                <Div>
                  <Typography
                    variant="body"
                    size="small"
                    fontWeight="500"
                    mb="M"
                  >
                    Configurações de Preço
                  </Typography>
                  <Div display="flex" alignItems="center" gap="M" mb="L">
                    <Button
                      variant={course.isFree ? 'primary' : 'secondary'}
                      size="small"
                      onClick={() => {
                        /* Handle free */
                      }}
                    >
                      Gratuito
                    </Button>
                    <Button
                      variant={!course.isFree ? 'primary' : 'secondary'}
                      size="small"
                      onClick={() => {
                        /* Handle paid */
                      }}
                    >
                      Pago
                    </Button>
                  </Div>
                </Div>
              </Div>

              <Div mt="L">
                <Typography
                  variant="body"
                  size="small"
                  fontWeight="500"
                  mb="M"
                  color="error"
                >
                  Zona de Perigo
                </Typography>
                <Button
                  variant="primaryVariant"
                  size="medium"
                  onClick={handleDeleteCourse}
                >
                  <Trash2 size={16} />
                  Eliminar Curso Permanentemente
                </Button>
              </Div>
            </Div>
          )}
        </Div>
      </Box>
    </Layout>
  );
};

export default CourseDetails;
