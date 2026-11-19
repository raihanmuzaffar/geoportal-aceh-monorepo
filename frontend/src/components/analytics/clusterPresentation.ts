import type { KependudukanClusterId } from '../../data/kependudukan';

export const clusterOrder: KependudukanClusterId[] = [0, 1, 2];

export const clusterMarkers: Record<
  KependudukanClusterId,
  {
    fill: string;
    shapeClass: string;
    shapeLabel: string;
  }
> = {
  0: {
    fill: 'var(--forest)',
    shapeClass: 'rounded-full',
    shapeLabel: 'lingkaran',
  },
  1: {
    fill: 'var(--earth)',
    shapeClass: 'rotate-45 rounded-[1px]',
    shapeLabel: 'belah ketupat',
  },
  2: {
    fill: 'var(--ink-3)',
    shapeClass: 'rounded-none',
    shapeLabel: 'kotak',
  },
};
