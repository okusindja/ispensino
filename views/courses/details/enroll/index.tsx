import { Div, Table, Td, Tr, useTheme } from '@stylin.js/elements';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';

import { Layout } from '@/components';
import { fetcherWithCredentials } from '@/constants/fetchers';
import { useAuth, useToast } from '@/contexts';
import { DesignSystemTheme } from '@/design-system';
import { Box, Button } from '@/elements';
import { Typography } from '@/elements/typography';
import { formatRelativeDate } from '@/utils';

import { EnrollProps } from './enroll.types';

const Enroll: FC<EnrollProps> = ({ course }) => {
  const { user } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();
  const { colors } = useTheme() as DesignSystemTheme;
  const [Loading, setLoading] = useState(false);

  if (!user) {
    return <div>Please log in to enroll in courses.</div>;
  }

  const handleEnroll = async () => {
    setLoading(true);
    try {
      await fetcherWithCredentials(`/api/courses/${course.id}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: course.id }),
      });

      addToast({
        title: 'Success',
        description: 'You have successfully enrolled in the course.',
        type: 'success',
      });

      setInterval(() => {
        setLoading(false);
      }, 2000);

      router.push(`/content/courses/${course.slug}`);
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to enroll in the course. Please try again later.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Box variant="container">
        <Div
          width="100%"
          gap="L"
          gridColumn="1 / -1"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          mt="L"
        >
          <Table
            width="100%"
            border={`1px solid ${colors.outlineBorder}`}
            borderRadius="8px"
            backgroundColor={colors.surface}
          >
            <Tr>
              <Td p="L" borderBottom={`1px solid ${colors.outline}`}>
                <Typography variant="body" size="extraSmall" color="text">
                  Nome do curso:
                </Typography>
              </Td>
              <Td p="L" borderBottom={`1px solid ${colors.outline}`}>
                <Typography
                  textAlign="right"
                  variant="body"
                  size="extraSmall"
                  color="text"
                >
                  {course.title}
                </Typography>
              </Td>
            </Tr>
            <Tr>
              <Td p="L" borderBottom={`1px solid ${colors.outline}`}>
                <Typography variant="body" size="extraSmall" color="text">
                  Teve início:
                </Typography>
              </Td>
              <Td p="L" borderBottom={`1px solid ${colors.outline}`}>
                <Typography
                  textAlign="right"
                  variant="body"
                  size="extraSmall"
                  color="text"
                >
                  {course.startDate
                    ? formatRelativeDate(new Date(course.startDate))
                    : 'Data não definida'}
                </Typography>
              </Td>
            </Tr>
            <Tr>
              <Td p="L" borderBottom={`1px solid ${colors.outline}`}>
                <Typography variant="body" size="extraSmall" color="text">
                  Com professor:
                </Typography>
              </Td>
              <Td p="L" borderBottom={`1px solid ${colors.outline}`}>
                <Typography
                  textAlign="right"
                  variant="body"
                  size="extraSmall"
                  color="text"
                >
                  {course.teacher.name}
                </Typography>
              </Td>
            </Tr>
            <Tr>
              <Td p="L" borderBottom={`1px solid ${colors.outline}`}>
                <Typography variant="body" size="extraSmall" color="text">
                  Tempo de curso estimado:
                </Typography>
              </Td>
              <Td p="L" borderBottom={`1px solid ${colors.outline}`}>
                <Typography
                  textAlign="right"
                  variant="body"
                  size="extraSmall"
                  color="text"
                >
                  {course.lessons.reduce(
                    (total, lesson) => total + (lesson.estimatedTime || 0),
                    0
                  )}{' '}
                  minutos
                </Typography>
              </Td>
            </Tr>
            <Tr>
              <Td p="L" borderBottom={`1px solid ${colors.outline}`}>
                <Typography variant="body" size="extraSmall" color="text">
                  Nível do curso:
                </Typography>
              </Td>
              <Td p="L" borderBottom={`1px solid ${colors.outline}`}>
                <Typography
                  textAlign="right"
                  variant="body"
                  size="extraSmall"
                  color="text"
                >
                  {course.level ? course.level : 'Nível não definido'}
                </Typography>
              </Td>
            </Tr>
            <Tr>
              <Td p="L" borderBottom={`1px solid ${colors.outline}`}>
                <Typography variant="body" size="extraSmall" color="text">
                  Preço:
                </Typography>
              </Td>
              <Td p="L" borderBottom={`1px solid ${colors.outline}`}>
                <Typography
                  textAlign="right"
                  variant="body"
                  color={course.price ? 'text' : 'success'}
                  size="extraSmall"
                >
                  {course.price ? `${course.price} AOA` : 'Gratuito'}
                </Typography>
              </Td>
            </Tr>
          </Table>
          <Button
            variant="primary"
            size="medium"
            onClick={handleEnroll}
            disabled={Loading}
          >
            Matricular-me por{' '}
            {course.price ? `${course.price} AOA` : 'gratuitamente'}
          </Button>
        </Div>
      </Box>
    </Layout>
  );
};

export default Enroll;
