export const hero = {
  type: 'hero',
  variants: ['split', 'center'],
  slots: {
    eyebrow: { kind: 'text', default: '' },
    title:   { kind: 'text', required: true },
    lead:    { kind: 'text', default: '' },
    ctas:    { kind: 'list', min: 0, max: 2, item: { label: 'text', href: 'link' } },
    media:   { kind: 'media', default: null },
  },
  render(data, variant, ctx) {
    const { esc } = ctx;
    const center = variant === 'center';
    const ctas = (data.ctas || [])
      .map((c, i) =>
        `<a class="btn ${i === 0 ? 'primary' : ''}" href="${esc(c.href)}">${esc(c.label)}</a>`)
      .join('');
    const eyebrow = data.eyebrow ? `<div class="eyebrow">${esc(data.eyebrow)}</div>` : '';
    const lead = data.lead ? `<p class="lead">${esc(data.lead)}</p>` : '';
    const txt =
      `<div>${eyebrow}<h1>${esc(data.title)}</h1>${lead}` +
      `<div class="row">${ctas}</div></div>`;
    const media = data.media
      ? `<img class="hero-media" src="${esc(data.media)}" alt="">`
      : '<div class="hero-media placeholder"></div>';
    const body = center ? txt : txt + media;
    return `<div class="container"><div class="hero ${center ? 'center' : ''}">${body}</div></div>`;
  },
};
