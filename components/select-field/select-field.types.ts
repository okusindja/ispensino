import { ReactNode } from 'react';

export type SelectFieldStatus = 'none' | 'error' | 'success';

export interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  supportingText?: string;
  status?: SelectFieldStatus;
  disabled?: boolean;
  Prefix?: ReactNode;
  Suffix?: ReactNode;
  fieldProps?: Record<string, any>;
  children: ReactNode;
}
