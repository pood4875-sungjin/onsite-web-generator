import { nav } from './nav.js';
import { hero } from './hero.js';
import { feature } from './feature.js';
import { cta } from './cta.js';
import { footer } from './footer.js';

export const sections = [nav, hero, feature, cta, footer];
export const byId = Object.fromEntries(sections.map((s) => [s.type, s]));
