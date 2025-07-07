import { ReactNode } from 'react';

export interface MultiStepProps {
  children: ReactNode[];
  activeStep: number;
  prevButton: ReactNode;
  nextButton: ReactNode;
}

export interface StepProps {
  title: string;
  description?: string;
  children: ReactNode;
}
