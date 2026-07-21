export const nav = {
  type: 'nav',
  variants: ['solid', 'transparent'],
  slots: {
    links: { kind: 'list', min: 0, max: 8, item: { label: 'text', href: 'link' } },
    cta:   { kind: 'link', default: null, item: { label: 'text', href: 'link' } },
  },
  render(data, variant, ctx) {
    const { esc, shared } = ctx;
    const brand = esc(shared?.productName || '');
    const links = (data.links || [])
      .map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`)
      .join('');
    const c = data.cta;
    const ctaHtml = c && c.label ? `<a class="btn primary" href="${esc(c.href)}">${esc(c.label)}</a>` : '';
    return `<div class="gnb ${variant === 'transparent' ? 'trans' : ''}">` +
      `<div class="logo">${brand}</div><nav>${links}</nav>${ctaHtml}</div>`;
  },
};
