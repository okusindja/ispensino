import { Div, Video } from '@stylin.js/elements';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useMemo } from 'react';

import { Layout } from '@/components';
import ListItemCard from '@/components/list-item-card';
import { DoneSVG, PaperSVG } from '@/components/svg';
import { useAuth } from '@/contexts';
import { Box, Button } from '@/elements';
import { Typography } from '@/elements/typography';

import { LessonPageProps } from './lesson-details.types';

const LessonDetailsView: FC<LessonPageProps> = ({ lesson }) => {
  const router = useRouter();
  const { user } = useAuth();

  // Determine if current user is the course teacher
  const isTeacher = lesson.course.teacher.firebaseId === user?.uid;

  // Sort lessons by order and find current position
  const { sortedLessons, currentLessonIndex } = useMemo(() => {
    const lessons = [...lesson.course.lessons].sort(
      (a, b) => a.order - b.order
    );
    const index = lessons.findIndex((l) => l.id === lesson.id);
    return {
      sortedLessons: lessons,
      currentLessonIndex: index,
    };
  }, [lesson]);

  // Get next lesson and determine if it's accessible
  const nextLesson = useMemo(() => {
    if (currentLessonIndex === -1) return null;
    return sortedLessons[currentLessonIndex + 1];
  }, [sortedLessons, currentLessonIndex]);

  const isNextLessonAccessible =
    nextLesson &&
    (!lesson.assessment || lesson.assessment.userAssessments[0]?.isPassed);

  // Determine if a lesson is accessible
  const isLessonAccessible = (targetLesson: {
    order: number;
    assessment?: { userAssessments?: { isPassed?: boolean }[] };
  }) => {
    // Previous lessons are always accessible
    if (targetLesson.order <= lesson.order) return true;

    // Next lesson requires assessment completion if it exists
    if (targetLesson.order === lesson.order + 1) {
      return isNextLessonAccessible;
    }

    // Future lessons beyond next are not accessible
    return false;
  };

  return (
    <Layout hasGoBack>
      {/* Header Section */}
      <Div color="text" width="100%" mb="XL" bg="surface" py="L">
        <Box variant="container">
          <Div
            width="100%"
            gridColumn="1 / -1"
            display="flex"
            justifyContent="flex-end"
          >
            <Typography variant="fancy" size="medium" color="text">
              Comentários
            </Typography>
          </Div>
        </Box>
      </Div>

      {/* Course Title */}
      <Box variant="container">
        <Div width="100%" gridColumn="1 / -1">
          <Typography variant="fancy" size="medium" color="text">
            {lesson.course.title}
          </Typography>
        </Div>
      </Box>

      {/* Video Player */}
      <Video
        width="100%"
        height="14rem"
        src={lesson.videoUrl}
        title={lesson.title}
        controls
      />

      {/* Lesson Details */}
      <Box variant="container" backgroundColor="surface">
        <Div width="100%" gridColumn="1 / -1" p="M">
          <Typography variant="headline" size="extraSmall" color="text">
            {lesson.order} - {lesson.title}
          </Typography>

          <Div display="flex" alignItems="center" gap="M" mt="M">
            <Image
              width={35}
              height={35}
              alt={lesson.course.title}
              style={{ borderRadius: '100%' }}
              src={'https://picsum.photos/200/300'}
            />
            <Typography variant="body" size="small" color="text">
              Com professor: {lesson.course.teacher.name}
            </Typography>
          </Div>

          <Typography variant="body" size="small" color="text" mt="XL">
            {lesson.description}
          </Typography>
        </Div>
      </Box>

      {/* Materials and Assessment */}
      <Box variant="container" mt="L">
        {/* Materials Section */}
        <Typography
          variant="body"
          size="small"
          color="text"
          width="100%"
          gridColumn="1 / -1"
        >
          Materiais:
        </Typography>

        {lesson.materials.map((material) => (
          <Div key={material.id} mt="M" width="100%" gridColumn="span 2">
            <Link href={material.url} target="_blank" rel="noopener noreferrer">
              <Div bg="surface" p="2XL" borderRadius="M">
                <Typography variant="body" size="small" color="text">
                  {material.name}
                </Typography>
              </Div>
            </Link>
          </Div>
        ))}

        {/* Create Assessment Button (Teacher Only) */}
        {isTeacher && !lesson.assessment && (
          <Div width="100%" gridColumn="1 / -1" mt="M">
            <Button
              variant="secondary"
              size="medium"
              onClick={() =>
                router.push(
                  `/teacher/courses/${lesson.course.slug}/lessons/${lesson.id}/assessment/new`
                )
              }
            >
              Criar avaliação
            </Button>
          </Div>
        )}

        {/* Assessment Card */}
        {lesson.assessment && (
          <Div width="100%" gridColumn="1 / -1" mt="M">
            <ListItemCard
              title="Avaliação"
              to={
                lesson.assessment.userAssessments[0]?.isPassed
                  ? undefined
                  : `/content/courses/${lesson.course.slug}/lessons/${lesson.id}/assessment`
              }
              description={lesson.assessment.title}
              Icon={
                lesson.assessment.userAssessments[0]?.isPassed
                  ? DoneSVG
                  : PaperSVG
              }
              footerLeft={
                <Typography variant="body" size="extraSmall" color="text">
                  {lesson.assessment.questions.length === 1
                    ? '1 questão'
                    : `${lesson.assessment.questions.length} questões`}
                </Typography>
              }
              footerRight={
                <Typography variant="body" size="extraSmall" color="text">
                  {lesson.assessment.userAssessments[0]?.score
                    ? `${lesson.assessment.userAssessments[0].score}% de acertos`
                    : 'Por fazer'}
                </Typography>
              }
            />
          </Div>
        )}

        {/* Lesson List */}
        {sortedLessons
          .filter((l) => l.id !== lesson.id)
          .map((l) => {
            const isAccessible = isLessonAccessible(l);
            const isPassed = l.assessment?.userAssessments[0]?.isPassed;

            return (
              <Div
                key={l.id}
                width="100%"
                gridColumn="1 / -1"
                mt="M"
                opacity={isAccessible ? 1 : 0.5}
                pointerEvents={isAccessible ? 'auto' : 'none'}
              >
                <ListItemCard
                  to={
                    isAccessible
                      ? `/content/courses/${l.course.slug}/lessons/${l.id}`
                      : undefined
                  }
                  title={`Aula ${l.order}`}
                  description={l.title}
                  Icon={isPassed ? DoneSVG : undefined}
                  footerLeft={
                    <Typography variant="body" size="extraSmall" color="text">
                      {l.estimatedTime
                        ? `Tempo estimado: ${l.estimatedTime} minutos`
                        : 'Duração não especificada'}
                    </Typography>
                  }
                  footerRight={
                    <Typography variant="body" size="extraSmall" color="text">
                      {isPassed ? 'Assistido' : 'Por assistir'}
                    </Typography>
                  }
                />
              </Div>
            );
          })}
      </Box>
    </Layout>
  );
};

export default LessonDetailsView;
