import { tokens, tokensCss } from './tokens.css.js';

// 섹션 × (기본) variant. MVP은 섹션당 1개.
export const samplePack = {
  meta: { id: 'sample', name: 'Sample (probe)', motionDefault: 'subtle' },
  tokens,
  tokensCss,
  variantMap: {
    nav: 'solid',
    hero: 'split',
    feature: 'grid',
    cta: 'band',
    footer: 'full',
  },
};
