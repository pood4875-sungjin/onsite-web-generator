import { safeUrl } from '../url.js';

export const footer = {
  type: 'footer',
  variants: ['full', 'slim'],
  slots: {
    columns: { kind: 'list', min: 0, max: 5, item: { title: 'text', links: 'list' } },
  },
  render(data, variant, ctx) {
    const { esc, shared } = ctx;
    const brand = esc(shared?.productName || '');
    const cols = (data.columns || [])
      .map((c) => {
        const links = (c.links || []).map((l) => `<a href="${esc(safeUrl(l.href))}">${esc(l.label)}</a>`).join('');
        return `<div class="fcol"><b>${esc(c.title)}</b>${links}</div>`;
      })
      .join('');
    return `<div class="footer ${variant === 'slim' ? 'slim' : ''}"><div class="container">` +
      `<div class="fbrand">${brand}</div><div class="fcols">${cols}</div></div></div>`;
  },
};
