import { FIELD_SPECS, SHARED_FIELDS } from './field-specs.js';

export function defaultState() {
  const sections = {};
  for (const [type, specs] of Object.entries(FIELD_SPECS)) {
    sections[type] = {};
    for (const f of specs) sections[type][f.key] = '';
  }
  const shared = {};
  for (const f of SHARED_FIELDS) shared[f.key] = '';
  return { title: '', volume: 'heavy', shared, sections };
}

function parseLines(raw) {
  return String(raw || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.split('|').map((p) => p.trim()));
}

export function stateToContent(state) {
  const s = state.sections;
  const content = {
    meta: { title: state.title || '' },
    _shared: { ...state.shared },
    nav: {
      links: parseLines(s.nav.links).map(([label, href]) => ({ label, href: href || '#' })),
    },
    hero: {
      eyebrow: s.hero.eyebrow, title: s.hero.title, lead: s.hero.lead,
    },
    feature: {
      heading: s.feature.heading,
      items: parseLines(s.feature.items).map(([title, desc]) => ({ title, desc: desc || '' })),
    },
    cta: { heading: s.cta.heading, sub: s.cta.sub },
    footer: {
      columns: parseLines(s.footer.columns).map(([title, label, href]) => ({
        title, links: label ? [{ label, href: href || '#' }] : [],
      })),
    },
  };
  if (s.nav.ctaLabel) content.nav.cta = { label: s.nav.ctaLabel, href: s.nav.ctaHref || '#' };
  if (s.hero.ctaLabel) content.hero.ctas = [{ label: s.hero.ctaLabel, href: s.hero.ctaHref || '#' }];
  if (s.cta.buttonLabel) content.cta.button = { label: s.cta.buttonLabel, href: s.cta.buttonHref || '#' };
  return content;
}
