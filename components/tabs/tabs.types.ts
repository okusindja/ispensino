import { ReactNode } from 'react';

export interface TabsProps {
  px?: string;
  position?: 'bottom' | 'top';
  tabList: ReadonlyArray<string>;
  tabContent: ReadonlyArray<ReactNode>;
  variant?: 'primary' | 'secondary' | 'tertiary';
}
