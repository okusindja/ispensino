import { DivProps } from '@stylin.js/elements';
import { StylinComponentProps } from '@stylin.js/react';
import { InputHTMLAttributes, ReactNode } from 'react';

export type TextFieldElementProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'color' | 'translate' | 'height' | 'width' | 'content'
>;

export interface TextFieldProps
  extends StylinComponentProps,
    TextFieldElementProps {
  label?: string;
  Suffix?: ReactNode;
  Prefix?: ReactNode;
  fieldProps?: DivProps;
  supportingText?: string;
  status?: 'error' | 'success' | 'none';
}
