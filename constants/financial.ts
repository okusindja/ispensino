export const CURRENCIES = {
  AOA: { symbol: 'Kz', name: 'Angolan Kwanza', locale: 'pt-PT' },
  USD: { symbol: '$', name: 'US Dollar', locale: 'en-US' },
  EUR: { symbol: '€', name: 'Euro', locale: 'pt-PT' },
  GBP: { symbol: '£', name: 'British Pound', locale: 'en-GB' },
};

export const TIME_RANGES = [
  { value: 'week', label: 'Esta Semana' },
  { value: 'month', label: 'Este Mês' },
  { value: 'quarter', label: 'Este Trimestre' },
  { value: 'year', label: 'Este Ano' },
  { value: 'all', label: 'Todo o Período' },
];

export const PAYMENT_STATUS_COLORS = {
  COMPLETED: 'success',
  PENDING: 'warning',
  FAILED: 'error',
  REFUNDED: 'textVariant',
};

export const PAYMENT_STATUS_LABELS = {
  COMPLETED: 'Completo',
  PENDING: 'Pendente',
  FAILED: 'Falhado',
  REFUNDED: 'Reembolsado',
};
