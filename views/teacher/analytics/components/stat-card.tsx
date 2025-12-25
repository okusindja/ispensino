import { FC, ReactNode } from 'react';
import { Div } from '@stylin.js/elements';
import { Typography } from '@/elements/typography';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: number;
  suffix?: string;
}

export const StatCard: FC<StatCardProps> = ({
  title,
  value,
  icon,
  change = 0,
  suffix,
}) => {
  const isPositive = change > 0;
  const changeColor = isPositive
    ? 'success'
    : change < 0
      ? 'error'
      : 'textVariant';

  return (
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
        <Typography size="small" color="textVariant">
          {title}
        </Typography>
        <Div color="textVariant">{icon}</Div>
      </Div>

      <Div display="flex" alignItems="baseline" mb="XS">
        <Typography variant="title" size="large" fontWeight="600">
          {value}
        </Typography>
        {suffix && (
          <Typography size="small" color="textVariant" ml="XS">
            {suffix}
          </Typography>
        )}
      </Div>

      {change !== 0 && (
        <Div display="flex" alignItems="center">
          <Typography size="extraSmall" color={changeColor} fontWeight="500">
            {isPositive ? '+' : ''}
            {change}%
          </Typography>
          <Typography size="extraSmall" color="textVariant" ml="XS">
            from last period
          </Typography>
        </Div>
      )}
    </Div>
  );
};
