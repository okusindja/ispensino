import { Resource } from '@prisma/client';

export interface MonographsProps extends Resource {}

export interface MonographsViewProps {
  monographs: MonographsProps[];
}
