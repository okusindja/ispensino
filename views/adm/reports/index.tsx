import { useState, useEffect } from 'react';
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
  Select,
  Input,
} from '@stylin.js/elements';
import { Typography } from '@/elements/typography';
import {
  Flag,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Search,
  User,
  FileText,
  BookOpen,
  MessageSquare,
  FileBox,
  Shield,
  Clock,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { SelectField } from '@/components/select-field';
import { TextField } from '@/components/text-field';
import { fetcherWithCredentials } from '@/constants/fetchers';
import { useAuth } from '@/contexts';
import { useDialog } from '@/contexts';

const AdminReportsView = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { openDialog } = useDialog();

  const [filters, setFilters] = useState({
    status: '',
    targetType: '',
    search: '',
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data, error, isLoading, mutate } = useSWR<{
    reports: any[];
    pagination: { total: number; totalPages: number };
  }>(
    user?.role === 'ADMIN'
      ? `/api/reports?${new URLSearchParams({
          status: filters.status,
          targetType: filters.targetType,
          page: filters.page.toString(),
          limit: filters.limit.toString(),
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        }).toString()}`
      : null,
    fetcherWithCredentials,
    {
      revalidateOnFocus: false,
    }
  );

  const handleStatusChange = (
    reportId: string,
    newStatus: string,
    resolutionNotes?: string
  ) => {
    openDialog(
      <UpdateReportDialog
        reportId={reportId}
        currentStatus={data?.reports.find((r) => r.id === reportId)?.status}
        onSuccess={() => mutate()}
      />,
      {
        title: 'Atualizar Estado do Report',
        size: 'md',
        showClose: true,
      }
    );
  };

  const handleViewReport = (report: any) => {
    openDialog(<ReportDetailsDialog report={report} />, {
      title: 'Detalhes do Report',
      size: 'lg',
      showClose: true,
    });
  };

  const handleDeleteReport = (reportId: string) => {
    openDialog(
      <DeleteReportDialog reportId={reportId} onSuccess={() => mutate()} />,
      {
        title: 'Confirmar Eliminação',
        description: 'Tem a certeza que pretende eliminar este report?',
        size: 'sm',
        showClose: true,
      }
    );
  };

  const getTargetIcon = (targetType: string) => {
    switch (targetType) {
      case 'USER':
        return <User size={16} />;
      case 'POST':
        return <FileText size={16} />;
      case 'COURSE':
        return <BookOpen size={16} />;
      case 'MONOGRAPH':
        return <FileBox size={16} />;
      case 'SCIENTIFIC_ARTICLE':
        return <FileText size={16} />;
      case 'COMMENT':
        return <MessageSquare size={16} />;
      case 'RESOURCE':
        return <FileBox size={16} />;
      default:
        return <Flag size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'UNDER_REVIEW':
        return 'primary';
      case 'RESOLVED':
        return 'success';
      case 'DISMISSED':
        return 'error';
      default:
        return 'textVariant';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendente';
      case 'UNDER_REVIEW':
        return 'Em Revisão';
      case 'RESOLVED':
        return 'Resolvido';
      case 'DISMISSED':
        return 'Rejeitado';
      default:
        return status;
    }
  };

  if (user?.role !== 'ADMIN') {
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
            <Shield size={48} color="#94a3b8" />
            <Typography variant="title" color="text" size="medium" mb="XS">
              Acesso Restrito
            </Typography>
            <Typography
              color="textVariant"
              textAlign="center"
              mb="L"
              size={'small'}
              variant={'body'}
            >
              Apenas administradores podem aceder a esta página.
            </Typography>
            <Button
              variant="primaryVariant"
              size="medium"
              onClick={() => router.push('/')}
            >
              Voltar à Página Inicial
            </Button>
          </Div>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout hasGoBack>
      <Box variant="container" py="XL">
        {/* Header */}
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
              Gestão de Reports
            </Typography>
            <Typography
              color="textVariant"
              size="small"
              mb="M"
              variant={'body'}
            >
              Revise e gerencie reports submetidos pelos utilizadores
            </Typography>
          </Div>

          <Div display="flex" gap="M" alignItems="center" flexWrap="wrap">
            <Button variant="primary" size="medium" onClick={() => mutate()}>
              Atualizar
            </Button>
          </Div>
        </Div>

        {/* Filters */}
        <Div
          width="100%"
          gridColumn="1/-1"
          mb="XL"
          p="L"
          borderRadius="M"
          border="1px solid"
          borderColor="outline"
          backgroundColor="surface"
        >
          <Typography color="text" variant="title" size="small" mb="M">
            <Filter
              size={16}
              style={{ marginRight: '8px', verticalAlign: 'middle' }}
            />
            Filtros
          </Typography>

          <Div
            display="grid"
            gridTemplateColumns={[
              'repeat(1, 1fr)',
              'repeat(2, 1fr)',
              'repeat(4, 1fr)',
              'repeat(4, 1fr)',
            ]}
            gap="M"
          >
            <Div>
              <Typography
                color="textVariant"
                size="extraSmall"
                mb="XS"
                variant={'body'}
              >
                Estado
              </Typography>
              <SelectField
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value, page: 1 })
                }
              >
                <option value="">Todos os Estados</option>
                <option value="PENDING">Pendente</option>
                <option value="UNDER_REVIEW">Em Revisão</option>
                <option value="RESOLVED">Resolvido</option>
                <option value="DISMISSED">Rejeitado</option>
              </SelectField>
            </Div>

            <Div>
              <Typography
                color="textVariant"
                size="extraSmall"
                mb="XS"
                variant={'body'}
              >
                Tipo de Conteúdo
              </Typography>
              <SelectField
                value={filters.targetType}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    targetType: e.target.value,
                    page: 1,
                  })
                }
              >
                <option value="">Todos os Tipos</option>
                <option value="USER">Utilizador</option>
                <option value="POST">Publicação</option>
                <option value="COURSE">Curso</option>
                <option value="MONOGRAPH">Monografia</option>
                <option value="SCIENTIFIC_ARTICLE">Artigo Científico</option>
                <option value="COMMENT">Comentário</option>
                <option value="RESOURCE">Recurso</option>
              </SelectField>
            </Div>

            <Div>
              <Typography
                color="textVariant"
                size="extraSmall"
                mb="XS"
                variant={'body'}
              >
                Ordenar por
              </Typography>
              <SelectField
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({ ...filters, sortBy: e.target.value })
                }
              >
                <option value="createdAt">Data de Criação</option>
                <option value="updatedAt">Data de Atualização</option>
                <option value="status">Estado</option>
              </SelectField>
            </Div>

            <Div>
              <Typography
                color="textVariant"
                size="extraSmall"
                mb="XS"
                variant={'body'}
              >
                Ordem
              </Typography>
              <SelectField
                value={filters.sortOrder}
                onChange={(e) =>
                  setFilters({ ...filters, sortOrder: e.target.value })
                }
              >
                <option value="desc">Mais Recente</option>
                <option value="asc">Mais Antigo</option>
              </SelectField>
            </Div>
          </Div>

          <Div mt="M">
            <TextField
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value, page: 1 })
              }
              placeholder="Pesquisar por ID, motivo ou notas..."
              Prefix={<Search size={16} />}
            />
          </Div>
        </Div>

        {/* Loading State */}
        {isLoading && (
          <Div
            width="100%"
            gridColumn="1/-1"
            display="flex"
            justifyContent="center"
            py="XL"
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
          </Div>
        )}

        {/* Error State */}
        {error && (
          <Div
            width="100%"
            gridColumn="1/-1"
            mb="XL"
            p="L"
            borderRadius="M"
            backgroundColor="error"
            color="white"
          >
            <Div display="flex" alignItems="center" gap="S">
              <AlertTriangle size={20} />
              <Typography variant="body" size="small">
                Erro ao carregar reports: {error.message}
              </Typography>
            </Div>
          </Div>
        )}

        {/* Reports Table */}
        {data && (
          <>
            <Div width="100%" gridColumn="1/-1" mb="XL">
              <Typography color="text" variant="title" size="small" mb="M">
                Reports ({data.pagination.total})
              </Typography>

              <Div
                borderRadius="M"
                border="1px solid"
                borderColor="outline"
                backgroundColor="surface"
                overflow="hidden"
              >
                <Div overflowX="auto">
                  <Table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <Thead>
                      <Tr backgroundColor="surface">
                        <Th
                          color="text"
                          style={{
                            textAlign: 'left',
                            padding: '12px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          ID
                        </Th>
                        <Th
                          color="text"
                          style={{ textAlign: 'left', padding: '12px' }}
                        >
                          Tipo
                        </Th>
                        <Th
                          color="text"
                          style={{ textAlign: 'left', padding: '12px' }}
                        >
                          Motivo
                        </Th>
                        <Th
                          color="text"
                          style={{ textAlign: 'left', padding: '12px' }}
                        >
                          Reportado por
                        </Th>
                        <Th
                          color="text"
                          style={{ textAlign: 'left', padding: '12px' }}
                        >
                          Estado
                        </Th>
                        <Th
                          color="text"
                          style={{ textAlign: 'left', padding: '12px' }}
                        >
                          Data
                        </Th>
                        <Th
                          color="text"
                          style={{ textAlign: 'left', padding: '12px' }}
                        >
                          Ações
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data.reports.map((report) => (
                        <Tr
                          key={report.id}
                          borderTop="1px solid"
                          borderTopColor="outline"
                          nHover={{ backgroundColor: 'surface' }}
                        >
                          <Td style={{ padding: '12px' }}>
                            <Typography
                              color="textVariant"
                              size="extraSmall"
                              fontFamily="monospace"
                              variant={'body'}
                            >
                              {report.id.slice(0, 8)}...
                            </Typography>
                          </Td>
                          <Td style={{ padding: '12px' }}>
                            <Div display="flex" alignItems="center" gap="XS">
                              {getTargetIcon(report.targetType)}
                              <Typography
                                color="text"
                                size="small"
                                variant={'body'}
                              >
                                {report.targetType.replace('_', ' ')}
                              </Typography>
                            </Div>
                          </Td>
                          <Td style={{ padding: '12px' }}>
                            <Typography
                              color="text"
                              size="small"
                              variant={'body'}
                              title={report.reason}
                            >
                              {report.reason.length > 50
                                ? `${report.reason.slice(0, 50)}...`
                                : report.reason}
                            </Typography>
                            {report.customReason && (
                              <Typography
                                color="textVariant"
                                size="extraSmall"
                                variant={'body'}
                              >
                                {report.customReason.slice(0, 30)}...
                              </Typography>
                            )}
                          </Td>
                          <Td style={{ padding: '12px' }}>
                            <Div display="flex" alignItems="center" gap="S">
                              {report.reporter.image ? (
                                <Div
                                  width="24px"
                                  height="24px"
                                  borderRadius="50%"
                                  backgroundImage={`url(${report.reporter.image})`}
                                  backgroundSize="cover"
                                  backgroundPosition="center"
                                />
                              ) : (
                                <Div
                                  width="24px"
                                  height="24px"
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
                                    {report.reporter.name?.charAt(0) || 'U'}
                                  </Typography>
                                </Div>
                              )}
                              <Typography
                                color="text"
                                size="small"
                                variant={'body'}
                              >
                                {report.reporter.name || 'Anónimo'}
                              </Typography>
                            </Div>
                          </Td>
                          <Td style={{ padding: '12px' }}>
                            <Typography
                              size="small"
                              color={getStatusColor(report.status)}
                              fontWeight="500"
                              variant={'body'}
                            >
                              {getStatusLabel(report.status)}
                            </Typography>
                          </Td>
                          <Td style={{ padding: '12px' }}>
                            <Typography
                              color="text"
                              size="small"
                              variant={'body'}
                            >
                              {new Date(report.createdAt).toLocaleDateString(
                                'pt-PT'
                              )}
                            </Typography>
                            <Typography
                              color="textVariant"
                              size="extraSmall"
                              variant={'body'}
                            >
                              {new Date(report.createdAt).toLocaleTimeString(
                                'pt-PT',
                                { hour: '2-digit', minute: '2-digit' }
                              )}
                            </Typography>
                          </Td>
                          <Td style={{ padding: '12px' }}>
                            <Div display="flex" gap="XS" flexWrap="wrap">
                              <Button
                                variant="primary"
                                size="small"
                                onClick={() => handleViewReport(report)}
                              >
                                Ver
                              </Button>

                              {report.status !== 'RESOLVED' &&
                                report.status !== 'DISMISSED' && (
                                  <>
                                    <Button
                                      variant="primary"
                                      size="small"
                                      color="success"
                                      onClick={() =>
                                        handleStatusChange(
                                          report.id,
                                          'RESOLVED'
                                        )
                                      }
                                    >
                                      <CheckCircle size={14} />
                                      Resolver
                                    </Button>
                                    <Button
                                      variant="primary"
                                      size="small"
                                      color="error"
                                      onClick={() =>
                                        handleStatusChange(
                                          report.id,
                                          'DISMISSED'
                                        )
                                      }
                                    >
                                      <XCircle size={14} />
                                      Rejeitar
                                    </Button>
                                  </>
                                )}

                              <Button
                                variant="primaryVariant"
                                size="small"
                                color="error"
                                onClick={() => handleDeleteReport(report.id)}
                              >
                                <Trash2 size={14} />
                                Eliminar
                              </Button>
                            </Div>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Div>
              </Div>
            </Div>

            {/* Pagination */}
            {data.pagination.totalPages > 1 && (
              <Div
                width="100%"
                gridColumn="1/-1"
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap="M"
                mb="XL"
              >
                <Button
                  variant="primary"
                  size="small"
                  onClick={() =>
                    setFilters({ ...filters, page: filters.page - 1 })
                  }
                  disabled={filters.page <= 1}
                >
                  Anterior
                </Button>

                <Typography color="text" size="small" variant={'body'}>
                  Página {filters.page} de {data.pagination.totalPages}
                </Typography>

                <Button
                  variant="primary"
                  size="small"
                  onClick={() =>
                    setFilters({ ...filters, page: filters.page + 1 })
                  }
                  disabled={filters.page >= data.pagination.totalPages}
                >
                  Próxima
                </Button>
              </Div>
            )}
          </>
        )}

        {/* No Reports State */}
        {!isLoading && !error && data?.reports.length === 0 && (
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
            <Flag size={64} color="#94a3b8" />
            <Typography
              color="text"
              variant="title"
              size="medium"
              mt="M"
              mb="XS"
            >
              Sem Reports Pendentes
            </Typography>
            <Typography
              color="textVariant"
              mb="L"
              size={'small'}
              variant={'body'}
            >
              Não existem reports que correspondam aos seus filtros.
            </Typography>
          </Div>
        )}
      </Box>
    </Layout>
  );
};

// Dialog Components
const UpdateReportDialog = ({ reportId, currentStatus, onSuccess }: any) => {
  const [status, setStatus] = useState(currentStatus || 'RESOLVED');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          resolutionNotes,
          actionTaken,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar o report');
      }

      onSuccess();
      // Close dialog
      (
        document.querySelector('[data-radix-dialog-close]') as HTMLElement
      )?.click();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Ocorreu um erro. Tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Div p="XL">
      <Div mb="L">
        <Typography variant="body" size="small" fontWeight="500" mb="M">
          Novo Estado *
        </Typography>
        <SelectField value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="RESOLVED">Resolvido</option>
          <option value="DISMISSED">Rejeitado</option>
          <option value="UNDER_REVIEW">Em Revisão</option>
          <option value="PENDING">Pendente</option>
        </SelectField>
      </Div>

      <Div mb="L">
        <Typography variant="body" size="small" fontWeight="500" mb="M">
          Notas de Resolução
        </Typography>
        <TextField
          value={resolutionNotes}
          onChange={(e) => setResolutionNotes(e.target.value)}
          placeholder="Descreva como o report foi resolvido..."
        />
      </Div>

      <Div mb="L">
        <Typography variant="body" size="small" fontWeight="500" mb="M">
          Ações Tomadas
        </Typography>
        <TextField
          value={actionTaken}
          onChange={(e) => setActionTaken(e.target.value)}
          placeholder="Descreva as ações tomadas (ex: conteúdo removido, utilizador banido)..."
        />
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
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          size="medium"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          Atualizar Report
        </Button>
      </Div>
    </Div>
  );
};

const ReportDetailsDialog = ({ report }: any) => {
  return (
    <Div p="XL">
      <Div display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="L" mb="L">
        <Div>
          <Typography
            variant="body"
            size="small"
            fontWeight="500"
            mb="XS"
            color="textVariant"
          >
            ID do Report
          </Typography>
          <Typography variant="body" size="small" fontFamily="monospace">
            {report.id}
          </Typography>
        </Div>

        <Div>
          <Typography
            variant="body"
            size="small"
            fontWeight="500"
            mb="XS"
            color="textVariant"
          >
            Tipo de Conteúdo
          </Typography>
          <Typography variant="body" size="small">
            {report.targetType.replace('_', ' ')}
          </Typography>
        </Div>

        <Div>
          <Typography
            variant="body"
            size="small"
            fontWeight="500"
            mb="XS"
            color="textVariant"
          >
            Estado
          </Typography>
          <Typography
            variant="body"
            size="small"
            color={
              report.status === 'PENDING'
                ? 'warning'
                : report.status === 'RESOLVED'
                  ? 'success'
                  : report.status === 'DISMISSED'
                    ? 'error'
                    : 'primary'
            }
          >
            {report.status}
          </Typography>
        </Div>

        <Div>
          <Typography
            variant="body"
            size="small"
            fontWeight="500"
            mb="XS"
            color="textVariant"
          >
            Data de Criação
          </Typography>
          <Typography variant="body" size="small">
            {new Date(report.createdAt).toLocaleDateString('pt-PT')}{' '}
            {new Date(report.createdAt).toLocaleTimeString('pt-PT')}
          </Typography>
        </Div>
      </Div>

      <Div mb="L">
        <Typography
          variant="body"
          size="small"
          fontWeight="500"
          mb="XS"
          color="textVariant"
        >
          Motivo do Report
        </Typography>
        <Div p="M" borderRadius="M" backgroundColor="surface">
          <Typography variant="body" size="small">
            {report.reason}
          </Typography>
          {report.customReason && (
            <Typography variant="body" size="small" color="textVariant" mt="S">
              Detalhes: {report.customReason}
            </Typography>
          )}
        </Div>
      </Div>

      <Div mb="L">
        <Typography
          variant="body"
          size="small"
          fontWeight="500"
          mb="XS"
          color="textVariant"
        >
          Reportado por
        </Typography>
        <Div
          p="M"
          borderRadius="M"
          backgroundColor="surface"
          display="flex"
          alignItems="center"
          gap="M"
        >
          {report.reporter.image ? (
            <Div
              width="40px"
              height="40px"
              borderRadius="50%"
              backgroundImage={`url(${report.reporter.image})`}
              backgroundSize="cover"
              backgroundPosition="center"
            />
          ) : (
            <Div
              width="40px"
              height="40px"
              borderRadius="50%"
              backgroundColor="primaryLight"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography color="primary" variant="title" size="medium">
                {report.reporter.name?.charAt(0) || 'U'}
              </Typography>
            </Div>
          )}
          <Div>
            <Typography variant="body" size="small" fontWeight="500">
              {report.reporter.name || 'Anónimo'}
            </Typography>
            <Typography variant="body" size="extraSmall" color="textVariant">
              {report.reporter.email}
            </Typography>
            <Typography variant="body" size="extraSmall" color="textVariant">
              Membro desde{' '}
              {new Date(report.reporter.createdAt).toLocaleDateString('pt-PT')}
            </Typography>
          </Div>
        </Div>
      </Div>

      {report.targetDetails && (
        <Div mb="L">
          <Typography
            variant="body"
            size="small"
            fontWeight="500"
            mb="XS"
            color="textVariant"
          >
            Detalhes do Conteúdo Reportado
          </Typography>
          <Div
            p="M"
            borderRadius="M"
            backgroundColor="surface"
            maxHeight="200px"
            overflowY="auto"
          >
            <pre
              style={{
                margin: 0,
                fontSize: '12px',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {JSON.stringify(report.targetDetails, null, 2)}
            </pre>
          </Div>
        </Div>
      )}

      {report.resolutionNotes && (
        <Div mb="L">
          <Typography
            variant="body"
            size="small"
            fontWeight="500"
            mb="XS"
            color="textVariant"
          >
            Notas de Resolução
          </Typography>
          <Div p="M" borderRadius="M" backgroundColor="surface">
            <Typography variant="body" size="small">
              {report.resolutionNotes}
            </Typography>
          </Div>
        </Div>
      )}

      {report.actionTaken && (
        <Div mb="L">
          <Typography
            variant="body"
            size="small"
            fontWeight="500"
            mb="XS"
            color="textVariant"
          >
            Ações Tomadas
          </Typography>
          <Div p="M" borderRadius="M" backgroundColor="surface">
            <Typography variant="body" size="small">
              {report.actionTaken}
            </Typography>
          </Div>
        </Div>
      )}

      {report.resolvedBy && (
        <Div>
          <Typography
            variant="body"
            size="small"
            fontWeight="500"
            mb="XS"
            color="textVariant"
          >
            Resolvido por
          </Typography>
          <Div
            p="M"
            borderRadius="M"
            backgroundColor="surface"
            display="flex"
            alignItems="center"
            gap="M"
          >
            <Div
              width="40px"
              height="40px"
              borderRadius="50%"
              backgroundColor="primaryLight"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography color="primary" variant="title" size="medium">
                {report.resolvedBy.name?.charAt(0) || 'A'}
              </Typography>
            </Div>
            <Div>
              <Typography variant="body" size="small" fontWeight="500">
                {report.resolvedBy.name}
              </Typography>
              <Typography variant="body" size="extraSmall" color="textVariant">
                {report.resolvedBy.email}
              </Typography>
              {report.resolvedAt && (
                <Typography
                  variant="body"
                  size="extraSmall"
                  color="textVariant"
                >
                  Resolvido em{' '}
                  {new Date(report.resolvedAt).toLocaleDateString('pt-PT')}
                </Typography>
              )}
            </Div>
          </Div>
        </Div>
      )}
    </Div>
  );
};

const DeleteReportDialog = ({ reportId, onSuccess }: any) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Falha ao eliminar o report');
      }

      onSuccess();
      // Close dialog
      (
        document.querySelector('[data-radix-dialog-close]') as HTMLElement
      )?.click();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Ocorreu um erro. Tente novamente.'
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
          <AlertTriangle size={16} color="var(--colors-error)" />
          <Typography
            variant="body"
            size="small"
            fontWeight="500"
            color="error"
          >
            Atenção
          </Typography>
        </Div>
        <Typography variant="body" size="extraSmall" color="textVariant">
          Esta ação é irreversível. O report será permanentemente eliminado do
          sistema.
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
          variant="primary"
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
          variant="primary"
          size="medium"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 size={16} />
          {isDeleting ? 'A eliminar...' : 'Eliminar Report'}
        </Button>
      </Div>
    </Div>
  );
};

export default AdminReportsView;
