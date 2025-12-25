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
  AreaChart,
  Area,
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  Calendar,
  Download,
  AlertCircle,
  Wallet,
  Percent,
  Target,
  BarChart3,
} from 'lucide-react';
import { SelectField } from '@/components/select-field';
import { fetcherWithCredentials } from '@/constants/fetchers';
import { UserProps } from '@/interface/declaration';

interface Props {
  user: UserProps;
}

interface CourseRevenue {
  id: string;
  title: string;
  price: number | null;
  isFree: boolean;
  totalRevenue: number;
  totalEnrollments: number;
  paidEnrollments: number;
  freeEnrollments: number;
  conversionRate: number;
  avgRevenuePerStudent: number;
}

interface RevenueData {
  date: string;
  revenue: number;
  enrollments: number;
  transactions: number;
}

interface PaymentMethodData {
  name: string;
  value: number;
  percentage: number;
}

interface FinancialOverview {
  totalRevenue: number;
  totalEnrollments: number;
  paidEnrollments: number;
  freeEnrollments: number;
  avgRevenuePerStudent: number;
  conversionRate: number;
  pendingPayments: number;
  refundedAmount: number;
  netRevenue: number;
  growthRate: number;
  bestPerformingCourse: {
    id: string;
    title: string;
    revenue: number;
  };
}

interface FinancialAnalyticsData {
  overview: FinancialOverview;
  monthlyRevenue: RevenueData[];
  courseRevenues: CourseRevenue[];
  paymentMethods: PaymentMethodData[];
  revenueTrends: {
    period: string;
    revenue: number;
    growth: number;
  }[];
  upcomingPayouts: {
    id: string;
    amount: number;
    courseId: string;
    courseTitle: string;
    expectedDate: string;
    status: string;
  }[];
}

const TeacherFinancialView = ({ user }: Props) => {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<string>('month');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('AOA');

  const {
    data: financialData,
    error: financialError,
    isLoading: financialLoading,
    mutate: refreshFinancialData,
  } = useSWR<FinancialAnalyticsData>(
    user?.id
      ? `/api/users/${user.id}/teacher/financial?timeRange=${timeRange}`
      : null,
    fetcherWithCredentials,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const exportFinancialReport = () => {
    if (!financialData) return;

    const dataStr = JSON.stringify(financialData, null, 2);
    const dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const downloadCSVReport = () => {
    if (!financialData) return;

    const csvRows = [];

    // Headers
    csvRows.push(['Métrica', 'Valor']);

    // Overview data
    csvRows.push([
      'Receita Total',
      formatCurrency(financialData.overview.totalRevenue),
    ]);
    csvRows.push([
      'Inscrições Totais',
      financialData.overview.totalEnrollments,
    ]);
    csvRows.push(['Inscrições Pagas', financialData.overview.paidEnrollments]);
    csvRows.push([
      'Inscrições Gratuitas',
      financialData.overview.freeEnrollments,
    ]);
    csvRows.push([
      'Taxa de Conversão',
      formatPercentage(financialData.overview.conversionRate),
    ]);
    csvRows.push([
      'Receita Líquida',
      formatCurrency(financialData.overview.netRevenue),
    ]);
    csvRows.push([
      'Taxa de Crescimento',
      formatPercentage(financialData.overview.growthRate),
    ]);

    const csvContent = csvRows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.csv`
    );
    link.click();
  };

  const PAYMENT_METHOD_COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884D8',
  ];

  if (financialLoading) {
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
              A carregar dados financeiros...
            </Typography>
          </Div>
        </Box>
      </Layout>
    );
  }

  if (financialError) {
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
              Erro ao Carregar Dados
            </Typography>
            <Typography
              color="textVariant"
              textAlign="center"
              mb="L"
              size={'small'}
              variant={'body'}
            >
              {financialError.message ||
                'Não foi possível carregar os dados financeiros. Tente novamente.'}
            </Typography>
            <Button
              variant="primaryVariant"
              size="medium"
              onClick={() => refreshFinancialData()}
            >
              Tentar Novamente
            </Button>
          </Div>
        </Box>
      </Layout>
    );
  }

  const overview = financialData?.overview;
  const monthlyRevenue = financialData?.monthlyRevenue || [];
  const courseRevenues = financialData?.courseRevenues || [];
  const paymentMethods = financialData?.paymentMethods || [];
  const revenueTrends = financialData?.revenueTrends || [];
  const upcomingPayouts = financialData?.upcomingPayouts || [];

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
              Dashboard Financeiro
            </Typography>
            <Typography
              color="textVariant"
              size="small"
              mb="M"
              variant={'body'}
            >
              Monitorize as suas receitas, conversões e desempenho financeiro
            </Typography>
          </Div>

          <Div width="100%" display="flex" gap="M" alignItems="center">
            <SelectField
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="week">Esta Semana</option>
              <option value="month">Este Mês</option>
              <option value="quarter">Este Trimestre</option>
              <option value="year">Este Ano</option>
              <option value="all">Todo o Período</option>
            </SelectField>

            <SelectField
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              style={{ minWidth: '120px' }}
            >
              <option value="AOA">AOA (Kz)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </SelectField>

            <Div display="flex" gap="M" ml="auto">
              <Button
                variant="primary"
                size="medium"
                onClick={downloadCSVReport}
                disabled={!financialData}
              >
                <Download size={16} />
                CSV
              </Button>
              <Button
                variant="primary"
                size="medium"
                onClick={exportFinancialReport}
                disabled={!financialData}
              >
                <Download size={16} />
                JSON
              </Button>
            </Div>
          </Div>
        </Div>

        {/* Visão Geral Financeira */}
        <Div width="100%" gridColumn="1/-1" mb="XL">
          <Typography color="text" variant="title" size="medium" mb="M">
            Visão Geral Financeira
          </Typography>
          <Div
            display="grid"
            gridTemplateColumns={[
              'repeat(1, 1fr)',
              'repeat(2, 1fr)',
              'repeat(3, 1fr)',
              'repeat(4, 1fr)',
            ]}
            gap="M"
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
                  Receita Total
                </Typography>
                <Div color={overview?.growthRate >= 0 ? 'success' : 'error'}>
                  {overview?.growthRate >= 0 ? (
                    <TrendingUp size={20} />
                  ) : (
                    <TrendingDown size={20} />
                  )}
                </Div>
              </Div>
              <Typography
                color="text"
                variant="title"
                size="large"
                fontWeight="600"
                mb="XS"
              >
                {formatCurrency(overview?.totalRevenue || 0)}
              </Typography>
              <Typography
                size="extraSmall"
                color={overview?.growthRate >= 0 ? 'success' : 'error'}
                variant={'body'}
              >
                {overview?.growthRate >= 0 ? '+' : ''}
                {formatPercentage(overview?.growthRate || 0)} vs período
                anterior
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
                  Receita Líquida
                </Typography>
                <Div color="primary">
                  <Wallet size={20} />
                </Div>
              </Div>
              <Typography
                color="text"
                variant="title"
                size="large"
                fontWeight="600"
                mb="XS"
              >
                {formatCurrency(overview?.netRevenue || 0)}
              </Typography>
              <Typography
                size="extraSmall"
                color="textVariant"
                variant={'body'}
              >
                Após taxas e reembolsos
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
                  Inscrições Pagas
                </Typography>
                <Div color="primary">
                  <CreditCard size={20} />
                </Div>
              </Div>
              <Typography
                color="text"
                variant="title"
                size="large"
                fontWeight="600"
                mb="XS"
              >
                {overview?.paidEnrollments || 0}
              </Typography>
              <Typography
                size="extraSmall"
                color="textVariant"
                variant={'body'}
              >
                {formatPercentage(overview?.conversionRate || 0)} taxa de
                conversão
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
                  Valor Médio por Estudante
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
                mb="XS"
              >
                {formatCurrency(overview?.avgRevenuePerStudent || 0)}
              </Typography>
              <Typography
                size="extraSmall"
                color="textVariant"
                variant={'body'}
              >
                Por inscrição paga
              </Typography>
            </Div>
          </Div>
        </Div>

        {/* Gráficos Principais */}
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
          {/* Tendência de Receitas Mensais */}
          <Div>
            <Typography color="text" variant="title" size="medium" mb="M">
              Tendência de Receitas
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
                <AreaChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#e0e0e0' }}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#e0e0e0' }}
                  />
                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(Number(value)),
                      'Receita',
                    ]}
                    labelFormatter={(label) => `Período: ${label}`}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Receita"
                    stroke="#0088FE"
                    fill="#0088FE"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Bar
                    dataKey="enrollments"
                    name="Inscrições"
                    fill="#00C49F"
                    radius={[2, 2, 0, 0]}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Div>
          </Div>

          {/* Métodos de Pagamento */}
          <Div>
            <Typography color="text" variant="title" size="medium" mb="M">
              Distribuição por Método de Pagamento
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
                    data={paymentMethods}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) =>
                      `${name}: ${percentage.toFixed(1)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentMethods.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          PAYMENT_METHOD_COLORS[
                            index % PAYMENT_METHOD_COLORS.length
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(Number(value)),
                      'Valor',
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Div>
          </Div>
        </Div>

        {/* Desempenho por Curso */}
        <Div width="100%" gridColumn="1/-1" mb="XL">
          <Typography color="text" variant="title" size="medium" mb="M">
            Desempenho por Curso
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
                      Curso
                    </Th>
                    <Th
                      color="text"
                      style={{ textAlign: 'left', padding: '12px' }}
                    >
                      Preço
                    </Th>
                    <Th
                      color="text"
                      style={{ textAlign: 'left', padding: '12px' }}
                    >
                      Inscrições
                    </Th>
                    <Th
                      color="text"
                      style={{ textAlign: 'left', padding: '12px' }}
                    >
                      Receita
                    </Th>
                    <Th
                      color="text"
                      style={{ textAlign: 'left', padding: '12px' }}
                    >
                      Taxa Conversão
                    </Th>
                    <Th
                      color="text"
                      style={{ textAlign: 'left', padding: '12px' }}
                    >
                      Valor Médio/Estud.
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {courseRevenues.map((course) => (
                    <Tr
                      key={course.id}
                      borderBottom="1px solid"
                      borderBottomColor="outline"
                      nHover={{ backgroundColor: 'surface' }}
                    >
                      <Td style={{ padding: '12px' }}>
                        <Typography
                          color="text"
                          size="small"
                          fontWeight="500"
                          variant={'body'}
                        >
                          {course.title}
                        </Typography>
                        <Typography
                          color="textVariant"
                          size="extraSmall"
                          variant={'body'}
                        >
                          {course.isFree ? 'Gratuito' : 'Pago'}
                        </Typography>
                      </Td>
                      <Td style={{ padding: '12px' }}>
                        <Typography color="text" size="small" variant={'body'}>
                          {course.isFree
                            ? 'Gratuito'
                            : formatCurrency(course.price || 0)}
                        </Typography>
                      </Td>
                      <Td style={{ padding: '12px' }}>
                        <Div display="flex" flexDirection="column" gap="XS">
                          <Typography
                            color="text"
                            size="small"
                            variant={'body'}
                          >
                            Total: {course.totalEnrollments}
                          </Typography>
                          <Div display="flex" gap="XS">
                            <Typography
                              color="success"
                              size="extraSmall"
                              variant={'body'}
                            >
                              Pagas: {course.paidEnrollments}
                            </Typography>
                            <Typography
                              color="textVariant"
                              size="extraSmall"
                              variant={'body'}
                            >
                              Gratuitas: {course.freeEnrollments}
                            </Typography>
                          </Div>
                        </Div>
                      </Td>
                      <Td style={{ padding: '12px' }}>
                        <Typography
                          color="text"
                          size="small"
                          fontWeight="600"
                          variant={'body'}
                        >
                          {formatCurrency(course.totalRevenue)}
                        </Typography>
                      </Td>
                      <Td style={{ padding: '12px' }}>
                        <Typography
                          size="small"
                          color={
                            course.conversionRate >= 30
                              ? 'success'
                              : course.conversionRate >= 10
                                ? 'warning'
                                : 'error'
                          }
                          variant={'body'}
                        >
                          {formatPercentage(course.conversionRate)}
                        </Typography>
                      </Td>
                      <Td style={{ padding: '12px' }}>
                        <Typography color="text" size="small" variant={'body'}>
                          {formatCurrency(course.avgRevenuePerStudent)}
                        </Typography>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Div>
          </Div>
        </Div>

        {/* Última Linha: Tendências e Pagamentos Pendentes */}
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
          {/* Tendências de Receita */}
          <Div>
            <Typography color="text" variant="title" size="medium" mb="M">
              Tendências de Receita por Período
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
                        Período
                      </Th>
                      <Th
                        color="text"
                        style={{ textAlign: 'left', padding: '12px' }}
                      >
                        Receita
                      </Th>
                      <Th
                        color="text"
                        style={{ textAlign: 'left', padding: '12px' }}
                      >
                        Crescimento
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {revenueTrends.map((trend, index) => (
                      <Tr
                        key={index}
                        borderBottom="1px solid"
                        borderBottomColor="outline"
                      >
                        <Td style={{ padding: '12px' }}>
                          <Typography
                            color="text"
                            size="small"
                            variant={'body'}
                          >
                            {trend.period}
                          </Typography>
                        </Td>
                        <Td style={{ padding: '12px' }}>
                          <Typography
                            color="text"
                            size="small"
                            fontWeight="500"
                            variant={'body'}
                          >
                            {formatCurrency(trend.revenue)}
                          </Typography>
                        </Td>
                        <Td style={{ padding: '12px' }}>
                          <Typography
                            size="small"
                            color={trend.growth >= 0 ? 'success' : 'error'}
                            fontWeight="500"
                            variant={'body'}
                          >
                            {trend.growth >= 0 ? '+' : ''}
                            {formatPercentage(trend.growth)}
                          </Typography>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Div>
            </Div>
          </Div>

          {/* Pagamentos Pendentes */}
          <Div>
            <Typography color="text" variant="title" size="medium" mb="M">
              Pagamentos Pendentes
            </Typography>
            <Div
              p="L"
              borderRadius="M"
              border="1px solid"
              borderColor="outline"
              backgroundColor="surface"
            >
              {upcomingPayouts.length > 0 ? (
                <Div overflowX="auto">
                  <Table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <Thead>
                      <Tr borderBottom="1px solid" borderBottomColor="outline">
                        <Th
                          color="text"
                          style={{ textAlign: 'left', padding: '12px' }}
                        >
                          Curso
                        </Th>
                        <Th
                          color="text"
                          style={{ textAlign: 'left', padding: '12px' }}
                        >
                          Valor
                        </Th>
                        <Th
                          color="text"
                          style={{ textAlign: 'left', padding: '12px' }}
                        >
                          Data Prevista
                        </Th>
                        <Th
                          color="text"
                          style={{ textAlign: 'left', padding: '12px' }}
                        >
                          Estado
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {upcomingPayouts.map((payout) => (
                        <Tr
                          key={payout.id}
                          borderBottom="1px solid"
                          borderBottomColor="outline"
                        >
                          <Td style={{ padding: '12px' }}>
                            <Typography
                              color="text"
                              size="small"
                              variant={'body'}
                            >
                              {payout.courseTitle}
                            </Typography>
                          </Td>
                          <Td style={{ padding: '12px' }}>
                            <Typography
                              color="text"
                              size="small"
                              fontWeight="500"
                              variant={'body'}
                            >
                              {formatCurrency(payout.amount)}
                            </Typography>
                          </Td>
                          <Td style={{ padding: '12px' }}>
                            <Typography
                              color="text"
                              size="small"
                              variant={'body'}
                            >
                              {formatDate(payout.expectedDate)}
                            </Typography>
                          </Td>
                          <Td style={{ padding: '12px' }}>
                            <Typography
                              size="small"
                              color={
                                payout.status === 'completed'
                                  ? 'success'
                                  : payout.status === 'pending'
                                    ? 'warning'
                                    : 'error'
                              }
                              variant={'body'}
                            >
                              {payout.status === 'completed'
                                ? 'Completo'
                                : payout.status === 'pending'
                                  ? 'Pendente'
                                  : 'Falhado'}
                            </Typography>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Div>
              ) : (
                <Div
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  py="L"
                >
                  <CreditCard size={48} color="#94a3b8" />
                  <Typography
                    color="textVariant"
                    textAlign="center"
                    mt="M"
                    size={'small'}
                    variant={'body'}
                  >
                    Sem pagamentos pendentes
                  </Typography>
                </Div>
              )}
            </Div>
          </Div>
        </Div>

        {/* Resumo de Ações */}
        <Div
          p="L"
          width="100%"
          gridColumn="1/-1"
          borderRadius="M"
          border="1px solid"
          borderColor="outline"
          backgroundColor="surface"
        >
          <Typography color="text" variant="title" size="medium" mb="M">
            Insights e Ações Recomendadas
          </Typography>
          <Div
            display="grid"
            gridTemplateColumns={[
              'repeat(1, 1fr)',
              'repeat(2, 1fr)',
              'repeat(3, 1fr)',
              'repeat(3, 1fr)',
            ]}
            gap="L"
          >
            <Box>
              <Typography
                color="text"
                size="small"
                fontWeight="500"
                mb="M"
                color="success"
                variant={'body'}
              >
                Oportunidades
              </Typography>
              <Ul pl="M">
                <Li style={{ marginBottom: '8px' }}>
                  <Typography color="text" size="small" variant={'body'}>
                    {overview?.bestPerformingCourse
                      ? `Curso "${overview.bestPerformingCourse.title}" tem maior receita`
                      : 'Analise os cursos com melhor desempenho'}
                  </Typography>
                </Li>
                <Li style={{ marginBottom: '8px' }}>
                  <Typography color="text" size="small" variant={'body'}>
                    {overview?.conversionRate > 30
                      ? 'Taxa de conversão excelente'
                      : 'Melhore a taxa de conversão dos cursos gratuitos'}
                  </Typography>
                </Li>
                <Li style={{ marginBottom: '8px' }}>
                  <Typography color="text" size="small" variant={'body'}>
                    Considere criar bundles de cursos
                  </Typography>
                </Li>
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
                Monitorização
              </Typography>
              <Ul pl="M">
                <Li style={{ marginBottom: '8px' }}>
                  <Typography color="text" size="small" variant={'body'}>
                    {overview?.pendingPayments
                      ? `${formatCurrency(overview.pendingPayments)} em pagamentos pendentes`
                      : 'Sem pagamentos pendentes'}
                  </Typography>
                </Li>
                <Li style={{ marginBottom: '8px' }}>
                  <Typography color="text" size="small" variant={'body'}>
                    {overview?.refundedAmount
                      ? `${formatCurrency(overview.refundedAmount)} em reembolsos`
                      : 'Sem reembolsos recentes'}
                  </Typography>
                </Li>
                <Li style={{ marginBottom: '8px' }}>
                  <Typography color="text" size="small" variant={'body'}>
                    Verifique os cursos com baixa conversão
                  </Typography>
                </Li>
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
                Próximos Passos
              </Typography>
              <Ul pl="M">
                <Li style={{ marginBottom: '8px' }}>
                  <Typography color="text" size="small" variant={'body'}>
                    Exporte relatórios para contabilidade
                  </Typography>
                </Li>
                <Li style={{ marginBottom: '8px' }}>
                  <Typography color="text" size="small" variant={'body'}>
                    Revise preços dos cursos
                  </Typography>
                </Li>
                <Li style={{ marginBottom: '8px' }}>
                  <Typography color="text" size="small" variant={'body'}>
                    Configure promoções sazonais
                  </Typography>
                </Li>
              </Ul>
            </Box>
          </Div>
        </Div>
      </Box>
    </Layout>
  );
};

export default TeacherFinancialView;
