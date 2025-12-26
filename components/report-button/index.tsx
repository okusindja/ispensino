import { useState } from 'react';
import {
  Flag,
  AlertTriangle,
  FlagTriangleRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/elements';
import { Div } from '@stylin.js/elements';
import { Typography } from '@/elements/typography';
import { SelectField } from '@/components/select-field';
import { TextField } from '@/components/text-field';
import { useDialog } from '@/contexts';

interface ReportButtonProps {
  targetId: string;
  targetType:
    | 'USER'
    | 'POST'
    | 'COURSE'
    | 'MONOGRAPH'
    | 'SCIENTIFIC_ARTICLE'
    | 'COMMENT'
    | 'RESOURCE';
  targetTitle?: string;
  userId: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

const REPORT_REASONS = [
  { value: 'SPAM', label: 'Spam ou conteúdo comercial' },
  { value: 'INAPPROPRIATE', label: 'Conteúdo inadequado ou ofensivo' },
  { value: 'HARASSMENT', label: 'Assédio ou bullying' },
  { value: 'HATE_SPEECH', label: 'Discurso de ódio' },
  { value: 'MISINFORMATION', label: 'Desinformação ou fake news' },
  { value: 'COPYRIGHT', label: 'Violação de direitos autorais' },
  { value: 'PRIVACY', label: 'Violação de privacidade' },
  { value: 'IMPERSONATION', label: 'Imitação ou falsa identidade' },
  { value: 'OTHER', label: 'Outro motivo' },
];

const ReportButton = ({
  targetId,
  targetType,
  targetTitle,
  userId,
  className,
  size = 'medium',
  variant = 'ghost',
}: ReportButtonProps) => {
  const { openDialog } = useDialog();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReportClick = () => {
    openDialog(
      <ReportDialogContent
        targetId={targetId}
        targetType={targetType}
        targetTitle={targetTitle}
        userId={userId}
        onClose={() => {}}
      />,
      {
        title: 'Reportar Conteúdo',
        description:
          'Ajude-nos a manter a comunidade segura reportando conteúdos inadequados.',
        size: 'md',
        showClose: true,
      }
    );
  };

  return (
    <Button
      variant={'neutral'}
      size={size}
      onClick={handleReportClick}
      disabled={isSubmitting}
      className={className}
    >
      Reportar
    </Button>
  );
};

interface ReportDialogContentProps {
  targetId: string;
  targetType: string;
  targetTitle?: string;
  userId: string;
  onClose: () => void;
}

const ReportDialogContent = ({
  targetId,
  targetType,
  targetTitle,
  userId,
  onClose,
}: ReportDialogContentProps) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) {
      setError('Por favor, selecione um motivo para o report.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetId,
          targetType,
          reason: selectedReason === 'OTHER' ? customReason : selectedReason,
          customReason: selectedReason === 'OTHER' ? customReason : undefined,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao submeter o report');
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Ocorreu um erro. Tente novamente.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <Div p="XL" textAlign="center">
        <Div display="flex" justifyContent="center" mb="M">
          <ShieldAlert size={48} color="var(--colors-success)" />
        </Div>
        <Typography variant="title" size="medium" mb="M" color="success">
          Report Submetido com Sucesso!
        </Typography>
        <Typography variant="body" size="small" color="textVariant">
          A equipa de administração irá rever o seu report brevemente. Obrigado
          por ajudar a manter a comunidade segura.
        </Typography>
      </Div>
    );
  }

  return (
    <Div p="XL">
      {targetTitle && (
        <Div mb="L" p="M" borderRadius="M" backgroundColor="surface">
          <Typography variant="body" size="small" fontWeight="500" mb="XS">
            A reportar:
          </Typography>
          <Typography variant="body" size="small" color="textVariant">
            {targetType.toLowerCase().replace('_', ' ')}: {targetTitle}
          </Typography>
        </Div>
      )}

      <Div mb="L">
        <Typography variant="body" size="small" fontWeight="500" mb="M">
          Motivo do Report *
        </Typography>
        <SelectField
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
          label="Selecione um motivo"
          required
        >
          <option value="">Selecione um motivo</option>
          {REPORT_REASONS.map((reason) => (
            <option key={reason.value} value={reason.value}>
              {reason.label}
            </option>
          ))}
        </SelectField>
      </Div>

      {selectedReason === 'OTHER' && (
        <Div mb="L">
          <Typography variant="body" size="small" fontWeight="500" mb="M">
            Por favor, especifique o motivo *
          </Typography>
          <TextField
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder="Descreva o motivo do report..."
            label="Descreva o motivo do report..."
            required
          />
        </Div>
      )}

      <Div
        mb="L"
        p="M"
        borderRadius="M"
        border="1px solid"
        borderColor="warning"
      >
        <Div display="flex" alignItems="center" gap="S" mb="XS">
          <AlertTriangle size={16} color="var(--colors-warning)" />
          <Typography
            variant="body"
            size="small"
            fontWeight="500"
            color="warning"
          >
            Informação Importante
          </Typography>
        </Div>
        <Typography variant="body" size="extraSmall" color="textVariant">
          Os reports são anónimos. A equipa de administração irá rever o
          conteúdo e tomar as medidas necessárias. Reportes falsos podem
          resultar em penalizações na sua conta.
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
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          size="medium"
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedReason}
        >
          {isSubmitting ? 'A submeter...' : 'Submeter Report'}
        </Button>
      </Div>
    </Div>
  );
};

export default ReportButton;
