import { ReactNode } from 'react';

export interface TabsProps {
  px?: string;
  tabList: ReadonlyArray<string>;
  tabContent: ReadonlyArray<ReactNode>;
  variant?: 'primary' | 'secondary' | 'tertiary';
}
