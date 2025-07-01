import breakpoints from '@/design-system/common/breakpoints';
import space from '@/design-system/common/space';

const container = {
  gap: space.L,
  display: 'grid',
  padding: `${space.M} ${space.M}`,
  justifyItems: 'center',
  gridTemplateColumns: 'repeat(4, 1fr)',
  [`@media (min-width: ${breakpoints[1]})`]: {
    gap: space.XL,
    margin: '0 auto',
    maxWidth: '80rem',
    padding: `0 ${space.XL}`,
    gridTemplateColumns: 'repeat(12, 1fr)',
  },
};

export default { container };
