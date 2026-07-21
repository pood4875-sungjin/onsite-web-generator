import { safeUrl } from '../url.js';

export const cta = {
  type: 'cta',
  variants: ['band', 'boxed'],
  slots: {
    heading: { kind: 'text', required: true },
    sub:     { kind: 'text', default: '' },
    button:  { kind: 'link', item: { label: 'text', href: 'link' } },
  },
  render(data, variant, ctx) {
    const { esc } = ctx;
    const b = data.button || {};
    const sub = data.sub ? `<p class="sub">${esc(data.sub)}</p>` : '';
    const btn = b.label ? `<a class="btn primary" href="${esc(safeUrl(b.href))}">${esc(b.label)}</a>` : '';
    return `<div class="band ${variant === 'boxed' ? 'boxed' : 'alt'}"><div class="container center">` +
      `<h2 class="h-sec">${esc(data.heading)}</h2>${sub}<div class="row">${btn}</div></div></div>`;
  },
};
