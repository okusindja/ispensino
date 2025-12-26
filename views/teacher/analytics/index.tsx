import { useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Layout } from '@/components';
import { Box, Button } from '@/elements';
import {
  Div,
  Li,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Ul,
} from '@stylin.js/elements';
import { Typography } from '@/elements/typography';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  Download,
  CheckCircle,
  Target,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { SelectField } from '@/components/select-field';
import { fetcherWithCredentials } from '@/constants/fetchers';
import { UserProps } from '@/interface/declaration';

interface Props {
  user: UserProps;
}

interface Course {
  id: string;
  title: string;
  description: string;
  isPublished: boolean;
  createdAt: string;
  thumbnail: string;
  _count?: {
    enrollments: number;
    lessons: number;
  };
}

interface EnrollmentTrend {
  date: string;
  enrollments: number;
  completions: number;
}

interface LessonCompletion {
  lesson: string;
  completionRate: number;
  order: number;
}

interface AssessmentPerformance {
  assessment: string;
  avgScore: number;
  passRate: number;
  totalAttempts: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
  avgScore: number;
  timeSpent: string;
}

interface EngagementDistribution {
  name: string;
  value: number;
}

interface Metrics {
  activeStudents: number;
  dropoffRate: number;
  avgWatchTime: string;
  totalQuestions: number;
  inactiveStudents: number;
  highestDropoffLesson: string;
}

interface Overview {
  totalStudents: number;
  completedStudents: number;
  completionRate: number;
  avgScore: number;
  avgTimeSpent: string;
  studentGrowth: number;
  completionGrowth: number;
  scoreGrowth: number;
}

interface AnalyticsData {
  overview: Overview;
  enrollmentTrends: EnrollmentTrend[];
  lessonCompletion: LessonCompletion[];
  assessmentPerformance: AssessmentPerformance[];
  topStudents: Student[];
  engagementDistribution: EngagementDistribution[];
  metrics: Metrics;
  strengths: string[];
  improvements: string[];
  course: {
    title: string;
    description: string;
    totalLessons: number;
  };
}

const TeacherAnalyticsView = ({ user }: Props) => {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [timeRange, setTimeRange] = useState<string>('30days');
  const [courses, setCourses] = useState<Course[]>([]);

  const {
    data: coursesData,
    error: coursesError,
    isLoading: coursesLoading,
  } = useSWR<Course[]>(
    user?.id ? `/api/users/${user.id}/teacher/my-courses` : null,
    fetcherWithCredentials,
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
        if (data?.length > 0 && !selectedCourse) {
          setSelectedCourse(data[0].id);
          setCourses(data);
        } else {
          setCourses(data || []);
        }
      },
    }
  );

  const {
    data: analytics,
    error: analyticsError,
    isLoading: analyticsLoading,
  } = useSWR<AnalyticsData>(
    user?.id && selectedCourse
      ? `/api/users/${user.id}/teacher/analytics?courseId=${selectedCourse}&timeRange=${timeRange}`
      : null,
    fetcherWithCredentials,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
  };

  const exportData = () => {
    if (!analytics) return;

    const dataStr = JSON.stringify(analytics, null, 2);
    const dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `analytics-${selectedCourse}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const isLoading = coursesLoading || analyticsLoading;
  const error = coursesError?.message || analyticsError?.message;
  const coursesList = coursesData || courses;

  // Estado de carregamento
  if (isLoading && !analytics) {
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
            <Typography size={'small'} variant={'body'}>
              A carregar análises...
            </Typography>
          </Div>
        </Box>
      </Layout>
    );
  }

  // Estado de erro ou sem cursos
  if (error || coursesList?.length === 0) {
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
            <AlertCircle size={48} color="#94a3b8" />
            <Typography variant="title" color="text" size="medium" mb="XS">
              {error || 'Nenhum curso encontrado'}
            </Typography>
            <Typography
              color="textVariant"
              textAlign="center"
              mb="L"
              size={'small'}
              variant={'body'}
            >
              {error || 'Crie o seu primeiro curso para ver análises.'}
            </Typography>
            <Button
              variant="primaryVariant"
              size="medium"
              onClick={() => router.push('/teacher/courses/create')}
            >
              Criar Curso
            </Button>
          </Div>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout hasGoBack>
      <Box variant="container" py="XL">
        {/* Cabeçalho */}
        <Div
          width="100%"
          gridColumn="1/-1"
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb="XL"
          flexWrap="wrap"
          gap="M"
        >
          <Div minWidth="300px" width="100%">
            <Typography
              color="text"
              variant="title"
              size="medium"
              mb="XS"
              mt="XL"
            >
              Análises do Curso
            </Typography>
            <Typography
              color="textVariant"
              size="small"
              mb="M"
              variant={'body'}
            >
              {analytics?.course?.title ||
                coursesList.find((c) => c.id === selectedCourse)?.title ||
                'Selecione um curso'}
            </Typography>
          </Div>

          <Div display="flex" gap="M" alignItems="center" flexWrap="wrap">
            <SelectField
              value={selectedCourse}
              onChange={(e) => handleCourseChange(e.target.value)}
              style={{ minWidth: '200px' }}
            >
              <option value="">Selecione um curso</option>
              {coursesList.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} ({course._count?.enrollments || 0} estudantes)
                </option>
              ))}
            </SelectField>

            <SelectField
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="7days">Últimos 7 dias</option>
              <option value="30days">Últimos 30 dias</option>
              <option value="90days">Últimos 90 dias</option>
              <option value="all">Todo o período</option>
            </SelectField>

            <Button
              variant="primary"
              size="medium"
              mt="XL"
              onClick={exportData}
              disabled={!analytics || analyticsLoading}
            >
              <Download size={16} />
              Exportar relatório do curso
            </Button>
          </Div>
        </Div>

        {/* Estatísticas Rápidas */}
        <Div
          width="100%"
          gridColumn="1/-1"
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
          gap="M"
          mb="XL"
        >
          <Div
            p="L"
            borderRadius="M"
            border="1px solid"
            borderColor="outline"
            backgroundColor="surface"
          >
            <Div
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              mb="M"
            >
              <Typography size="small" color="textVariant" variant={'body'}>
                Total de Estudantes
              </Typography>
              <Div color="primary">
                <Users size={20} />
              </Div>
            </Div>
            <Typography
              color="text"
              variant="title"
              size="large"
              fontWeight="600"
            >
              {analytics?.overview?.totalStudents || 0}
            </Typography>
          </Div>

          <Div
            p="L"
            borderRadius="M"
            border="1px solid"
            borderColor="outline"
            backgroundColor="surface"
          >
            <Div
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              mb="M"
            >
              <Typography size="small" color="textVariant" variant={'body'}>
                Taxa de Conclusão
              </Typography>
              <Div color="primary">
                <CheckCircle size={20} />
              </Div>
            </Div>
            <Typography
              color="text"
              variant="title"
              size="large"
              fontWeight="600"
            >
              {analytics?.overview?.completionRate || 0}%
            </Typography>
          </Div>

          <Div
            p="L"
            borderRadius="M"
            border="1px solid"
            borderColor="outline"
            backgroundColor="surface"
          >
            <Div
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              mb="M"
            >
              <Typography size="small" color="textVariant" variant={'body'}>
                Pontuação Média
              </Typography>
              <Div color="primary">
                <Target size={20} />
              </Div>
            </Div>
            <Typography
              color="text"
              variant="title"
              size="large"
              fontWeight="600"
            >
              {analytics?.overview?.avgScore || 0}%
            </Typography>
          </Div>

          <Div
            p="L"
            borderRadius="M"
            border="1px solid"
            borderColor="outline"
            backgroundColor="surface"
          >
            <Div
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              mb="M"
            >
              <Typography size="small" color="textVariant" variant={'body'}>
                Tempo Médio Despendido
              </Typography>
              <Div color="primary">
                <Clock size={20} />
              </Div>
            </Div>
            <Typography
              color="text"
              variant="title"
              size="large"
              fontWeight="600"
            >
              {analytics?.overview?.avgTimeSpent || '0h 0m'}
            </Typography>
          </Div>
        </Div>

        {analyticsLoading && (
          <Div
            width="100%"
            gridColumn="1/-1"
            display="flex"
            justifyContent="center"
            py="L"
          >
            <Typography size="small" variant="body">
              A carregar dados de análise...
            </Typography>
          </Div>
        )}

        {!analyticsLoading &&
        analytics &&
        analytics?.overview?.totalStudents > 0 ? (
          <>
            <Div width="100%" gridColumn="1/-1" mb="XL">
              <Typography color="text" variant="title" size="medium" mb="M">
                Tendências de Matrícula (30 Dias)
              </Typography>
              <Div
                p="L"
                borderRadius="M"
                border="1px solid"
                borderColor="outline"
                backgroundColor="surface"
                height="300px"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics?.enrollmentTrends || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="enrollments"
                      stroke="#0088FE"
                      name="Novas Matrículas"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="completions"
                      stroke="#00C49F"
                      name="Conclusões do Curso"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Div>
            </Div>

            <Div
              width="100%"
              gridColumn="1/-1"
              display="grid"
              gridTemplateColumns={[
                'repeat(1, 1fr)',
                'repeat(1, 1fr)',
                'repeat(2, 1fr)',
                'repeat(2, 1fr)',
              ]}
              gap="L"
              mb="XL"
            >
              <Div>
                <Typography color="text" variant="title" size="medium" mb="M">
                  Taxa de Conclusão das Lições
                </Typography>
                <Div
                  p="L"
                  borderRadius="M"
                  border="1px solid"
                  borderColor="outline"
                  backgroundColor="surface"
                  height="18.75rem"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics?.lessonCompletion || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="lesson"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="completionRate"
                        fill="#8884d8"
                        name="Taxa de Conclusão %"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Div>
              </Div>

              <Div>
                <Typography color="text" variant="title" size="medium" mb="M">
                  Desempenho nas Avaliações
                </Typography>
                <Div
                  p="L"
                  borderRadius="M"
                  border="1px solid"
                  borderColor="outline"
                  backgroundColor="surface"
                  height="300px"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics?.assessmentPerformance || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="assessment" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="avgScore"
                        fill="#ff8042"
                        name="Pontuação Média"
                      />
                      <Bar
                        dataKey="passRate"
                        fill="#00c49f"
                        name="Taxa de Aprovação"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Div>
              </Div>
            </Div>

            {/* Distribuição do Envolvimento dos Estudantes */}
            <Div width="100%" gridColumn="1/-1" mb="XL">
              <Typography color="text" variant="title" size="medium" mb="M">
                Distribuição do Envolvimento dos Estudantes
              </Typography>
              <Div
                p="L"
                borderRadius="M"
                border="1px solid"
                borderColor="outline"
                backgroundColor="surface"
                height="300px"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics?.engagementDistribution || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics?.engagementDistribution?.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Div>
            </Div>

            {/* Tabela dos Melhores Estudantes */}
            <Div width="100%" gridColumn="1/-1" mb="XL">
              <Typography color="text" variant="title" size="medium" mb="M">
                Estudantes com Melhor Desempenho
              </Typography>
              <Div
                p="L"
                borderRadius="M"
                border="1px solid"
                borderColor="outline"
                backgroundColor="surface"
              >
                <Div overflowX="auto">
                  <Table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <Thead>
                      <Tr borderBottom="1px solid" borderBottomColor="outline">
                        <Th
                          color="text"
                          style={{ textAlign: 'left', padding: '12px' }}
                        >
                          Estudante
                        </Th>
                        <Th
                          color="text"
                          style={{ textAlign: 'left', padding: '12px' }}
                        >
                          Progresso
                        </Th>
                        <Th
                          color="text"
                          style={{ textAlign: 'left', padding: '12px' }}
                        >
                          Pontuação Média
                        </Th>
                        <Th
                          color="text"
                          style={{ textAlign: 'left', padding: '12px' }}
                        >
                          Tempo Despendido
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {analytics?.topStudents?.map((student) => (
                        <Tr
                          key={student.id}
                          borderBottom="1px solid"
                          borderBottomColor="outline"
                        >
                          <Td style={{ padding: '12px' }}>
                            <Div display="flex" alignItems="center" gap="S">
                              <Box
                                width="32px"
                                height="32px"
                                borderRadius="50%"
                                backgroundColor="primaryLight"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Typography
                                  color="primary"
                                  size="extraSmall"
                                  variant={'body'}
                                >
                                  {student.name?.charAt(0) || 'A'}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography
                                  color="text"
                                  size="small"
                                  fontWeight="500"
                                  variant={'body'}
                                >
                                  {student.name || 'Anónimo'}
                                </Typography>
                                <Typography
                                  variant="body"
                                  size="extraSmall"
                                  color="textVariant"
                                >
                                  {student.email || 'Sem email'}
                                </Typography>
                              </Box>
                            </Div>
                          </Td>
                          <Td style={{ padding: '12px' }}>
                            <Box>
                              <Typography
                                color="text"
                                size="small"
                                variant={'body'}
                              >
                                {student.progress || 0}%
                              </Typography>
                              <Box
                                width="100%"
                                height="4px"
                                backgroundColor="surface"
                                borderRadius="2px"
                                mt="XS"
                              >
                                <Box
                                  width={`${student.progress || 0}%`}
                                  height="100%"
                                  backgroundColor="success"
                                  borderRadius="2px"
                                />
                              </Box>
                            </Box>
                          </Td>
                          <Td style={{ padding: '12px' }}>
                            <Typography
                              size="small"
                              color={
                                student.avgScore >= 80
                                  ? 'success'
                                  : student.avgScore >= 60
                                    ? 'warning'
                                    : 'error'
                              }
                              variant={'body'}
                            >
                              {student.avgScore || 0}%
                            </Typography>
                          </Td>
                          <Td style={{ padding: '12px' }}>
                            <Typography
                              color="text"
                              size="small"
                              variant={'body'}
                            >
                              {student.timeSpent || '0h 0m'}
                            </Typography>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Div>
              </Div>
            </Div>

            <Div
              p="L"
              width="100%"
              gridColumn="1/-1"
              borderRadius="M"
              border="1px solid"
              borderColor="outline"
              backgroundColor="surface"
              mb="XL"
            >
              <Typography color="text" variant="title" size="medium" mb="XL">
                Resumo da Saúde do Curso
              </Typography>
              <Div display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="L">
                <Box>
                  <Typography
                    size="small"
                    fontWeight="500"
                    mb="M"
                    color="success"
                    variant={'body'}
                  >
                    Pontos Fortes
                  </Typography>
                  <Ul pl="M">
                    {analytics?.strengths?.map((strength, index) => (
                      <Li key={index} style={{ marginBottom: '8px' }}>
                        <Typography color="text" size="small" variant={'body'}>
                          {strength}
                        </Typography>
                      </Li>
                    ))}
                  </Ul>
                </Box>

                <Box>
                  <Typography
                    size="small"
                    fontWeight="500"
                    mb="M"
                    color="warning"
                    variant={'body'}
                  >
                    Áreas para Melhoria
                  </Typography>
                  <Ul pl="M">
                    {analytics?.improvements?.map((improvement, index) => (
                      <Li key={index} style={{ marginBottom: '8px' }}>
                        <Typography color="text" size="small" variant={'body'}>
                          {improvement}
                        </Typography>
                      </Li>
                    ))}
                  </Ul>
                </Box>

                <Box>
                  <Typography
                    size="small"
                    fontWeight="500"
                    mb="M"
                    color="primary"
                    variant={'body'}
                  >
                    Ações Rápidas
                  </Typography>
                  <Ul pl="M">
                    <Li style={{ marginBottom: '8px' }}>
                      <Typography color="text" size="small" variant={'body'}>
                        Rever:{' '}
                        {analytics?.metrics?.highestDropoffLesson || 'N/A'}
                      </Typography>
                    </Li>
                    <Li style={{ marginBottom: '8px' }}>
                      <Typography color="text" size="small" variant={'body'}>
                        Envolver estudantes inativos
                      </Typography>
                    </Li>
                    <Li style={{ marginBottom: '8px' }}>
                      <Typography color="text" size="small" variant={'body'}>
                        Atualizar avaliações desafiantes
                      </Typography>
                    </Li>
                  </Ul>
                </Box>
              </Div>
            </Div>
          </>
        ) : !analyticsLoading && analytics?.overview?.totalStudents === 0 ? (
          // Estado sem estudantes inscritos
          <Div
            width="100%"
            gridColumn="1/-1"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py="XL"
            textAlign="center"
          >
            <Users size={64} color="#94a3b8" />
            <Typography
              color="text"
              variant="title"
              size="medium"
              mt="M"
              mb="XS"
            >
              Ainda Sem Estudantes Inscritos
            </Typography>
            <Typography
              color="textVariant"
              mb="L"
              size={'small'}
              variant={'body'}
            >
              Quando estudantes se inscreverem no seu curso, as análises
              aparecerão aqui.
            </Typography>
          </Div>
        ) : null}
      </Box>
    </Layout>
  );
};

export default TeacherAnalyticsView;

// Adicionar aos estilos globais ou CSS
const styles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
