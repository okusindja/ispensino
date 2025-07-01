import {
  ISizeStyle,
  TTypographySizes,
  TTypographyVariants,
} from './typography.types';

export const getSizeStyle = (
  variant: TTypographyVariants,
  size: TTypographySizes
): ISizeStyle =>
  ({
    headline: {
      large: { fontSize: '5XL' },
      medium: { fontSize: '4XL' },
      small: { fontSize: '3XL' },
      extraSmall: { fontSize: '3XL' },
      micro: { fontSize: '3XL' },
    },
    title: {
      large: { fontSize: '4XL', fontWeight: '800' },
      medium: {
        fontSize: '2XL',
        fontWeight: '700',
      },
      small: { fontSize: 'S' },
      extraSmall: { fontSize: 'S' },
      micro: { fontSize: 'S' },
    },
    large: {
      large: { fontSize: '5XL' },
      medium: { fontSize: '3XL' },
      small: { fontSize: 'S' },
      extraSmall: { fontSize: 'S' },
      micro: { fontSize: 'S' },
    },
    body: {
      large: { fontSize: 'L' },
      medium: { fontSize: 'M' },
      small: { fontSize: 'S' },
      extraSmall: { fontSize: '3XS' },
      micro: { fontSize: '4XS' },
    },
    fancy: {
      large: { fontSize: 'L' },
      medium: { fontSize: '2XS' },
      small: { fontSize: '3XS', fontWeight: '400' },
      extraSmall: { fontSize: '3XS' },
      micro: { fontSize: '3XS' },
    },
    label: {
      large: { fontSize: 'S' },
      medium: { fontSize: 'XS' },
      small: { fontSize: '2XS' },
      extraSmall: { fontSize: '2XS' },
      micro: { fontSize: '2XS' },
    },
  })[variant][size];
