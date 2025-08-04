import { FC, ReactNode } from 'react';

import { SVGProps } from '@/components/svg/svg.types';

export interface ContentItemProps {
  to: string;
  title: string;
  Icon: FC<SVGProps>;
  description: string;
  footerLeft?: ReactNode;
  footerRight?: ReactNode;
}
