import { FC } from 'react';
import { SVGProps } from '../svg/svg.types';

export interface OptionItemProps {
  label: string;
  Icon: FC<SVGProps>;
  onClick?: () => void;
}
