export type LineHeights =
  | 'XS'
  | 'S'
  | 'M'
  | 'L'
  | 'XL'
  | '2XL'
  | '3XL'
  | '4XL'
  | '5XL'
  | '6XL';

export const lineHeights: Record<LineHeights, string> = {
  XS: '1rem',
  S: '1.25rem',
  M: '1.5rem',
  L: '1.75rem',
  XL: '2rem',
  '2XL': '2.25rem',
  '3XL': '2.5rem',
  '4XL': '2.75rem',
  '5XL': '3.25rem',
  '6XL': '4rem',
};
