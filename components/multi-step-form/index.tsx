import { Children } from 'react';

import { Box } from '@/elements';
import { Typography } from '@/elements/typography';

import { MultiStepProps, StepProps } from './multi-step-form.types';

export const MultiStep = ({
  children,
  activeStep,
  prevButton,
  nextButton,
}: MultiStepProps) => {
  const steps = Children.toArray(children);

  return (
    <Box>
      <Box>{steps[activeStep]}</Box>
      <Box display="flex" justifyContent="space-between" mt="2rem">
        {prevButton}
        {nextButton}
      </Box>
    </Box>
  );
};

export const Step = ({ title, children, description }: StepProps) => (
  <>
    <Typography
      variant="headline"
      width="100%"
      lineHeight="100%"
      color="text"
      size="small"
      mb="M"
    >
      {title}
    </Typography>
    <Typography
      variant="body"
      width="100%"
      lineHeight="100%"
      color="text"
      size="medium"
      mb="2XL"
    >
      {description || 'Preencha as informações necessárias.'}
    </Typography>
    {children}
  </>
);
