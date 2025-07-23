import { Div, Video } from '@stylin.js/elements';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';

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
  console.log('Lesson Details:', lesson);
  console.log('User:', user);
  const isTeacher = lesson.course.teacher.firebaseId === user?.uid;

  return (
    <Layout hasGoBack>
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
      <Box variant="container">
        <Div width="100%" gridColumn="1 / -1">
          <Typography variant="fancy" size="medium" color="text">
            {lesson.course.title}
          </Typography>
        </Div>
      </Box>
      <Video
        width="100%"
        height="14rem"
        src={lesson.videoUrl}
        title={lesson.title}
        controls
      />
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

      <Box variant="container" mt="L">
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
              <Div bg="surface" p="2XL">
                <Typography variant="body" size="small" color="text">
                  {material.name}
                </Typography>
              </Div>
            </Link>
          </Div>
        ))}

        {isTeacher && !lesson.assessment && (
          <Div width="100%" gridColumn="1 / -1">
            <Button
              mt="L"
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

        {lesson.assessment && (
          <Div
            width="100%"
            gridColumn="1 / -1"
            color="text"
            pointerEvents={
              lesson.assessment?.userAssessments[0]?.isPassed ? 'none' : 'auto'
            }
          >
            <ListItemCard
              title="Avaliação"
              to={
                lesson.assessment?.userAssessments[0]?.isPassed
                  ? ''
                  : `/content/courses/${lesson.course.slug}/lessons/${lesson.id}/assessment`
              }
              description={lesson.assessment?.title}
              Icon={lesson.isPassed ? DoneSVG : PaperSVG}
              footerLeft={
                <Typography variant="body" size="extraSmall" color="text">
                  {`${lesson.assessment?.questions.length === 1 ? '1 questão' : `${lesson.assessment?.questions.length} questões`}`}
                </Typography>
              }
              footerRight={
                <Typography variant="body" size="extraSmall" color="text">
                  {lesson.assessment?.userAssessments[0]?.score
                    ? `${lesson.assessment?.userAssessments[0]?.score}% de acertos`
                    : 'Por fazer'}
                </Typography>
              }
            />
          </Div>
        )}
        {lesson.course.lessons
          .filter(
            (l) =>
              (l.id !== lesson.id &&
                !l.assessment?.userAssessments[0]?.isPassed) ||
              (l.id !== lesson.id && !l.assessment)
          )
          .map((l) => (
            <Div key={lesson.id} width="100%" gridColumn="1 / -1" mt="M">
              <Link
                href={
                  lesson.assessment &&
                  lesson.assessment.userAssessments[0]?.isPassed &&
                  l.order === lesson.order + 1
                    ? ''
                    : `/content/courses/${lesson.course.slug}/lessons/${l.id}`
                }
                style={
                  lesson.assessment?.userAssessments[0]?.isPassed &&
                  l.order === lesson.order + 1
                    ? {}
                    : { pointerEvents: 'none', opacity: 0.5 }
                }
              >
                <ListItemCard
                  title={`Aula ${l.order}`}
                  description={l.title}
                  Icon={
                    l.assessment?.userAssessments[0]?.isPassed
                      ? DoneSVG
                      : undefined
                  }
                  footerLeft={
                    <Typography variant="body" size="extraSmall" color="text">
                      {l.estimatedTime
                        ? `Tempo estimado: ${l.estimatedTime} minutos`
                        : 'Duração não especificada'}
                    </Typography>
                  }
                  footerRight={
                    <Typography variant="body" size="extraSmall" color="text">
                      {l.assessment?.userAssessments[0]?.isPassed
                        ? 'Assistido'
                        : 'Por assistir'}
                    </Typography>
                  }
                />
              </Link>
            </Div>
          ))}
      </Box>
    </Layout>
  );
};

export default LessonDetailsView;

{
  /* <Button
            mt="L"
            variant="secondary"
            size="medium"
            onClick={() =>
              router.push(
                `/teacher/courses/${lesson.course.slug}/lessons/${lesson.id}/assessment/new`
              )
            }
          >
            Criar avaliação
          </Button> */
}
