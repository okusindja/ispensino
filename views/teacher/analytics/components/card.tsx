import { FC, ReactNode } from 'react';
import { Div } from '@stylin.js/elements';
import { Box } from '@/elements';
import { Typography } from '@/elements/typography';

interface CardProps {
  title?: string;
  children: ReactNode;
  padding?: string;
  height?: string;
}

export const Card: FC<CardProps> = ({
  title,
  children,
  padding = 'L',
  height,
}) => {
  return (
    <Div
      p={padding}
      height={height}
      borderRadius="M"
      border="1px solid"
      borderColor="outline"
      backgroundColor="surface"
    >
      {title && (
        <Typography variant="title" size="medium" mb="M" fontWeight="500">
          {title}
        </Typography>
      )}
      <Box>{children}</Box>
    </Div>
  );
};
