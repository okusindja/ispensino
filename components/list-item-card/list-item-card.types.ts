import { FC, ReactNode } from 'react';

import { SVGProps } from '../svg/svg.types';

export interface ListItemCardProps {
  title: string;
  to?: string;
  description?: string;
  footerLeft?: ReactNode;
  footerRight?: ReactNode;
  Icon?: FC<SVGProps>;
}
