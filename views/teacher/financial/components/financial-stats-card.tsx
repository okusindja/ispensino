import { FC, ReactNode } from 'react';
import { Div } from '@stylin.js/elements';
import { Typography } from '@/elements/typography';

interface FinancialStatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: number;
  suffix?: string;
  description?: string;
  trendColor?: 'success' | 'error' | 'warning' | 'textVariant';
}

export const FinancialStatsCard: FC<FinancialStatsCardProps> = ({
  title,
  value,
  icon,
  change = 0,
  suffix,
  description,
  trendColor,
}) => {
  const displayTrendColor = trendColor || (change >= 0 ? 'success' : 'error');
  const showTrend = change !== 0;

  return (
    <Div
      p="L"
      borderRadius="M"
      border="1px solid"
      borderColor="outline"
      backgroundColor="surface"
      transition="all 0.2s ease"
      nHover={{
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Div
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb="M"
      >
        <Typography size="small" color="textVariant" variant={'body'}>
          {title}
        </Typography>
        <Div color="primary">{icon}</Div>
      </Div>

      <Div display="flex" alignItems="baseline" mb="XS" gap="XS">
        <Typography color="text" variant="title" size="large" fontWeight="600">
          {value}
        </Typography>
        {suffix && (
          <Typography size="small" color="textVariant" variant={'body'}>
            {suffix}
          </Typography>
        )}
      </Div>

      {(showTrend || description) && (
        <Div display="flex" alignItems="center" gap="XS" flexWrap="wrap">
          {showTrend && (
            <Typography
              size="extraSmall"
              color={displayTrendColor}
              fontWeight="500"
              variant={'body'}
            >
              {change >= 0 ? '+' : ''}
              {change}%
            </Typography>
          )}
          {description && (
            <Typography size="extraSmall" color="textVariant" variant={'body'}>
              {description}
            </Typography>
          )}
        </Div>
      )}
    </Div>
  );
};
