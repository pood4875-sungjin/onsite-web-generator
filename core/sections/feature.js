export const feature = {
  type: 'feature',
  variants: ['grid', 'list'],
  slots: {
    eyebrow: { kind: 'text', default: '' },
    heading: { kind: 'text', required: true },
    sub:     { kind: 'text', default: '' },
    items:   { kind: 'list', min: 2, max: 12, item: { title: 'text', desc: 'text' } },
  },
  render(data, variant, ctx) {
    const { esc } = ctx;
    const eyebrow = data.eyebrow ? `<div class="eyebrow">${esc(data.eyebrow)}</div>` : '';
    const sub = data.sub ? `<p class="sub">${esc(data.sub)}</p>` : '';
    const cards = (data.items || [])
      .map((it) =>
        `<div class="card"><h3>${esc(it.title)}</h3><p class="muted">${esc(it.desc)}</p></div>`)
      .join('');
    const layout = variant === 'list' ? 'stack' : 'grid';
    return (
      `<div class="band"><div class="container">` +
      `<div class="center">${eyebrow}<h2 class="h-sec">${esc(data.heading)}</h2>${sub}</div>` +
      `<div class="${layout}">${cards}</div></div></div>`
    );
  },
};
